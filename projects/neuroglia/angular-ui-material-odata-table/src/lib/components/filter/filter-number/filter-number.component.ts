import { Component, ChangeDetectionStrategy, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { IFilterComponent } from '@neuroglia/angular-ngrx-component-store-odata-table';
import { FilterNumber } from './filter-number';
import { FilterDialogData } from '../../../models';

@Component({
  selector: 'neuroglia-mat-odata-table-filter-number',
  templateUrl: './filter-number.component.html',
  styleUrls: ['./filter-number.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FilterNumberComponent implements IFilterComponent {
  model: FilterNumber;

  constructor(@Inject(MAT_DIALOG_DATA) public data: FilterDialogData) {
    this.model = new FilterNumber(this.data.filter as FilterNumber);
  }
}
