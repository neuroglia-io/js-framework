import { ModelConstructor } from './model-constructor';

/**
 * Represents the default abstract implementation of the identifiable record/object
 */
export class IdentifiableRecord<T = string> extends ModelConstructor {
  constructor(model?: any) {
    super(model);
  }
  /** The object's unique identifier */
  id: T;
}
