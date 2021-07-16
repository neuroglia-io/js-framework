/**
 * The interface representing a storage handler, used to access a storage entry
 */
export interface IStorageHandler<T> {
  /**
   * Sets the value of the underlying storage item
   * @param value
   */
  setItem(value: T): void;
  /**
   * Gets the value of the underlying storage item
   */
  getItem(): T | undefined;
  /**
   * Removes the item from the storage
   */
  removeItem(): void;
  /**
   * Clears the item from the storage (same than remove)
   */
  clear(): void;
}
