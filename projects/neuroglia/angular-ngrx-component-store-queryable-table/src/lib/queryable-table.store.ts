import { Injectable, Injector, inject } from '@angular/core';
import { Paging, QueryableDataSource, Sort } from '@neuroglia/angular-data-source-queryable';
import { StorageHandler, isSet } from '@neuroglia/common';
import { ComponentStore } from '@ngrx/component-store';
import { KeycloakService } from 'keycloak-angular';
import { Filter as ODataQueryFilter } from 'odata-query';
import { Observable } from 'rxjs';
import { map, take, takeUntil, tap } from 'rxjs/operators';
import {
  ColumnDefinition,
  Filter,
  Filters,
  QueryableTableState,
  SerializedFilter,
  expandRowColumnDefinition,
  selectRowColumnDefinition,
} from './models';
import { persistenceKeys } from './persistence-keys';
import { QueryableTableTemplateProvider } from './queryable-table-template-provider.service';

/** Creates a default empty state */
export function createEmptyQueryableTableState<T>(): QueryableTableState<T> {
  return {
    data: [],
    error: '',
    useMetadata: false,
    columnDefinitions: [],
    dataSourceType: '',
    serviceUrl: '',
    entityName: '',
    entityFullyQualifiedName: '',
    dataUrl: '',
    enableSelection: false,
    selectedRows: [],
    enableRowExpansion: false,
    expandedRow: null,
    select: null,
    expand: null,
    stickHeader: true,
    isLoading: false,
    count: 0,
    sort: null,
    pageSize: 20,
    pageIndex: 0,
    filters: {},
    metadata: null,
    query: '',
    enableColumnSettings: true,
  };
}

/** Converts `Filters` as odata-query `Filter` */
function asODataQueryFilter(filters: Filters): ODataQueryFilter {
  const filterExpressions = Object.entries(filters)
    .filter(([, filter]) => !!(filter as any).expression)
    .map(([, filter]) => (!filter.negate ? filter.asODataQueryFilter() : `not(${filter.asODataQueryFilter()})`));
  if (!filterExpressions?.length) {
    return Object.entries(filters).map(([name, filter]) =>
      !filter?.negate ? { [name]: filter.asODataQueryFilter() } : { not: { [name]: filter.asODataQueryFilter() } },
    );
  } else {
    return [
      ...filterExpressions,
      Object.entries(filters)
        .filter(([, filter]) => !(filter as any).expression)
        .map(([name, filter]) =>
          !filter?.negate ? { [name]: filter.asODataQueryFilter() } : { not: { [name]: filter.asODataQueryFilter() } },
        ),
    ];
  }
}

export abstract class QueryableTableStore<
  TState extends QueryableTableState<TData> = QueryableTableState<any>,
  TData = any,
