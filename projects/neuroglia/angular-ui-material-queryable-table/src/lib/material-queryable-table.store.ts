import { Injectable, Type, inject } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { isSet } from '@neuroglia/common';
import { ColumnSettingsDialogData, FilterDialogData } from './models';
import { ColumnSettingsComponent } from './components';
import {
  ColumnDefinition,
  Filter,
  Filters,
  QueryableTableState,
  QueryableTableStore,
  SerializedFilter,
} from '@neuroglia/angular-ngrx-component-store-queryable-table';
import { QueryableDataSource } from '@neuroglia/angular-data-source-queryable';
import { Observable } from 'rxjs';

/** A typeguard for @see {@link Filters}  */
export function isFilters(filters: Filters | SerializedFilter[]): filters is Filters {
  return !Array.isArray(filters);
}

@Injectable()
/** The state of a queriable table specialized for AngularMaterial */
export class MaterialQueryableTableStore<
  TState extends QueryableTableState<TData> = QueryableTableState<any>,
  TData = any,
> extends QueryableTableStore<TState, TData> {
  protected readonly dialog = inject(MatDialog);

  constructor() {
    super();
  }

  protected getServiceEndpoint(initialState: Partial<TState>): string {
    throw new Error('Method not implemented.');
  }
  protected getColumnDefinitions(initialState: Partial<TState>): Observable<ColumnDefinition[]> {
    throw new Error('Method not implemented.');
  }
  protected getStringType(): string {
    throw new Error('Method not implemented.');
  }
  protected injectDataSource(): QueryableDataSource<TData> {
    throw new Error('Method not implemented.');
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
      this.patchState({ columnDefinitions } as Partial<TState>);
      if (isSet(this.columnSettingsStorage)) this.columnSettingsStorage.setItem(columnDefinitions);
    });
  }
}

/**
 * Mixin attempt, fails down the line
 * 
 
import { Injectable, Type, inject } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { isSet } from '@neuroglia/common';
import { ColumnSettingsDialogData, FilterDialogData } from './models';
import { ColumnSettingsComponent } from './components';
import { ColumnDefinition, Filter, Filters, QueryableTableState, QueryableTableStore, SerializedFilter,  } from '@neuroglia/angular-ngrx-component-store-queryable-table';
import { QueryableDataSource } from '@neuroglia/angular-data-source-queryable';
import { Observable } from 'rxjs';

export abstract class WithDialog { 
  readonly dialog: MatDialog;
  abstract showFilterDialog(dialogType: Type<any>, columnDefinition: ColumnDefinition, filter: Filter | null): void;
  abstract showColumnSettingsDialog(): void;
}

/** A typeguard for @see {@link Filters}  *\
export function isFilters(filters: Filters | SerializedFilter[]): filters is Filters {
  return !Array.isArray(filters);
}

export interface MaterialQueryableTableStore<
  TState extends QueryableTableState<TData> = QueryableTableState<any>,
  TData = any
> extends QueryableTableStore<TState, TData>, WithDialog {}

export function showFilterDialog<
  TState extends QueryableTableState<TData> = QueryableTableState<any>,
  TData = any
>(this: MaterialQueryableTableStore<TState, TData>, dialogType: Type<any>, columnDefinition: ColumnDefinition, filter: Filter | null) {
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

export function showColumnSettingsDialog<
  TState extends QueryableTableState<TData> = QueryableTableState<any>,
  TData = any
>(this: MaterialQueryableTableStore<TState, TData>) {
  const config = new MatDialogConfig();
  const columnDefinitions = this.get((state) => state.columnDefinitions)
    .sort((prev, next) => (prev.position || 9999) - (next.position || 9999))
    .map((def) => ({ ...def }));
  config.data = { columnDefinitions } as ColumnSettingsDialogData;
  const dialogRef = this.dialog.open(ColumnSettingsComponent, config);
  dialogRef.afterClosed().subscribe((columnDefinitions: ColumnDefinition[] | null | undefined) => {
    if (!columnDefinitions) return;
    this.patchState({ columnDefinitions } as Partial<TState>);
    if (isSet(this.columnSettingsStorage)) this.columnSettingsStorage.setItem(columnDefinitions);
  });
}

@Injectable()
/** The state of a queriable table specialized for AngularMaterial *\
export class MaterialQueryableTableStore<
  TState extends QueryableTableState<TData> = QueryableTableState<any>,
  TData = any,
> extends QueryableTableStore<TState, TData> {
  
  readonly dialog = inject(MatDialog);

  constructor() {
    super();
  }
  protected getServiceEndpoint(initialState: Partial<TState>): string {
    throw new Error('Method not implemented.');
  }
  protected getColumnDefinitions(initialState: Partial<TState>): Observable<ColumnDefinition[]> {
    throw new Error('Method not implemented.');
  }
  protected getStringType(): string {
    throw new Error('Method not implemented.');
  }
  protected injectDataSource(): QueryableDataSource<TData> {
    throw new Error('Method not implemented.');
  }

  /**
   * Shows a filter's dialog and handles the return
   *\
  showFilterDialog = showFilterDialog;

  /**
   * Shows the columns settings dialog and handles the return
   *\
  showColumnSettingsDialog = showColumnSettingsDialog;
}

 */
