import { Observable } from 'rxjs';
import { QueryableTableState } from './queryable-table.state';
import { ColumnDefinition } from './column-definition';
import { Paging, Sort } from '@neuroglia/angular-data-source-queryable';
import { Filters } from './filters';
import { QueryableTableConfig } from './queryable-table-config';

export interface IQueryableTableStore<
  TState extends QueryableTableState<TData> = QueryableTableState<any>,
  TData = any,
  TConfig extends QueryableTableConfig = QueryableTableConfig,
> {
  /** Selects the data */
  data$: Observable<TData[]>;
  /** Selects the error */
  error$: Observable<string>;
  /** Selects the column definitions */
  columnDefinitions$: Observable<ColumnDefinition[]>;
  /** Selects the data source type */
  dataSourceType$: Observable<string>;
  /** Selects the service url */
  serviceUrl$: Observable<string>;
  /** Selects the entity name */
  target$: Observable<string>;
  /** Selects the data url */
  dataUrl$: Observable<string>;
  /** Selects the selection feature state */
  enableSelection$: Observable<boolean>;
  /** Selects the selected rows */
  selectedRows$: Observable<TData[]>;
  /** Selects the expandable row feature state */
  enableRowExpansion$: Observable<boolean>;
  /** Selects the expanded row */
  expandedRow$: Observable<TData | null>;
  /** Selects the select options */
  select$: Observable<(keyof TData)[] | null>;
  /** Selects the expand options */
  expand$: Observable<string[] | null>;
  /** Selects stick header */
  stickHeader$: Observable<boolean>;
  /** Selects the loading state */
  isLoading$: Observable<boolean>;
  /** Selects the count */
  count$: Observable<number>;
  /** Selects the sorting options */
  sort$: Observable<Sort | null>;
  /** Selects the page size */
  pageSize$: Observable<number | null>;
  /** Selects the page index */
  pageIndex$: Observable<number | null>;
  /** Selects the filters */
  filters$: Observable<Filters>;
  /** Select the flag to enable column settings */
  enableColumnSettings$: Observable<boolean>;
  /** Combined selectors */
  /** Select the names of active columns */
  displayedColumns$: Observable<string[]>;

  /**
   * Initializes the state and its underlying datasource
   * @param initialState A partial state with at least the service URL, the entity name and the column definitions
   */
  init(config: TConfig): Observable<TState>;
  /**
   * Clears persisted data
   */
  clear(): void;
  /**
   * Frees the resources
   */
  destroy(): void;
  /**
   * Sorts the data
   * @param sort The sorting option
   */
  sort(sort: Sort | null): void;
  /**
   * Pages the data
   * @param paging The paging options
   */
  page(paging: Paging): void;
  /**
   * Filters the data
   * @param filters The filters to apply
   */
  filter(filters: Filters): void;
  /** Marks the targeted rows as a selected */
  selectRows(rows?: TData[]): void;
  /** Expands (or hide) a row */
  expandRow(expandedRow?: TData): void;
  /**
   * Reloads the data source
   */
  reload(): void;
}
