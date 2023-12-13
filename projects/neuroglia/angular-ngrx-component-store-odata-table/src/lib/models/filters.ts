import { Filter } from './filter';

/**
 * A dictionary of filters, index by column name
 */
export interface Filters {
  [columnName: string]: Filter;
}
