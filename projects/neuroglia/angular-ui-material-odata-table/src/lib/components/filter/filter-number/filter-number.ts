import { Filter } from '@neuroglia/angular-ngrx-component-store-odata-table';
import { Filter as ODataQueryFilter } from 'odata-query';

export class FilterNumber implements Filter {
  isNull?: boolean | string = '';
  from?: number | null;
  to?: number | null;

  constructor(model?: FilterNumber) {
    if (model) {
      this.isNull = model.isNull;
      this.from = model.from;
      this.to = model.to;
    }
  }

  asODataQueryFilter(): ODataQueryFilter {
    if (typeof this.isNull === typeof true) {
      return this.isNull ? { eq: null } : { ne: null };
    }
    if (this.from == null && this.to == null) return '';
    const filter: ODataQueryFilter = {};
    if (this.from != null) {
      filter.ge = this.from;
    }
    if (this.to != null) {
      filter.le = this.to;
    }
    return filter;
  }
}
