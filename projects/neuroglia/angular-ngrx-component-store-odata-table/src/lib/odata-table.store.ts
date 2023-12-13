import { HttpClient } from '@angular/common/http';
import { Injectable, Type, inject } from '@angular/core';
import { StorageHandler, isSet } from '@neuroglia/common';
import { NamedLoggingServiceFactory } from '@neuroglia/angular-logging';
import { HttpErrorObserverService, UrlHelperService } from '@neuroglia/angular-rest-core';
import { ComponentStore } from '@ngrx/component-store';
import { Observable, of } from 'rxjs';
import { filter, map, switchMap, take, takeUntil, tap } from 'rxjs/operators';
import {
  ColumnDefinition,
  Filter,
  Filters,
  ODataPrimitiveTypeEnum,
  selectRowColumnDefinition,
  expandRowColumnDefinition,
  SerializedFilter,
  ODataTableState,
} from './models';
import * as ODataMetadataSchema from './models/odata-metadata';
import { ODataMetadataService } from './odata-metadata.service';
import { persistenceKeys } from './persistence-keys';
import { Filter as ODataQueryFilter } from 'odata-query';
import { ODataTableTemplateProvider } from './odata-table-template-provider.service';
import { ODataDataSource, Paging, Sort } from '@neuroglia/angular-datasource-odata';
import { KeycloakService } from 'keycloak-angular';
import { validateAuthorizations } from '@neuroglia/authorization-rule';

