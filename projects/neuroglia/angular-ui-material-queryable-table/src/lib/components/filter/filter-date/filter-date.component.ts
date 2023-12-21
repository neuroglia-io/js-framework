import { Component, ChangeDetectionStrategy, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { IFilterComponent } from '@neuroglia/angular-ngrx-component-store-queryable-table';
import { FilterDate } from './filter-date';
import { FilterDialogData } from '../../../models';

@Component({
  selector: 'neuroglia-mat-queryable-table-filter-date',
  templateUrl: './filter-date.component.html',
  styleUrls: ['./filter-date.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FilterDateComponent implements IFilterComponent {
  model: FilterDate;

  constructor(@Inject(MAT_DIALOG_DATA) public data: FilterDialogData) {
    this.model = new FilterDate(this.data.filter as FilterDate);
  }
}
