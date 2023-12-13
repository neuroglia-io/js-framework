import { ColumnDefinition } from '@neuroglia/angular-ngrx-component-store-odata-table';

/**
 * The data passed to the column settings dialog
 */
export interface ColumnSettingsDialogData {
  columnDefinitions: ColumnDefinition[];
}
