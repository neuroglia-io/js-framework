import { KeyValuePair } from './models';

/**
 * Transforms an key-value pair array to an object
 */
export const kvpToObject = <T = any>(kvpList: KeyValuePair<string, T>[]): { [key: string]: T } =>
  kvpList.reduce((acc, { key, value }) => {
    acc[key] = value;
    return acc;
  }, {} as any);

/** 
 
export const kvpToObject = <TKey = string|number, TValue = any>(kvpList: KeyValuePair<TKey, TValue>[]): { [key: TKey]: TValue } => kvpList.reduce((acc, {key, value}) => {
  acc[key] = value;
  return acc;
}, {} as any);
 
 */
