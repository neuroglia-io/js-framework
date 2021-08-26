import { KeyValuePair } from "./models";

/**
 * Transforms an object to a key-value pair array
 */
export const objectToKvp = <T = any>(obj: any): KeyValuePair<T>[] => Object.entries(obj).map(([key, value]) => ({ key, value } as KeyValuePair<T>));