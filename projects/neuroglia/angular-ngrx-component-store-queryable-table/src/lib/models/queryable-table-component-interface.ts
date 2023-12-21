import { ColumnDefinition } from './column-definition';
import { Filters } from './filters';
import { EventEmitter } from '@angular/core';
import { ShowFilterEvent } from './show-filter-event';
import { QueryableTableConfig } from './queryable-table-config';
import { Observable } from 'rxjs';
import { Paging, Sort } from '@neuroglia/angular-data-source-queryable';

export interface IQueryableTableComponent {
  configuration: QueryableTableConfig;
  rowClicked: EventEmitter<any>;
  rowExpanded: EventEmitter<any>;
  selectionChanged: EventEmitter<any[]>;
  columnDefinitions$: Observable<ColumnDefinition[]>;
  displayedColumns$: Observable<string[]>;
  data$: Observable<any>;
  dataSourceType$: Observable<string>;
  error$: Observable<string>;
  isLoading$: Observable<boolean>;
  stickHeader$: Observable<boolean>;
  count$: Observable<number>;
  sort$: Observable<Sort | null>;
  pageSize$: Observable<number | null>;
  pageIndex$: Observable<number | null>;
  filters$: Observable<Filters>;
  serviceUrl$: Observable<string>;
  entityName$: Observable<string>;
  enableSelection$: Observable<boolean>;
  selectedRows$: Observable<any[]>;
  enableRowExpansion$: Observable<boolean>;
  expandedRow$: Observable<any>;
  enableColumnSettings$: Observable<boolean>;

  onSortChange(sort: Sort | null): void;
  onPageChange(paging: Paging): void;
  onShowFilter(evt: ShowFilterEvent): void;
  onShowColumnSettings(): void;
  onExpandRow(row?: any): void;
  onSelectionChange(rows?: any[]): void;
  clearSelection(): void;
  reload(): void;
}
