import { Sort } from '@neuroglia/angular-data-source-queryable';
import { ColumnDefinition } from './column-definition';
import { Filters } from './filters';
import { SerializedFilter } from './serialized-filter';

/**
 * Represents the state of an queryable table
 */
export interface QueryableTableState<T> {
  /** The data used to populate the table */
  data: T[];
  /** Any error occuring while gathering the data */
  error: string;
  /** Defines if the metadata should be gathered to build the column definitions. If both `useMetadata` and `columnDefinitions`, they will be merged. */
  useMetadata: boolean;
  /** The list of column definitions */
  columnDefinitions: ColumnDefinition[];
  /** The type of data source */
  dataSourceType: string;
  /** The service endpoint */
  serviceUrl: string;
  /** The targeted entity type name */
  target: string;
  /** The fully qualified name of the entity */
  targetType: string;
  /** The endpoint to gather the data form */
  dataUrl: string;
  /** Defines if the rows should display a selection checkbox */
  enableSelection: boolean;
  /** The list of selected rows */
  selectedRows: T[];
  /** Defines if the rows can be expanded */
  enableRowExpansion: boolean;
  /** The expanded row */
  expandedRow: T | null;
  /** The option used to restrict columns selection */
  select: (keyof T)[] | null;
  /** The option used to expand to foreign columns */
  expand: string[] | null;
  /** Defines if the table header should stick on scroll */
  stickHeader: boolean;
  /** Defines if the service is loading data */
  isLoading: boolean;
  /** The total number of entities */
  count: number;
  /** The sorting options */
  sort: Sort | null;
  /** The number of items displayed */
  pageSize: number | null | undefined;
  /** The total number of pages */
  pageIndex: number | null | undefined;
  /** The active filters */
  filters: Filters | SerializedFilter[];
  /** The queryable service metadata */
  metadata: unknown | null;
  /** The base query string to use */
  query: string;
  /** Defines if the column settings should be displayed, default true */
  enableColumnSettings: boolean;
}
