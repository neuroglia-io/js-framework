import { Filter as ODataQueryFilter } from 'odata-query';
import { strFormatNamed } from '@neuroglia/string-formatter';
import { Filter } from '@neuroglia/angular-ngrx-component-store-odata-table';

export class FilterExpression implements Filter {
  isNull?: boolean | string = '';
  expression: string;
  term: string;

  constructor(model?: FilterExpression) {
    if (model) {
      this.isNull = model.isNull;
      this.term = model.term;
      this.expression = model.expression;
    }
  }

  asODataQueryFilter(): ODataQueryFilter {
    if (typeof this.isNull === typeof true) {
      return this.isNull ? { eq: null } : { ne: null };
    }
    if (!this.term) return '';
    return strFormatNamed(this.expression, { term: this.term });
  }
}
