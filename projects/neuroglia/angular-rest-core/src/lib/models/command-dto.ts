import { ModelConstructor } from '@neuroglia/common';

/**
 * Represents the base class of all commands
 */
export class CommandDto extends ModelConstructor {
  constructor(model?: any) {
    super(model);
  }
}
