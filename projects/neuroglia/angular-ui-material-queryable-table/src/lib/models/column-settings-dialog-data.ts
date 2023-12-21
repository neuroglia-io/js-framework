import { ColumnDefinition } from '@neuroglia/angular-ngrx-component-store-queryable-table';

/**
 * The data passed to the column settings dialog
 */
export interface ColumnSettingsDialogData {
  columnDefinitions: ColumnDefinition[];
}
