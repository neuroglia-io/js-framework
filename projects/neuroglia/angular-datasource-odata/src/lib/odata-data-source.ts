import {
  BehaviorSubject,
  Observable,
  catchError,
  combineLatest,
  debounceTime,
  distinctUntilChanged,
  map,
  of,
  share,
  switchMap,
  tap,
} from 'rxjs';
import buildQuery, { Expand, Filter, OrderBy, OrderByOptions, Select, Transform } from 'odata-query';
import { ILogger } from '@neuroglia/logging';
import { inject } from '@angular/core';
import { NamedLoggingServiceFactory } from '@neuroglia/angular-logging';
import {
  HttpErrorObserverService,
  HttpRequestInfo,
  ODataQueryResultDto,
  UrlHelperService,
  logHttpRequest,
} from '@neuroglia/angular-rest-core';
import { Paging, Sort, SortDirection } from './models';
import { HttpClient } from '@angular/common/http';

declare type SelectParam<T> = { select: Select<T> } | null;
declare type ExpandParam<T> = { expand: Expand<T> } | null;
declare type PagingParam = { top?: number; skip?: number } | null;
declare type OrderByParam<T> = { orderBy: OrderBy<T> } | null;
declare type SearchParam = { search: string } | null;
declare type TransformParam<T> = { transform: Transform<T> } | null;
declare type FilterParam = { filter: Filter } | null;

/**
 * Converts an OrderBy<T> into a Sort
 * @param orderBy an OrderBy<T> payload
 * @param prefix
 * @returns an array of Sort
 */
function mapOrderByToSort<T>(orderBy: OrderBy<T>, prefix: string = ''): Sort[] | null {
  if (!orderBy) return null;
  if (typeof orderBy === 'string') {
    if (!orderBy.length) return null;
    return orderBy
      .split(',')
      .map((value) => value.trim().split(' ') as [string, SortDirection])
      .flatMap(([column, direction]) => [{ column: `${prefix}${column}`, direction: direction || '' } as Sort]);
  } else if (Array.isArray(orderBy)) {
    return (orderBy as OrderByOptions<T>[]).flatMap((value) =>
      Array.isArray(value) && value.length === 2 && ['asc', 'desc'].indexOf(value[1]) !== -1
        ? [{ column: `${prefix}${value[0].toString()}`, direction: value[1] || '' } as Sort]
        : mapOrderByToSort(value) || [],
    );
  }
  return Object.entries(orderBy).flatMap(([k, v]) => mapOrderByToSort(v as OrderBy<any>, `${k}/`) || []);
}

/**
 * Creates an empty ODataQueryResponse
 * @returns
 */
function createEmptyReponse<T>(): Observable<ODataQueryResultDto<T>> {
  return of({
    '@odata.context': 'unkown',
    '@odata.count': 0,
    value: [],
  });
}

/**
 * A data source used to handle OData interactions
 */
export class ODataDataSource<T = any> {
  /** The subject used to define whenever the DataSource is loading data */
  protected readonly isLoadingSource: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  /** The subject used to define the errors */
  protected readonly errorSource: BehaviorSubject<any | null> = new BehaviorSubject<any | null>(null);
  /** The subject used to define the total number of entries matching the OData query */
  protected readonly countSource: BehaviorSubject<number> = new BehaviorSubject<number>(0);
  /** The subject used to define the select options */
  protected readonly selectSource: BehaviorSubject<SelectParam<T>> = new BehaviorSubject<SelectParam<T>>(null);
  /** The subject used to define the expand options */
  protected readonly expandSource: BehaviorSubject<ExpandParam<T>> = new BehaviorSubject<ExpandParam<T>>(null);
  /** The subject used to define the paging options */
  protected readonly pagingSource: BehaviorSubject<PagingParam> = new BehaviorSubject<PagingParam>(null);
  /** The subject used to define the sorting options */
  protected readonly orderBySource: BehaviorSubject<OrderByParam<T>> = new BehaviorSubject<OrderByParam<T>>(null);
  /** The subject used to define the search options */
  protected readonly searchSource: BehaviorSubject<SearchParam> = new BehaviorSubject<SearchParam>(null);
  /** The subject used to define the transform options */
  protected readonly transformSource: BehaviorSubject<TransformParam<T>> = new BehaviorSubject<TransformParam<T>>(null);
  /** The subject used to define the filter options */
  protected readonly filterSource: BehaviorSubject<FilterParam> = new BehaviorSubject<FilterParam>(null);
  /** The subject used to define the action to reload data */
  protected readonly reloadDataSource: BehaviorSubject<null> = new BehaviorSubject<null>(null);
  // /** The service use to create a named logger */
  // protected namedLoggingServiceFactory = inject(NamedLoggingServiceFactory);
  // /** The @see {@link HttpClient} service */
  // protected http = inject(HttpClient);
  // /** The @see {@link HttpErrorObserverService} service */
  // protected errorObserver = inject(HttpErrorObserverService);
  // /** The @see {@link UrlHelperService} service */
  // protected urlHelperService = inject(UrlHelperService);
  /** The logger name */
  protected readonly loggerName: string;
  /** The logger */
  protected readonly logger: ILogger;

