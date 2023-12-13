import { Component, ChangeDetectionStrategy, Input, OnChanges, SimpleChanges } from '@angular/core';
import { NamedLoggingServiceFactory } from '@neuroglia/angular-logging';
import { ILogger } from '@neuroglia/logging';
import { strFormatNamed } from '@neuroglia/string-formatter';

@Component({
  selector: 'neuroglia-mat-odata-table-header-compiled-expression',
  templateUrl: './header-compiled-expression.component.html',
  styleUrls: ['./header-compiled-expression.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeaderCompiledExpressionComponent implements OnChanges {
  @Input() expression: string;
  @Input() columnDefinition: any;
  compiledExpression: string = '';
  protected logger: ILogger;

  constructor(protected namedLoggingServiceFactory: NamedLoggingServiceFactory) {
    this.logger = this.namedLoggingServiceFactory.create('HeaderCompiledExpressionComponent');
  }

  ngOnChanges(changes: SimpleChanges): void {
    const { expression } = changes;
    if (expression?.currentValue && expression.previousValue != expression.currentValue) {
      let compiledExpression = 'invalid expression';
      try {
        compiledExpression = strFormatNamed(this.expression, { columnDefinition: this.columnDefinition || {} }); // compileExpression(this.expression, this.columnDefinition||{});
      } catch (ex) {
        this.logger.error('An error occured while compiling the expression', ex);
      }
      this.compiledExpression = compiledExpression;
    }
  }
}
