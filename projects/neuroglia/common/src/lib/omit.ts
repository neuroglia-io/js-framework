/**
 * Copy the provided object omitting the provided properties
 * @param obj The object to copy
 * @param props The properties to remove
 * @returns
 */
export const omit = <T>(obj: T, ...prop: string[]): Partial<T> => {
  const newObj = { ...obj } as any;
  prop.forEach((p) => newObj.hasOwnProperty(p) && delete newObj[p]);
  return newObj as Partial<T>;
};
