import { ModelConstructor } from './model-constructor';

/**
 * Holds the result of an erroneous operation
 */
export class OperationError extends ModelConstructor {
  constructor(model?: any) {
    super(model);
    this.key = this.key || this.code;
    this.code = this.code || this.key;
  }

  key: string;
  code: string;
  message: string;
}
