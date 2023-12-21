import { Sort } from '@angular/material/sort';
import { IQueryableTableComponent } from '@neuroglia/angular-ngrx-component-store-queryable-table';
import { Observable } from 'rxjs';

export interface IMatQueryableDataTableComponent extends IQueryableTableComponent {
  matSort$: Observable<Sort | null>;
}
