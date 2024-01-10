import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MaterialODataTableStore } from './material-odata-table.store';
import {
  MATERIAL_QUERYABLE_TABLE_STORE,
  NeurogliaNgMatQueryableDataTableComponent,
} from '@neuroglia/angular-ui-material-queryable-table';

@Component({
  selector: 'neuroglia-mat-odata-table',
  templateUrl: './angular-material-odata-table.component.html',
  styleUrls: ['./angular-material-odata-table.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [{ provide: MATERIAL_QUERYABLE_TABLE_STORE, useClass: MaterialODataTableStore }],
})
export class NeurogliaNgMatDataTableComponent extends NeurogliaNgMatQueryableDataTableComponent {}
