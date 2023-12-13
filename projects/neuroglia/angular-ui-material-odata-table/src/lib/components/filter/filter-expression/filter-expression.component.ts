import { Component, ChangeDetectionStrategy, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { IFilterComponent } from '@neuroglia/angular-ngrx-component-store-odata-table';
import { FilterExpression } from './filter-expression';
import { FilterDialogData } from '../../../models';

@Component({
  selector: 'neuroglia-mat-odata-table-filter-expression',
  templateUrl: './filter-expression.component.html',
  styleUrls: ['./filter-expression.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FilterExpressionComponent implements IFilterComponent {
  model: FilterExpression;

  constructor(@Inject(MAT_DIALOG_DATA) public data: FilterDialogData) {
    this.model = new FilterExpression(
      (this.data.filter as FilterExpression) ||
        ({ expression: this.data.columnDefinition.filterExpression } as FilterExpression),
    );
  }
}
