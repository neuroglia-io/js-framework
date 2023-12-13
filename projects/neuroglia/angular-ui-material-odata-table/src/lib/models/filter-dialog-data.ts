import { ColumnDefinition, Filter } from '@neuroglia/angular-ngrx-component-store-odata-table';

/**
 * The data passed to a filter dialog
 */
export interface FilterDialogData {
  columnDefinition: ColumnDefinition;
  filter: Filter;
}
