import { Metadata } from './odata-metadata';
import { QueryableTableState } from '@neuroglia/angular-ngrx-component-store-queryable-table';

/**
 * Represents the state of an OData table
 */
export interface ODataTableState<T> extends QueryableTableState<T> {
  /** The OData service metadata */
  metadata: Metadata | null;
}
