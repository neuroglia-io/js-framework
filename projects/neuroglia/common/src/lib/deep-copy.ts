/**
 * Returns a deep copy of the provided object
 * @param object the object to copy
 * @param replacer A function that transforms the results.
 * @param reviver A function that transforms the results. This function is called for each member of the object.
 * @returns A deep copy of the given object
 */
export const deepCopy = (
  object: any,
  replacer?: (this: any, key: string, value: any) => any,
  reviver?: (this: any, key: string, value: any) => any,
): any => {
  return JSON.parse(JSON.stringify(object, replacer), reviver);
};
