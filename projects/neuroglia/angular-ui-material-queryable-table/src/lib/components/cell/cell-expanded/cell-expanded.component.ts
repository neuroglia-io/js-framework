import { Component, ChangeDetectionStrategy, Input } from '@angular/core';
import {
  ColumnDefinition,
  ICellComponent,
  IQueryableTableComponent,
} from '@neuroglia/angular-ngrx-component-store-queryable-table';

@Component({
  selector: 'neuroglia-mat-queryable-table-cell-expanded',
  templateUrl: './cell-expanded.component.html',
  styleUrls: ['./cell-expanded.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CellExpandedComponent implements ICellComponent {
  /** The queryable table container */
  @Input() table: IQueryableTableComponent;
  /** The row data */
  @Input() row: any;
  /** The column definition */
  @Input() columnDefinition: ColumnDefinition;
  /** The address of the OData service endpoint */
  @Input() serviceUrl: string;
  /** The name of the entity to gather the data from */
  @Input() target: string;
}
