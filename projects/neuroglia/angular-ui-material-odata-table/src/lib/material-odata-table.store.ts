import { Injectable, Type, inject } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import {
  ColumnDefinition,
  Filter,
  Filters,
  ODataTableState,
  ODataTableStore,
  SerializedFilter,
} from '@neuroglia/angular-ngrx-component-store-odata-table';
import { isSet } from '@neuroglia/common';
import { ColumnSettingsDialogData, FilterDialogData } from './models';
import { ColumnSettingsComponent } from './components';

/** A typeguard for @see {@link Filters}  */
function isFilters(filters: Filters | SerializedFilter[]): filters is Filters {
  return !Array.isArray(filters);
}

/** The state of an OData table specialized for AngularMaterial */
@Injectable()
export class MaterialODataTableStore<
  TState extends ODataTableState<TData> = ODataTableState<any>,
  TData = any,
> extends ODataTableStore<ODataTableState<TState>> {
  protected readonly dialog = inject(MatDialog);

  constructor() {
    super();
  }

  /**
   * Shows a filter's dialog and handles the return
   */
  showFilterDialog(dialogType: Type<any>, columnDefinition: ColumnDefinition, filter: Filter | null) {
    const config = new MatDialogConfig();
    config.data = { columnDefinition, filter } as FilterDialogData;
    const dialogRef = this.dialog.open(dialogType, config);
    dialogRef.afterClosed().subscribe((result: Filter | string) => {
      if (result == null) return; // closed without action
      let filters = { ...this.get((state) => state.filters) } as Filters | SerializedFilter[];
      if (isFilters(filters)) {
        if (result === '') {
          // clear button
          if (!!filters[columnDefinition.name]) {
            delete filters[columnDefinition.name];
          }
        } else {
          // filter
          filters[columnDefinition.name] = result as Filter;
        }
      }
      // remove filters returning an empty value
      filters = Object.fromEntries(Object.entries(filters).filter(([, filter]) => !!filter.asODataQueryFilter()));
      this.filter(filters);
    });
  }

  /**
   * Shows the columns settings dialog and handles the return
   */
  showColumnSettingsDialog() {
    const config = new MatDialogConfig();
    const columnDefinitions = this.get((state) => state.columnDefinitions)
      .sort((prev, next) => (prev.position || 9999) - (next.position || 9999))
      .map((def) => ({ ...def }));
    config.data = { columnDefinitions } as ColumnSettingsDialogData;
    const dialogRef = this.dialog.open(ColumnSettingsComponent, config);
    dialogRef.afterClosed().subscribe((columnDefinitions: ColumnDefinition[] | null | undefined) => {
      if (!columnDefinitions) return;
      this.patchState({ columnDefinitions });
      if (isSet(this.columnSettingsStorage)) this.columnSettingsStorage.setItem(columnDefinitions);
    });
  }
}
