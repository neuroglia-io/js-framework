import { SortDirection } from './sort-direction';

/**
 * The sorting state
 */
export interface Sort {
  /** The column to sort */
  column: string;
  /** The sort direction */
  direction: SortDirection;
}
