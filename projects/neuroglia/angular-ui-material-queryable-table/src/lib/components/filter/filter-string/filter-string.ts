import { Filter } from '@neuroglia/angular-ngrx-component-store-queryable-table';
import { Filter as ODataQueryFilter } from 'odata-query';

export class FilterString implements Filter {
  isNull?: boolean | string = '';
  term: string;

  constructor(model?: FilterString) {
    if (model) {
      this.isNull = model.isNull;
      this.term = model.term;
    }
  }

  asODataQueryFilter(): ODataQueryFilter {
    if (typeof this.isNull === typeof true) {
      return this.isNull ? { eq: null } : { ne: null };
    }
    if (!this.term) return '';
    return { contains: this.term };
  }
}
