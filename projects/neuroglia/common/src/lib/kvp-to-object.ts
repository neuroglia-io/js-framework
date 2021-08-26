import { KeyValuePair } from "./models";

/**
 * Transforms an key-value pair array to an object
 */
export const kvpToObject = <T = any>(kvpList: KeyValuePair<T>[]): any => kvpList.reduce((acc, {key, value}) => {
  acc[key] = value;
  return acc;
}, {} as any);