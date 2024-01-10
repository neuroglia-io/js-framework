import { Injectable, Type, inject } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { ODataTableStore } from '@neuroglia/angular-ngrx-component-store-odata-table';
import { isSet } from '@neuroglia/common';
import {
  ColumnDefinition,
  Filter,
  Filters,
  QueryableTableState,
  SerializedFilter,
} from '@neuroglia/angular-ngrx-component-store-queryable-table';
import {
  ColumnSettingsComponent,
  ColumnSettingsDialogData,
  FilterDialogData,
  IMaterialQueryableTableStore,
  isFilters,
  showColumnSettingsDialog,
  showFilterDialog,
} from '@neuroglia/angular-ui-material-queryable-table';

/** The state of an OData table specialized for AngularMaterial */
@Injectable()
export class MaterialODataTableStore<TState extends QueryableTableState<TData> = QueryableTableState<any>, TData = any>
  extends ODataTableStore<TState, TData>
  implements IMaterialQueryableTableStore<TState, TData>
{
  readonly dialog = inject(MatDialog);

  constructor() {
    super();
  }

  /**
   * Shows a filter's dialog and handles the return
   */
  showFilterDialog = showFilterDialog;

  /**
   * Shows the columns settings dialog and handles the return
   */
  showColumnSettingsDialog = showColumnSettingsDialog;
}
