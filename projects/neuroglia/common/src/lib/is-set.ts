/** Tpyeguard for non-null values */
export function isSet<T>(obj: T | null | undefined): obj is T {
  return !!obj;
}