  /** Exposes the loading observable */
  isLoading$: Observable<boolean> = this.isLoadingSource.asObservable();
  /** Exposes the OData query response as observable */
  response$: Observable<ODataQueryResultDto<T>>;
  /** Exposes the data observable */
  data$: Observable<T[]>;
  /** Exposes the error observable */
  error$: Observable<string> = this.errorSource.asObservable();
  /** Exposes the count as observable */
  count$: Observable<number> = this.countSource.asObservable();
  /** Exposes the orderBy as observable */
  protected orderBy$: Observable<OrderByParam<T>> = this.orderBySource.asObservable();
  /** Exposes the orderBy mapped as Sort as observable */
  sort$: Observable<Sort[] | null> = this.orderBy$.pipe(
    map((param) => (param ? mapOrderByToSort<T>(param.orderBy) : null)),
  );
  /** Exposes the paging as observable */
  protected paging$: Observable<PagingParam> = this.pagingSource.asObservable();
  /** Exposes the paging page size as observable */
  pageSize$: Observable<number | null> = this.paging$.pipe(map((param) => param?.top || null));
  /** Exposes the paging page index as observable */
  pageIndex$: Observable<number | null> = this.paging$.pipe(
    map((param) => (param?.top ? (param.skip || 0) / param.top || null : null)),
  );

  // Note: those services at not injected. Should they be?
  constructor(
    protected namedLoggingServiceFactory: NamedLoggingServiceFactory,
    protected http: HttpClient,
    protected errorObserver: HttpErrorObserverService,
    protected urlHelperService: UrlHelperService,
    protected odataEndpoint: string,
  ) {
    this.loggerName = `ODataDataSource|${odataEndpoint}`;
    this.logger = this.namedLoggingServiceFactory.create(this.loggerName);
    this.buildODataPipeline();
  }

  /**
   * Queries the OData endpoint
   * @param query
   */
  protected gatherData(query: string): Observable<ODataQueryResultDto<T>> {
    const url: string = `${this.odataEndpoint}${!this.odataEndpoint.includes('?') ? query : query.replace('?', '&')}`;
    const httpRequestInfo: HttpRequestInfo = new HttpRequestInfo({
      clientServiceName: this.loggerName,
      methodName: 'gatherData',
      verb: 'get',
      url,
    });
    return logHttpRequest(this.logger, this.errorObserver, this.http.get<ODataQueryResultDto<T>>(url), httpRequestInfo);
  }

