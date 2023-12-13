import { Filter as ODataQueryFilter } from 'odata-query';

/**
 * A dictionary of filters, index by column name
 */
export interface Filter<T = any> {
  asODataQueryFilter(): ODataQueryFilter;
}