/** Creates a default empty state */
export function createEmptyODataTableState<T>(): ODataTableState<T> {
  return {
    data: [],
    error: '',
    useMetadata: false,
    columnDefinitions: [],
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
    .map(([, filter]) => filter.asODataQueryFilter());
  if (!filterExpressions?.length) {
    return Object.fromEntries(Object.entries(filters).map(([name, filter]) => [name, filter.asODataQueryFilter()]));
  } else {
    return [
      ...filterExpressions,
      Object.fromEntries(
        Object.entries(filters)
          .filter(([, filter]) => !(filter as any).expression)
          .map(([name, filter]) => [name, filter.asODataQueryFilter()]),
      ),
    ];
  }
}

@Injectable()
export class ODataTableStore<
  TState extends ODataTableState<TData> = ODataTableState<any>,
  TData = any,
> extends ComponentStore<TState> {
  /** State selectors */
  /** Selects the data */
  data$ = this.select((state) => state.data);
  /** Selects the error */
  error$ = this.select((state) => state.error);
  /** Selects the column definitions */
  columnDefinitions$ = this.select((state) => state.columnDefinitions);
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

  /** The @see {@link NamedLoggingServiceFactory} */
  protected namedLoggingServiceFactory = inject(NamedLoggingServiceFactory);
  /** The @see {@link HttpClient} */
  protected http = inject(HttpClient);
  /** The @see {@link HttpErrorObserverService} */
  protected errorObserver = inject(HttpErrorObserverService);
  /** The @see {@link UrlHelperService} */
  protected urlHelperService = inject(UrlHelperService);
  /** The @see {@link ODataMetadataService} */
  protected odataMetadataService = inject(ODataMetadataService);
  /** The @see {@link ODataTableTemplateProvider} */
  protected odataTableTemplateProvider = inject(ODataTableTemplateProvider);
  /** The @see {@link KeycloakService} */
  protected keycloak = inject(KeycloakService);

  /** Holds the datasource instance */
  protected dataSource: ODataDataSource | null;
  /** Holds the serializers */
  protected columnSettingsStorage: StorageHandler<ColumnDefinition[]> | null;
  protected filtersStorage: StorageHandler<SerializedFilter[]> | null;
  protected sortStorage: StorageHandler<Sort | null> | null;
  protected pageSizeStorage: StorageHandler<number | null | undefined> | null;
  protected pageIndexStorage: StorageHandler<number | null | undefined> | null;
  /** The subject used to notify destruction */
  //protected destroyNotifier: Subject<void> = new Subject<void>();

  constructor() {
    super(createEmptyODataTableState<TData>() as TState);
  }

  /**
   * Initializes the state and its underlying datasource
   * @param initialState A partial state with at least the service URL, the entity name and the column definitions
   */
  init(initialState: Partial<TState>): Observable<TState> {
    if (this.dataSource) {
      throw 'The ODataTableStore has already been initialized for this component';
    }
    if (!initialState.serviceUrl) {
      throw 'Unable to initialize ODataTableStore, missing OData service URL';
    }
    if (!initialState.entityName) {
      throw 'Unable to initialize ODataTableStore, missing OData entity name';
    }
    if (!initialState.useMetadata && !initialState.columnDefinitions) {
      throw 'Unable to initialize ODataTableStore, missing columns definitions';
    }
    let metadata: ODataMetadataSchema.Metadata;
    const dataUrl =
      initialState.dataUrl ||
      `${initialState.serviceUrl}${!initialState.serviceUrl.endsWith('/') ? '/' : ''}${initialState.entityName}${
        initialState.query || ''
      }`;
    this.columnSettingsStorage = new StorageHandler<ColumnDefinition[]>(
      persistenceKeys.columnSettings + '::' + dataUrl,
    );
    this.filtersStorage = new StorageHandler(persistenceKeys.filters + '::' + dataUrl, null, window.sessionStorage);
    this.sortStorage = new StorageHandler(persistenceKeys.sort + '::' + dataUrl, null, window.sessionStorage);
    this.pageSizeStorage = new StorageHandler(persistenceKeys.pageSize + '::' + dataUrl, null, window.sessionStorage);
    this.pageIndexStorage = new StorageHandler(persistenceKeys.pageIndex + '::' + dataUrl, null, window.sessionStorage);
    return (
      !initialState.useMetadata
        ? of(initialState.columnDefinitions).pipe(
            filter((definitions: ColumnDefinition[] | undefined) => !!definitions?.length),
            map((definitions: ColumnDefinition[] | undefined) => definitions as ColumnDefinition[]),
          )
        : this.odataMetadataService.getMetadata(initialState.serviceUrl).pipe(
            takeUntil(this.destroy$),
            tap((md: ODataMetadataSchema.Metadata) => {
              metadata = md;
            }),
            switchMap((metadata: ODataMetadataSchema.Metadata) =>
              !initialState.entityFullyQualifiedName
                ? this.odataMetadataService.getColumnDefinitions(metadata, initialState.entityName!)
                : this.odataMetadataService.getColumnDefinitionsForQualifiedName(
                    metadata,
                    initialState.entityFullyQualifiedName,
                  ),
            ),
            map((definitions: ColumnDefinition[]) => {
              const token = this.keycloak.getKeycloakInstance().tokenParsed;
              const stateDefinitionNames = (initialState.columnDefinitions || []).map((def) => def.name);
              const columnDefinitions = [
                ...definitions.filter((def) => !stateDefinitionNames.includes(def.name)),
                ...(initialState.columnDefinitions || []).map((stateDef) => {
                  const def = definitions.find((def) => def.name === stateDef.name);
                  if (!def) {
                    return stateDef;
                  }
                  const columnDefinition = { ...def, ...stateDef };
                  return columnDefinition;
                }),
              ].filter((def) => !def.authorizations || (token && validateAuthorizations(token, def.authorizations)));
              return columnDefinitions as ColumnDefinition[];
            }),
          )
    ).pipe(
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
          columnDefinition.type = def.type || ODataPrimitiveTypeEnum.String;
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
              const filter = this.odataTableTemplateProvider.getFilter(
                columnDefinition,
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
        this.dataSource = new ODataDataSource<TData>(
          this.namedLoggingServiceFactory,
          this.http,
          this.errorObserver,
          this.urlHelperService,
          state.dataUrl,
        );
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