> extends ComponentStore<TState> {
  /** State selectors */
  /** Selects the data */
  data$ = this.select((state) => state.data);
  /** Selects the error */
  error$ = this.select((state) => state.error);
  /** Selects the column definitions */
  columnDefinitions$ = this.select((state) => state.columnDefinitions);
  /** Selects the data source type */
  dataSourceType$ = this.select((state) => state.dataSourceType);
  /** Selects the service url */
  serviceUrl$ = this.select((state) => state.serviceUrl);
  /** Selects the entity name */
  entityName$ = this.select((state) => state.entityName);
  /** Selects the data url */
  dataUrl$ = this.select((state) => state.dataUrl);
  /** Selects the selection feature state */
  enableSelection$ = this.select((state) => state.enableSelection);
  /** Selects the selected rows */
  selectedRows$ = this.select((state) => state.selectedRows);
  /** Selects the expandable row feature state */
  enableRowExpansion$ = this.select((state) => state.enableRowExpansion);
  /** Selects the expanded row */
  expandedRow$ = this.select((state) => state.expandedRow);
  /** Selects the select options */
  select$ = this.select((state) => state.select);
  /** Selects the expand options */
  expand$ = this.select((state) => state.expand);
  /** Selects stick header */
  stickHeader$ = this.select((state) => state.stickHeader);
  /** Selects the loading state */
  isLoading$ = this.select((state) => state.isLoading);
  /** Selects the count */
  count$ = this.select((state) => state.count);
  /** Selects the sorting options */
  sort$ = this.select((state) => state.sort);
  /** Selects the page size */
  pageSize$ = this.select((state) => state.pageSize).pipe(map((pageSize) => pageSize || null)); // removes undefined from possible types
  /** Selects the page index */
  pageIndex$ = this.select((state) => state.pageIndex).pipe(map((pageIndex) => pageIndex || null)); // removes undefined from possible types
  /** Selects the filters */
  filters$ = this.select((state) => state.filters as Filters);
  /** Select the flag to enable column settings */
  enableColumnSettings$ = this.select((state) => state.enableColumnSettings);

  /** Combined selectors */
  /** Select the names of active columns */
  displayedColumns$ = this.select(this.columnDefinitions$, (columnDefinitions) =>
    (columnDefinitions || [])
      .filter((col) => col.isVisible)
      .sort((prev, next) => (prev.position || 9999) - (next.position || 9999))
      .map((col) => col.name),
  );

  /** Holds the datasource instance */
  protected dataSource: QueryableDataSource<TData> | null;
  /** Holds the serializers */
  protected columnSettingsStorage: StorageHandler<ColumnDefinition[]> | null;
  protected filtersStorage: StorageHandler<SerializedFilter[]> | null;
  protected sortStorage: StorageHandler<Sort | null> | null;
  protected pageSizeStorage: StorageHandler<number | null | undefined> | null;
  protected pageIndexStorage: StorageHandler<number | null | undefined> | null;
  /** The subject used to notify destruction */
  //protected destroyNotifier: Subject<void> = new Subject<void>();

  /** The @see {@link QueryableTableTemplateProvider} */
  protected queryableTableTemplateProvider = inject(QueryableTableTemplateProvider);
  /** The @see {@link KeycloakService} */
  protected keycloak = inject(KeycloakService);
  /** The  @see {@link Injector} */
  protected injector = inject(Injector);

  constructor() {
    super(createEmptyQueryableTableState<TData>() as TState);
  }

  /**
   * Builts the service endpoint URL based on the provided state
   * @param state
   */
  protected abstract getServiceEndpoint(initialState: Partial<TState>): string;

  /**
   * Gets the @see {@link ColumnDefinition}s for the provided state
   * @param initialState
   */
  protected abstract getColumnDefinitions(initialState: Partial<TState>): Observable<ColumnDefinition[]>;

  /**
   * Returns a the string type for the current datasource, e.g. 'Edm.String' for OData
   */
  protected abstract getStringType(): string;

  /**
   * Instanciates and returns the store's data source
   */
  protected abstract injectDataSource(): QueryableDataSource<TData>;

  /**
   * Initializes the state and its underlying datasource
   * @param initialState A partial state with at least the service URL, the entity name and the column definitions
   */
  init(initialState: Partial<TState>): Observable<TState> {
    if (this.dataSource) {
      throw 'The store has already been initialized for this component';
    }
    if (!initialState.dataSourceType) {
      throw 'Unable to initialize, missing service data source type';
    }
    if (!initialState.serviceUrl) {
      throw 'Unable to initialize, missing service URL';
    }
    if (!initialState.entityName) {
      throw 'Unable to initialize, missing entity name';
    }
    if (!initialState.useMetadata && !initialState.columnDefinitions) {
      throw 'Unable to initialize, missing columns definitions';
    }
    const dataUrl = this.getServiceEndpoint(initialState);
    this.columnSettingsStorage = new StorageHandler<ColumnDefinition[]>(
      persistenceKeys.columnSettings + '::' + dataUrl,
    );
    this.filtersStorage = new StorageHandler(persistenceKeys.filters + '::' + dataUrl, null, window.sessionStorage);
    this.sortStorage = new StorageHandler(persistenceKeys.sort + '::' + dataUrl, null, window.sessionStorage);
    this.pageSizeStorage = new StorageHandler(persistenceKeys.pageSize + '::' + dataUrl, null, window.sessionStorage);
    this.pageIndexStorage = new StorageHandler(persistenceKeys.pageIndex + '::' + dataUrl, null, window.sessionStorage);
    let metadata: unknown;
    return this.getColumnDefinitions(initialState).pipe(
      tap((definitions: ColumnDefinition[]) => {
        const userPreferences = this.columnSettingsStorage!.getItem() || [];
        if (initialState.enableSelection) {
          definitions = [selectRowColumnDefinition, ...definitions];
        }
        if (initialState.enableRowExpansion) {
          definitions = [expandRowColumnDefinition, ...definitions];
        }
        const columnDefinitions = definitions.map((def, index) => {
          const columnDefinition = { ...def };
          const userPreference = userPreferences.find((columnDef) => columnDef.name === def.name);
          columnDefinition.type = def.type || this.getStringType();
          if (userPreference) {
            if (userPreference.position != null) columnDefinition.position = userPreference.position;
            if (userPreference.isVisible != null) columnDefinition.isVisible = userPreference.isVisible;
          }
          columnDefinition.sticky = userPreference?.sticky || columnDefinition.sticky || '';
          if (def.position == null) columnDefinition.position = index + 1;
          if (def.isVisible == null) columnDefinition.isVisible = true;
          if (def.isSortable == null) columnDefinition.isSortable = false;
          if (def.isFilterable == null) columnDefinition.isFilterable = false;
          if (def.isEnum == null) columnDefinition.isEnum = false;
          if (def.isCollection == null) columnDefinition.isCollection = false;
          if (def.isNavigationProperty == null) columnDefinition.isNavigationProperty = false;
          if (def.isNullable == null) columnDefinition.isNullable = false;
          return columnDefinition;
        });
        let filters = Object.fromEntries(
          (this.filtersStorage!.getItem() || (initialState.filters as SerializedFilter[]) || [])
            .map((entry) => {
              const columnDefinition = columnDefinitions.find((colDef) => colDef.name === entry.columnName);
              if (!columnDefinition) {
                return [null, null];
              }
              const filter = this.queryableTableTemplateProvider.getFilter(
                columnDefinition,
                initialState.dataSourceType!,
                initialState.serviceUrl!,
                initialState.entityName!,
              );
              if (!filter) {
                return [null, null];
              }
              return [entry.columnName, new filter(entry.filter)];
            })
            .filter(([, filter]) => !!filter),
        ) as Filters;
        if (!Object.keys(filters).length) {
          filters = this.get((state) => state.filters as Filters);
        }
        const sort = this.sortStorage!.getItem() || initialState.sort || this.get((state) => state.sort);
        const pageSize =
          this.pageSizeStorage!.getItem() || initialState.pageSize || this.get((state) => state.pageSize);
        const pageIndex =
          this.pageIndexStorage!.getItem() || initialState.pageIndex || this.get((state) => state.pageIndex);
        const enableColumnSettings =
          initialState.enableColumnSettings === false ? false : this.get((state) => state.enableColumnSettings);
        this.patchState({
          ...initialState,
          metadata,
          dataUrl,
          columnDefinitions,
          filters,
          sort,
          pageSize,
          pageIndex,
          enableColumnSettings,
        } as TState);
        const state = this.get();
        this.dataSource = this.injectDataSource();
        if (state.select) {
          this.dataSource.select(state.select);
        }
        if (state.expand) {
          this.dataSource.expand(state.expand);
        }
        if (state.pageIndex || state.pageSize) {
          this.dataSource.page(state);
        }
        if (state.sort) {
          this.dataSource.orderBy([state.sort]);
        }
        if (state.filters) {
          this.dataSource.filter(asODataQueryFilter(state.filters as Filters));
        }
        this.dataSource.isLoading$
          .pipe(takeUntil(this.destroy$))
          .subscribe((isLoading) => this.patchState({ isLoading } as Partial<TState>));
        this.dataSource.data$
          .pipe(takeUntil(this.destroy$))
          .subscribe((data) => this.patchState({ data } as Partial<TState>));
        this.dataSource.error$
          .pipe(takeUntil(this.destroy$))
          .subscribe((error) => this.patchState({ error } as Partial<TState>));
        this.dataSource.count$
          .pipe(takeUntil(this.destroy$))
          .subscribe((count) => this.patchState({ count } as Partial<TState>));
        this.dataSource.sort$
          .pipe(
            takeUntil(this.destroy$),
            map((sorts) => (sorts?.length ? sorts[0] : null)),
          )
          .subscribe((sort) => this.patchState({ sort } as Partial<TState>));
        this.dataSource.pageSize$
          .pipe(takeUntil(this.destroy$))
          .subscribe((pageSize) => this.patchState({ pageSize } as Partial<TState>));
        this.dataSource.pageIndex$
          .pipe(takeUntil(this.destroy$))
          .subscribe((pageIndex) => this.patchState({ pageIndex } as Partial<TState>));
      }),
      map(() => this.get()),
      take(1),
    );
  }

  /**
   * Clears persisted data
   */
  clear() {
    this.columnSettingsStorage?.clear();
    this.filtersStorage?.clear();
    this.sortStorage?.clear();
    this.pageSizeStorage?.clear();
    this.pageIndexStorage?.clear();
  }

  /**
   * Frees the resources
   */
  destroy() {
    if (this.dataSource) {
      this.dataSource.disconnect();
      this.dataSource = null;
    }
  }

  /**
   * Sorts the data
   * @param sort The sorting option
   */
  sort(sort: Sort | null) {
    if (isSet(this.dataSource)) this.dataSource.orderBy(sort && sort.direction ? [sort] : null);
    if (isSet(this.sortStorage)) this.sortStorage.setItem(sort);
  }

  /**
   * Pages the data
   * @param paging The paging options
   */
  page(paging: Paging) {
    if (isSet(this.dataSource)) this.dataSource.page(paging);
    if (isSet(this.pageSizeStorage)) this.pageSizeStorage.setItem(paging.pageSize);
    if (isSet(this.pageIndexStorage)) this.pageIndexStorage.setItem(paging.pageIndex);
  }

  /**
   * Filters the data
   * @param filters The filters to apply
   */
  filter(filters: Filters) {
    this.patchState({ filters } as Partial<TState>);
    if (isSet(this.dataSource)) this.dataSource.filter(asODataQueryFilter(filters));
    const pageSize = this.get((state) => state.pageSize);
    this.page({ pageIndex: 0, pageSize });
    if (isSet(this.filtersStorage)) {
      this.filtersStorage.setItem(
        Object.entries(filters).map(
          ([columnName, filter]) =>
            ({
              columnName,
              filter,
            }) as SerializedFilter,
        ),
      );
    }
  }

  /** Marks the targeted rows as a selected */
  selectRows(rows?: TData[]) {
    const selectedRows = rows || [];
    this.patchState({ selectedRows } as Partial<TState>);
  }

  /** Expands (or hide) a row */
  expandRow(expandedRow?: TData) {
    this.patchState({ expandedRow } as Partial<TState>);
  }

  /**
   * Reloads the data source
   */
  reload() {
    if (isSet(this.dataSource)) this.dataSource.reload();
  }
}
