import { Filter } from './filter';

/** Represents a serialized filter */
export interface SerializedFilter {
  /** The filter constructor's name */
  //constructorName: string,
  /** The filtered column name */
  columnName: string;
  /** The filter value */
  filter: Filter;
}
