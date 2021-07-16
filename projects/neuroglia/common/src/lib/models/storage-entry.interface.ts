/**
 * The interface representing a storage entry
 */
export interface IStorageEntry<T> {
  /** The entry creation date */
  createdAt: number;
  /** The entry expiracy date */
  expiresAt: number | null;
  /** The entry value */
  value: T;
}
