import { Filter } from './filter';

/**
 * Represents a filter component
 */
export interface IFilterComponent<T = any> {
  model: Filter<T>;
}
