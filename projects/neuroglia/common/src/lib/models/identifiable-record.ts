/**
 * Represents the default abstract implementation of the identifiable record/object
 */
export class IdentifiableRecord<T = string> {
  /** The object's unique identifier */
  id: T;
}
