import { Injectable, inject } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ODataTableStore } from '@neuroglia/angular-ngrx-component-store-odata-table';
import { QueryableTableConfig, QueryableTableState } from '@neuroglia/angular-ngrx-component-store-queryable-table';
import {
  IMaterialQueryableTableStore,
  showColumnSettingsDialog,
  showFilterDialog,
} from '@neuroglia/angular-ui-material-queryable-table';

/** The state of an OData table specialized for AngularMaterial */
@Injectable()
export class MaterialODataTableStore<
    TState extends QueryableTableState<TData> = QueryableTableState<any>,
    TData = any,
    TConfig extends QueryableTableConfig = QueryableTableConfig,
  >
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
