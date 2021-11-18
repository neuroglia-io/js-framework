/**
 * Represents an object with key and value properties
 */
export interface KeyValuePair<TKey = string | number, TValue = any> {
  key: TKey;
  value: TValue;
}