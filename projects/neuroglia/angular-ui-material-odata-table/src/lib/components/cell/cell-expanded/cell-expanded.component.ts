import { Component, ChangeDetectionStrategy, Input } from '@angular/core';
import {
  ColumnDefinition,
  ICellComponent,
  IODataTableComponent,
} from '@neuroglia/angular-ngrx-component-store-odata-table';

@Component({
  selector: 'neuroglia-mat-odata-table-cell-expanded',
  templateUrl: './cell-expanded.component.html',
  styleUrls: ['./cell-expanded.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CellExpandedComponent implements ICellComponent {
  /** The OData table container */
  @Input() odataTable: IODataTableComponent;
  /** The row data */
  @Input() row: any;
  /** The column definition */
  @Input() columnDefinition: ColumnDefinition;
  /** The address of the OData service endpoint */
  @Input() serviceUrl: string;
  /** The name of the entity to gather the data from */
  @Input() entityName: string;
}
