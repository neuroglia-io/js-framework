import { Component, ChangeDetectionStrategy, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { IFilterComponent } from '@neuroglia/angular-ngrx-component-store-odata-table';
import { FilterGuid } from './filter-guid';
import { FilterDialogData } from '../../../models';

@Component({
  selector: 'neuroglia-mat-odata-table-filter-guid',
  templateUrl: './filter-guid.component.html',
  styleUrls: ['./filter-guid.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FilterGuidComponent implements IFilterComponent {
  model: FilterGuid;

  constructor(@Inject(MAT_DIALOG_DATA) public data: FilterDialogData) {
    this.model = new FilterGuid(this.data.filter as FilterGuid);
  }
}
