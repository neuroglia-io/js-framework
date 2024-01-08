import { Sort } from '@neuroglia/angular-data-source-queryable';
import { ColumnDefinition } from './column-definition';
import { Filters } from './filters';
import { SerializedFilter } from './serialized-filter';

/**
 * Holds the configuration passed to the queryable table component
 */
export interface QueryableTableConfig {
  /** The type of data source queried */
  dataSourceType: string;
  /** The the service endpoint */
  serviceUrl: string;
  /** The name of the target (e.g. an EntityContainer for OData or a Query for GraphQL) to gather the data from */
  target: string;
  /** The type of the target if it cannot be infered with the target name only */
  targetType?: string;
  /** Defines if the metadata should be gathered to build the column definitions. If both `useMetadata` and `columnDefinitions`, they will be merged. */
  useMetadata: boolean;
  /** The table columns configuration */
  columnDefinitions: ColumnDefinition[];
  /** The endpoint to gather the data from, if "non standard" */
  dataUrl?: string;
  /** The list of navigation properties to expand */
  expand?: string[];
  /** The list of specific properties to select */
  select?: string[];
  /** Defines if checkboxes should be displayed in front of the rows */
  enableSelection?: boolean;
  /** Defines if the rows can be expanded */
  enableRowExpansion?: boolean;
  /** The default sorting configuration */
  sort?: Sort | null;
  /** The default filtering configuration */
  filters?: Filters | SerializedFilter[] /* SerializedFilter[] actually */;
  /** A base query string to use, if any */
  query?: string;
  /** Defines if the column settings should be displayed, default true */
  enableColumnSettings?: boolean;
}
