/**
 * Returns true if the value is an object but not an array
 * @param value
 * @returns
 */
export const isObject = (value: any): boolean => {
  if (!value) return false;
  const type = typeof value;
  return type === 'object' && !Array.isArray(value);
};
