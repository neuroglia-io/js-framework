import { Component, ChangeDetectionStrategy, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { IFilterComponent } from '@neuroglia/angular-ngrx-component-store-odata-table';
import { FilterString } from './filter-string';
import { FilterDialogData } from '../../../models';

@Component({
  selector: 'neuroglia-mat-odata-table-filter-string',
  templateUrl: './filter-string.component.html',
  styleUrls: ['./filter-string.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FilterStringComponent implements IFilterComponent {
  model: FilterString;

  constructor(@Inject(MAT_DIALOG_DATA) public data: FilterDialogData) {
    this.model = new FilterString(this.data.filter as FilterString);
  }
}
