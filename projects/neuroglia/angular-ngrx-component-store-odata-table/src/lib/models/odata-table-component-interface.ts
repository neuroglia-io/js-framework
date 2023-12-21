import { ODataTableConfig } from './odata-table-config';
import { IQueryableTableComponent } from '@neuroglia/angular-ngrx-component-store-queryable-table';

export interface IODataTableComponent extends IQueryableTableComponent {
  configuration: ODataTableConfig;
}
