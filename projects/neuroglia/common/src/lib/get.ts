
/**
 * Gets the value at path of object. If the resolved value is undefined, the defaultValue is returned in its place.
 * 
 * // source https://youmightnotneed.com/lodash/
 * 
 * @param obj any The object to query.
 * @param path string|string[] The path of the property to get.
 * @param defaultValue any The value returned for undefined resolved values.
 * @returns any Returns the resolved value.
 */
export function get<T = any>(obj: any, path: string | string[], defaultValue?: T): T | undefined {
  if (!path) return undefined;
  const pathArray = Array.isArray(path) ? path : path.match(/([^[.\]])+/g);
  if (!pathArray) return undefined;
  const result = pathArray.reduce((prevObj, key) => prevObj && prevObj[key], obj);
  return result === undefined ? defaultValue : result;
}