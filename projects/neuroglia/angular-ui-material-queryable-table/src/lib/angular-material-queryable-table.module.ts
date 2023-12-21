import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { NeurogliaNgCommonModule } from '@neuroglia/angular-common';
import { NeurogliaNgUiJsonPresenterModule } from '@neuroglia/angular-ui-json-presenter';

import { DragDropModule } from '@angular/cdk/drag-drop';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDialogModule } from '@angular/material/dialog';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSelectModule } from '@angular/material/select';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';

import { QueryableTableTemplateProvider } from '@neuroglia/angular-ngrx-component-store-queryable-table';
import { NeurogliaNgMatQueryableDataTableComponent } from './angular-material-queryable-table.component';
import {
  CellCompiledExpressionComponent,
  CellComponent,
  CellDateComponent,
  CellDefaultComponent,
  CellExpandedComponent,
  CellLinkComponent,
  CellNgrxActionComponent,
  CellNgrxActionWithConfirmComponent,
  ColumnSettingsComponent,
  ConfirmActionDialog,
  FilterComponent,
  FilterDateComponent,
  FilterEnumComponent,
  FilterExpressionComponent,
  FilterGuidComponent,
  FilterNumberComponent,
  FilterStringComponent,
  HeaderCompiledExpressionComponent,
  HeaderComponent,
  TableComponent,
} from './components';

import { cellCompiledExpressionTester } from './components/cell/cell-compiled-expression/cell-compiled-expression.tester';
import { cellDateTester } from './components/cell/cell-date/cell-date.tester';
import { cellDefaultTester } from './components/cell/cell-default/cell-default.tester';
import { cellExpandedTester } from './components/cell/cell-expanded/cell-expanded.tester';
import { cellLinkTester } from './components/cell/cell-link/cell-link.tester';
import { cellNgrxActionWithConfirmTester } from './components/cell/cell-ngrx-action-with-confirm/cell-ngrx-action-with-confirm.tester';
import { cellNgrxActionTester } from './components/cell/cell-ngrx-action/cell-ngrx-action.tester';
import { FilterDate } from './components/filter/filter-date/filter-date';
import { filterDateTester } from './components/filter/filter-date/filter-date.tester';
import { FilterEnum } from './components/filter/filter-enum/filter-enum';
import { filterEnumTester } from './components/filter/filter-enum/filter-enum.tester';
import { FilterExpression } from './components/filter/filter-expression/filter-expression';
import { filterExpressionTester } from './components/filter/filter-expression/filter-expression.tester';
import { FilterGuid } from './components/filter/filter-guid/filter-guid';
import { filterGuidTester } from './components/filter/filter-guid/filter-guid.tester';
import { FilterNumber } from './components/filter/filter-number/filter-number';
import { filterNumberTester } from './components/filter/filter-number/filter-number.tester';
import { FilterString } from './components/filter/filter-string/filter-string';
import { filterStringTester } from './components/filter/filter-string/filter-string.tester';
import { NeurogliaNgMatQueryableDataTableFacadeComponent } from './angular-material-queryable-table-facade.component';

export function registerDefaultTemplates(templateProvider: QueryableTableTemplateProvider): void {
  templateProvider.registerCellTemplate(cellCompiledExpressionTester, CellCompiledExpressionComponent, -1);
  templateProvider.registerCellTemplate(cellLinkTester, CellLinkComponent, -1);
  templateProvider.registerCellTemplate(cellNgrxActionTester, CellNgrxActionComponent, -1);
  templateProvider.registerCellTemplate(cellNgrxActionWithConfirmTester, CellNgrxActionWithConfirmComponent, -1);
  templateProvider.registerCellTemplate(cellDateTester, CellDateComponent, -1);
  templateProvider.registerCellTemplate(cellExpandedTester, CellExpandedComponent, -1);
  templateProvider.registerCellTemplate(cellDefaultTester, CellDefaultComponent, -99);

  templateProvider.registerFilterTemplate(filterDateTester, FilterDateComponent, FilterDate, -1);
  templateProvider.registerFilterTemplate(filterEnumTester, FilterEnumComponent, FilterEnum, -1);
  templateProvider.registerFilterTemplate(filterExpressionTester, FilterExpressionComponent, FilterExpression, -1);
  templateProvider.registerFilterTemplate(filterGuidTester, FilterGuidComponent, FilterGuid, -1);
  templateProvider.registerFilterTemplate(filterNumberTester, FilterNumberComponent, FilterNumber, -1);
  templateProvider.registerFilterTemplate(filterStringTester, FilterStringComponent, FilterString, -1);
}

@NgModule({
  declarations: [
    NeurogliaNgMatQueryableDataTableComponent,
    NeurogliaNgMatQueryableDataTableFacadeComponent,
    TableComponent,
    HeaderComponent,
    HeaderCompiledExpressionComponent,
    CellComponent,
    CellDateComponent,
    CellDefaultComponent,
    CellCompiledExpressionComponent,
    CellNgrxActionComponent,
    FilterComponent,
    FilterStringComponent,
    FilterEnumComponent,
    FilterGuidComponent,
    FilterDateComponent,
    FilterNumberComponent,
    FilterExpressionComponent,
    ColumnSettingsComponent,
    CellLinkComponent,
    CellExpandedComponent,
    CellNgrxActionWithConfirmComponent,
    ConfirmActionDialog,
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    NeurogliaNgCommonModule,

    MatTableModule,
    MatSortModule,
    MatPaginatorModule,
    MatProgressBarModule,
    MatDialogModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
    MatCheckboxModule,
    MatButtonToggleModule,
    MatExpansionModule,
    MatDatepickerModule,
    DragDropModule,

    NeurogliaNgUiJsonPresenterModule,
  ],
  exports: [NeurogliaNgMatQueryableDataTableComponent, NeurogliaNgMatQueryableDataTableFacadeComponent, TableComponent],
})
export class NeurogliaNgMatQueryableDataTableModule {
  constructor(private templateProvider: QueryableTableTemplateProvider) {
    registerDefaultTemplates(this.templateProvider);
  }
}
