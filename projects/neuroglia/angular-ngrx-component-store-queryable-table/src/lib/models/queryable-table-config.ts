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
  /** The name of the entity to gather the data from */
  entityName: string;
  /** The name of the fully qualified entity to gather the data from */
  entityFullyQualifiedName?: string;
  /** Defines if the metadata should be gather to build the column definitions. If both `useMetadata` and `columnDefinitions`, they will be merged. */
  useMetadata: boolean;
  /** The table columns configuration */
  columnDefinitions: ColumnDefinition[];
  /** The endpoint to gather the data from, default is `serviceUrl` + `entityName` */
  dataUrl?: string;
  /** The list of navigation properties to expand */
  expand?: string[];
  /** The list of properties to select, all by default */
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
