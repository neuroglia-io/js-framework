import { Component, ChangeDetectionStrategy, Input, OnChanges, SimpleChanges } from '@angular/core';
import { NamedLoggingServiceFactory } from '@neuroglia/angular-logging';
import {
  ColumnDefinition,
  ICellComponent,
  IQueryableTableComponent,
} from '@neuroglia/angular-ngrx-component-store-queryable-table';
import { ILogger } from '@neuroglia/logging';
import { strFormatNamed } from '@neuroglia/string-formatter';

@Component({
  selector: 'neuroglia-mat-queryable-table-cell-compiled-expression',
  templateUrl: './cell-compiled-expression.component.html',
  styleUrls: ['./cell-compiled-expression.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CellCompiledExpressionComponent implements OnChanges, ICellComponent {
  /** The queryable table container */
  @Input() table: IQueryableTableComponent;
  /** The row data */
  @Input() row: any;
  /** The column definition */
  @Input() columnDefinition: ColumnDefinition;
  /** The address of the OData service endpoint */
  @Input() serviceUrl: string;
  /** The name of the entity to gather the data from */
  @Input() target: string;
  compiledExpression: string = '';
  protected logger: ILogger;

  constructor(protected namedLoggingServiceFactory: NamedLoggingServiceFactory) {
    this.logger = this.namedLoggingServiceFactory.create('CellCompiledExpressionComponent');
  }

  ngOnChanges(changes: SimpleChanges): void {
    const { columnDefinition } = changes;
    if (columnDefinition?.currentValue && columnDefinition.previousValue != columnDefinition.currentValue) {
      let compiledExpression = 'invalid expression';
      try {
        let item = this.row || {};
        if (!this.columnDefinition.isCollection && !this.columnDefinition.isNavigationProperty) {
          compiledExpression = strFormatNamed(this.columnDefinition.expression || '', { item });
        } else if (this.row[this.columnDefinition.name]) {
          if (!this.columnDefinition.isCollection) {
            item = this.row[this.columnDefinition.name];
            compiledExpression = strFormatNamed(this.columnDefinition.expression || '', { item });
          } else {
            compiledExpression = this.row[this.columnDefinition.name].reduce(
              (acc: string, item: unknown, idx: number) =>
                `${acc}${idx ? ', ' : ''}${strFormatNamed(this.columnDefinition.expression || '', { item })}`,
              '',
            );
          }
        }
      } catch (ex) {
        this.logger.error('An error occured while compiling the expression', ex);
      }
      this.compiledExpression = compiledExpression;
    }
  }
}
