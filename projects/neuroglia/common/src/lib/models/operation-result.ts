import { ModelConstructor } from './model-constructor';
import { OperationError } from './operation-error';

export class OperationResult<T = any> extends ModelConstructor {
  constructor(model?: any) {
    super(model);
    if (model) {
      this.errors = model.errors ? model.errors.map((m: any) => new OperationError(m)) : [];
    }
  }

  code: string;
  errors: OperationError[];
  returned: boolean;
  suceeded: boolean;
  data: T;
}
