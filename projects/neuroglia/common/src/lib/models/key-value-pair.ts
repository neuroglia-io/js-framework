/**
 * Represents an object with key and value properties
 */
export interface KeyValuePair<T = any> {
  key: string | number;
  value: T;
}