import { SimpleChanges } from '@angular/core';
import { ColumnDefinition } from './column-definition';
import { IODataTableComponent } from './odata-table-component-interface';

/**
 * Represents a cell component
 */
export interface ICellComponent<T = any> {
  /** The OData table container */
  odataTable: IODataTableComponent;
  /** The data */
  row: T;
  /** The column definition */
  columnDefinition: ColumnDefinition;
  /** The address of the OData service endpoint */
  serviceUrl: string;
  /** The name of the entity to gather the data from */
  entityName: string;
  /** The implementation of OnChange, if any */
  ngOnChanges?: (changes: SimpleChanges) => void;
}
