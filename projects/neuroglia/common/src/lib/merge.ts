import { isObject } from './is-object';

/**
 * Merges nested objects
 * @param obj1
 * @param obj2
 */
export const merge = (obj1: any, obj2: any): any => {
  const merged = { ...obj1 };
  Object.entries(obj2).forEach(([prop, value]) => {
    if (!isObject(value) || !merged[prop]) {
      merged[prop] = value;
    } else {
      merged[prop] = merge(merged[prop], value);
    }
  });
  return merged;
};
