import { Component, ChangeDetectionStrategy, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { IFilterComponent } from '@neuroglia/angular-ngrx-component-store-odata-table';
import { FilterEnum } from './filter-enum';
import { FilterDialogData } from '../../../models';

@Component({
  selector: 'neuroglia-mat-odata-table-filter-enum',
  templateUrl: './filter-enum.component.html',
  styleUrls: ['./filter-enum.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FilterEnumComponent implements IFilterComponent {
  model: FilterEnum;

  constructor(@Inject(MAT_DIALOG_DATA) public data: FilterDialogData) {
    this.model = new FilterEnum(this.data.filter as FilterEnum);
  }
}
