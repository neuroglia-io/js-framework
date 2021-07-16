import { ModelConstructor } from '@neuroglia/common';

/**
 * Describes a data transfer object entity
 */
export class EntityDto<T = string> extends ModelConstructor {
  constructor(model?: any) {
    super(model);
  }

  id: T;
  createdAt: Date | string;
}
