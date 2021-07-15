import { deepCopy } from '../deep-copy';
import { isObject } from '../is-object';

/**
 * Enables inheriting models hydration
 */
export class ModelConstructor {
  constructor(model?: any) {
    if (model && isObject(model)) {
      Object.assign(this, deepCopy(model));
    }
  }
}
