/**
 * Returns a deep copy of the provided object
 * @param object the object to copy
 * @returns A deep copy of the given object
 */
export const deepCopy = (object: any): any => {
  return JSON.parse(JSON.stringify(object));
};