  /**
   * Builds the observables pipeline to handle the request
   */
  protected buildODataPipeline() {
    this.response$ = combineLatest([
      this.selectSource,
      this.expandSource,
      this.pagingSource,
      this.orderBySource,
      this.searchSource,
      this.transformSource,
      this.filterSource,
      of({ count: true }), // always add $count=true

      this.reloadDataSource,
    ]).pipe(
      // /!\ WARNING - Maximum arguments for pipe() almost reached (9) !
      // Consider building another pipe() if needed

      debounceTime(100), // wait if multiple params are set at once
      map((combinedParams) =>
        buildQuery(
          // remove empty parameters & build OData query
          Object.fromEntries(
            combinedParams
              .flatMap((param) => (param ? Object.entries(param) : []))
              .filter(([, value]) => (!Array.isArray(value) ? value != null : !!value?.length)),
          ),
        ),
      ),
      // todo: reactivate `distinctUntilChanged` in concordance with `reloadData`
      //distinctUntilChanged(), // process only if different from previous query
      tap(() => {
        this.isLoadingSource.next(true); // start loading
        if (this.errorSource.value) {
          // reset the error if any
          this.errorSource.next(null);
        }
      }),
      switchMap((query) =>
        this.gatherData(query).pipe(
          catchError((err) => {
            // if an error occurend, notify and mock an empty response
            this.errorSource.next(err);
            return createEmptyReponse<T>();
          }),
        ),
      ), // make the request
      tap((response) => {
        // populate count & end loading
        this.countSource.next(response['@odata.count']);
        this.isLoadingSource.next(false);
      }),
      share(), // not sure... shareReplay?
    );
    this.data$ = this.response$.pipe(
      map((response) => response.value),
      distinctUntilChanged(),
    );
  }

  /** Used for compatibility with Angular Material {@inheritDoc DataSource.connect} */
  connect(collectionViewer?: unknown): Observable<readonly T[]> {
    return this.data$;
  }

  /** Used for compatibility with Angular Material {@inheritDoc DataSource.disconnect} */
  disconnect(collectionViewer?: unknown): void {
    this.isLoadingSource.complete();
    this.errorSource.complete();
    this.countSource.complete();
    this.selectSource.complete();
    this.expandSource.complete();
    this.pagingSource.complete();
    this.orderBySource.complete();
    this.searchSource.complete();
    this.transformSource.complete();
    this.filterSource.complete();
    this.reloadDataSource.complete();
  }

  /**
   * Sets the select options
   * @param options
   */
  select(options: (keyof T)[] | null): void {
    if (!options) {
      this.selectSource.next(null);
      return;
    }
    this.selectSource.next({ select: options });
  }

  /**
   * Sets the expand options
   * @param options
   */
  expand(options: Expand<T> | null): void {
    if (!options) {
      this.expandSource.next(null);
      return;
    }
    this.expandSource.next({ expand: options });
  }

  /**
   * Sets the paging (top/skip) options
   * @param options
   */
  page(options: Paging | null): void {
    if (!options) {
      this.pagingSource.next(null);
      return;
    }
    let top;
    let skip;
    if (options.pageSize) {
      top = options.pageSize;
      if (options.pageIndex) {
        skip = top * options.pageIndex;
        if (!skip) {
          skip = undefined;
        }
      }
    }
    this.pagingSource.next({ top, skip });
  }

  /**
   * Sets the sorting (oderBy) options
   * @param options
   */
  orderBy(options: Sort[] | null): void {
    if (!options) {
      this.orderBySource.next(null);
      return;
    }
    const orderBy: OrderBy<T> = options
      .filter((option) => !!option.direction)
      .map((option) => [option.column, option.direction] as [keyof T, 'asc' | 'desc']);
    const param: OrderByParam<T> = { orderBy };
    this.orderBySource.next(param);
  }

  /**
   * Sets the filter options
   * @param options
   */
  filter(options: Filter | null): void {
    if (!options) {
      this.filterSource.next(null);
      return;
    }
    this.filterSource.next({ filter: options });
  }

  /**
   * Sets the search options
   * @param options
   */
  search(options: string | null): void {
    if (!options) {
      this.searchSource.next(null);
      return;
    }
    this.searchSource.next({ search: options });
  }

  /**
   * Sets the transform options
   * @param options
   */
  transform(options: Transform<T> | null): void {
    if (!options) {
      this.transformSource.next(null);
      return;
    }
    this.transformSource.next({ transform: options });
  }

  /**
   * Reloads the data
   */
  reload() {
    this.reloadDataSource.next(null);
  }
}
