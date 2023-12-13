import { Sort } from '@neuroglia/angular-datasource-odata';
import { ColumnDefinition } from './column-definition';
import { Filters } from './filters';
import { SerializedFilter } from './serialized-filter';
import { Metadata } from './odata-metadata';

/**
 * Represents the state of an OData table
 */
export interface ODataTableState<T> {
  /** The data used to populate the table */
  data: T[];
  /** Any error occuring while gathering the data */
  error: string;
  /** Defines if the metadata should be gather to build the column definitions. If both `useMetadata` and `columnDefinitions`, they will be merged. */
  useMetadata: boolean;
  /** The list of column definitions */
  columnDefinitions: ColumnDefinition[];
  /** The OData service endpoint */
  serviceUrl: string;
  /** The targeted OData entity */
  entityName: string;
  /** The fully qualified name of the OData entity */
  entityFullyQualifiedName: string;
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
  select: string[] | null;
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
  /** The OData service metadata */
  metadata: Metadata | null;
  /** The base query string to use */
  query: string;
  /** Defines if the column settings should be displayed, default true */
  enableColumnSettings: boolean;
}
