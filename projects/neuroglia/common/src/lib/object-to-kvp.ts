import { KeyValuePair } from "./models";

/**
 * Transforms an object to a key-value pair array
 */
export const objectToKvp = <T = any>(obj: { [key: string]: T }): KeyValuePair<string, T>[] => Object.entries(obj).map(([key, value]) => ({ key, value } as KeyValuePair<string, T>));