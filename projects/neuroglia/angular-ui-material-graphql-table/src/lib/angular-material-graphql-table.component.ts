import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MaterialGraphQLTableStore } from './material-graphql-table.store';
import {
  MATERIAL_QUERYABLE_TABLE_STORE,
  NeurogliaNgMatQueryableDataTableComponent,
} from '@neuroglia/angular-ui-material-queryable-table';

@Component({
  selector: 'neuroglia-mat-graphql-table',
  templateUrl: './angular-material-graphql-table.component.html',
  styleUrls: ['./angular-material-graphql-table.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [{ provide: MATERIAL_QUERYABLE_TABLE_STORE, useClass: MaterialGraphQLTableStore }],
})
export class NeurogliaNgMatGraphQLDataTableComponent extends NeurogliaNgMatQueryableDataTableComponent {}
