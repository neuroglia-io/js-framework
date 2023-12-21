import { animate, state, style, transition, trigger } from '@angular/animations';
import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { Sort as MatSort } from '@angular/material/sort';
import { Paging, Sort } from '@neuroglia/angular-data-source-queryable';
import {
  ColumnDefinition,
  Filters,
  IQueryableTableComponent,
  ShowFilterEvent,
  expandRowColumnDefinition,
  selectRowColumnDefinition,
} from '@neuroglia/angular-ngrx-component-store-queryable-table';

@Component({
  selector: 'neuroglia-mat-queryable-table-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [
    trigger('animateExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0' })),
      state('expanded', style({ height: '*' })),
      transition('expanded <=> collapsed', animate('300ms cubic-bezier(0.5, 0.0, 0.3, 1)')),
    ]),
  ],
})
export class TableComponent {
  /** The page size options */
  pageSizeOptions: number[] = [5, 10, 20, 50];
  @Input() table: IQueryableTableComponent;
  /** The table dataSource type */
  @Input() dataSourceType: string = '';
  /** The table dataSource */
  @Input() dataSource: any[] = [];
  /** The columns definitions */
  @Input() columnDefinitions: ColumnDefinition[];
  /** The names of the active columns */
  @Input() displayedColumns: string[] = [];
  /** The number of items per page */
  @Input() pageSize: number | null;
  /** The pager index */
  @Input() pageIndex: number | null;
  /** The total number of entities */
  @Input() count: number;
  /** The sorting options  */
  @Input() sort: MatSort | null;
  /** The active filters  */
  @Input() filters: Filters;
  /** Defines if the header should be sticky */
  @Input() stickHeader: boolean;
  /** The address of the OData service endpoint */
  @Input() serviceUrl: string;
  /** The name of the entity to gather the data from */
  @Input() entityName: string;
  /** Defines if the selection checkboxes should be displayed */
  @Input() enableSelection: boolean;
  /** Defines if the rows can be expanded */
  @Input() enableRowExpansion: boolean;
  /** The expanded row, if any */
  @Input() expandedRow: any;
  /** The list of selected rows */
  @Input() selectedRows: any[];
  /** Defines if the columns settings should be shown */
  @Input() enableColumnSettings: boolean;
  /** Emits when a row is clicked */
  @Output() rowClicked: EventEmitter<any> = new EventEmitter<any>();
  /** Emits when a row is expanded */
  @Output() rowExpanded: EventEmitter<any> = new EventEmitter<any>();
  /** Emits when the selected rows changed */
  @Output() selectionChange: EventEmitter<any[]> = new EventEmitter<any[]>();
  /** Emits when sorting options changes */
  @Output() sortChange: EventEmitter<Sort | null> = new EventEmitter<Sort | null>();
  /** Emits when paging options changes */
  @Output() pageChange: EventEmitter<Paging> = new EventEmitter<Paging>();
  /** Emits when the filter button is clicked */
  @Output() showFilter: EventEmitter<ShowFilterEvent> = new EventEmitter<ShowFilterEvent>();
  /** Emits when the column settings button is clicked */
  @Output() showColumnSettings: EventEmitter<void> = new EventEmitter<void>();

  selectRowColumnDefinition = selectRowColumnDefinition;
  expandRowColumnDefinition = expandRowColumnDefinition;

  /** If the row is selected */
  isSelected(row: any): boolean {
    return this.selectedRows.find((r) => r === row);
  }

  /** Whether the number of selected elements matches the total number of rows. */
  isAllSelected() {
    const numSelected = this.selectedRows.length;
    const numRows = this.dataSource.length;
    return numSelected === numRows;
  }

  /** Toggles the targeted row selection */
  toggleRow(row: any) {
    if (this.isSelected(row)) {
      this.selectionChange.emit([...this.selectedRows.filter((r) => r !== row)]);
    } else {
      this.selectionChange.emit([...this.selectedRows, row]);
    }
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  toggleAllRows() {
    if (this.isAllSelected()) {
      this.selectionChange.emit([]);
      return;
    }
    this.selectionChange.emit([...this.dataSource]);
  }

  /** The label for the checkbox on the passed row */
  checkboxLabel(row?: any): string {
    if (!row) {
      return `${this.isAllSelected() ? 'deselect' : 'select'} all`;
    }
    return `${this.isSelected(row) ? 'deselect' : 'select'} row ${row.position + 1}`;
  }

  matSortChanged(sort: MatSort) {
    this.sortChange.emit(sort ? { column: sort.active, direction: sort.direction } : undefined);
  }

  whenExpansionEnabled = (index: number, row: any): boolean => this.enableRowExpansion;

  hasSelection = () => !!this.selectedRows.length;
}
