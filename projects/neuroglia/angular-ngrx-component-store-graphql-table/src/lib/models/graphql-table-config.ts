import { QueryableTableConfig } from '@neuroglia/angular-ngrx-component-store-queryable-table';

export interface GraphQLTableConfig extends QueryableTableConfig {
  /** The path to a specific field in the returned type of the target query, if any */
  targetSubField?: string | string[];
  /** The path to the field holding the total entries count in the response */
  countSubField?: string | string[];
  /** The path to the field holding the data in the response */
  dataSubField?: string | string[];
  /** The maximum depth to gather the response for */
  queryBodyMaxDepth?: number;
}
