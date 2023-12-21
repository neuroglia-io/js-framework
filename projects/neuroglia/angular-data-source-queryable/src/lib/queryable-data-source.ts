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
import { Expand, Filter, OrderBy, OrderByOptions, Transform } from 'odata-query';
import { ILogger } from '@neuroglia/logging';
import { NamedLoggingServiceFactory } from '@neuroglia/angular-logging';
import { HttpErrorObserverService, ODataQueryResultDto, UrlHelperService } from '@neuroglia/angular-rest-core';
import {
  CountParam,
  ExpandParam,
  FilterParam,
  OrderByParam,
  Paging,
  PagingParam,
  SearchParam,
  SelectParam,
  Sort,
  SortDirection,
  TransformParam,
} from './models';
import { HttpClient } from '@angular/common/http';
import { inject } from '@angular/core';

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
export abstract class QueryableDataSource<T = any> {
  /** The subject used to define whenever the data-source is loading data */
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
  /** The service use to create a named logger */
  protected readonly namedLoggingServiceFactory = inject(NamedLoggingServiceFactory);
  /** The @see {@link HttpClient} service */
  protected readonly http = inject(HttpClient);
  /** The @see {@link HttpErrorObserverService} service */
  protected readonly errorObserver = inject(HttpErrorObserverService);
  /** The @see {@link UrlHelperService} service */
  protected readonly urlHelperService = inject(UrlHelperService);
  /** The logger name */
  protected loggerName: string;
  /** The logger */
  protected logger: ILogger;

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

  constructor() {
    this.loggerName = `QueryableDataSource`;
    this.logger = this.namedLoggingServiceFactory.create(this.loggerName);
    this.buildODataPipeline();
  }

  /**
   * Builds the query
   * @param combinedParams
   */
  protected abstract buildQuery(
    combinedParams: [
      SelectParam<T>,
      ExpandParam<T>,
      PagingParam,
      OrderByParam<T>,
      SearchParam,
      TransformParam<T>,
      FilterParam,
      CountParam,
      null,
    ],
  ): string;

  /**
   * Queries the endpoint
   * @param query
   */
  protected abstract gatherData(query: string): Observable<ODataQueryResultDto<T>>;

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
      of({ count: true } as CountParam), // always add $count=true

      this.reloadDataSource,
    ]).pipe(
      // /!\ WARNING - Maximum arguments for pipe() almost reached (9) !
      // Consider building another pipe() if needed

      debounceTime(100), // wait if multiple params are set at once
      map(this.buildQuery),
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
  select(options: (keyof T)[] | null): QueryableDataSource<T> {
    if (!options) {
      this.selectSource.next(null);
      return this;
    }
    this.selectSource.next({ select: options });
    return this;
  }

  /**
   * Sets the expand options
   * @param options
   */
  expand(options: Expand<T> | null): QueryableDataSource<T> {
    if (!options) {
      this.expandSource.next(null);
      return this;
    }
    this.expandSource.next({ expand: options });
    return this;
  }

  /**
   * Sets the paging (top/skip) options
   * @param options
   */
  page(options: Paging | null): QueryableDataSource<T> {
    if (!options) {
      this.pagingSource.next(null);
      return this;
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
    return this;
  }

  /**
   * Sets the sorting (oderBy) options
   * @param options
   */
  orderBy(options: Sort[] | null): QueryableDataSource<T> {
    if (!options) {
      this.orderBySource.next(null);
      return this;
    }
    const orderBy: OrderBy<T> = options
      .filter((option) => !!option.direction)
      .map((option) => [option.column, option.direction] as [keyof T, 'asc' | 'desc']);
    const param: OrderByParam<T> = { orderBy };
    this.orderBySource.next(param);
    return this;
  }

  /**
   * Sets the filter options
   * @param options
   */
  filter(options: Filter | null): QueryableDataSource<T> {
    if (!options) {
      this.filterSource.next(null);
      return this;
    }
    this.filterSource.next({ filter: options });
    return this;
  }

  /**
   * Sets the search options
   * @param options
   */
  search(options: string | null): QueryableDataSource<T> {
    if (!options) {
      this.searchSource.next(null);
      return this;
    }
    this.searchSource.next({ search: options });
    return this;
  }

  /**
   * Sets the transform options
   * @param options
   */
  transform(options: Transform<T> | null): QueryableDataSource<T> {
    if (!options) {
      this.transformSource.next(null);
      return this;
    }
    this.transformSource.next({ transform: options });
    return this;
  }

  /**
   * Reloads the data
   */
  reload(): QueryableDataSource<T> {
    this.reloadDataSource.next(null);
    return this;
  }
}
