import { Filter } from '@neuroglia/angular-ngrx-component-store-queryable-table';
import { Filter as ODataQueryFilter } from 'odata-query';

export class FilterDate implements Filter {
  isNull?: boolean | string = '';
  from?: Date | null;
  to?: Date | null;

  constructor(model?: FilterDate) {
    if (model) {
      this.isNull = model.isNull;
      this.from = typeof model.from === 'string' ? new Date(model.from) : model.from;
      this.to = typeof model.to === 'string' ? new Date(model.to) : model.to;
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
