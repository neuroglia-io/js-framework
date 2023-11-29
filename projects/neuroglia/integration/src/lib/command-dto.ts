import { EntityDataTransferObject } from './entity-dto';

/**
 * Represents the base class of all commands
 */
export class CommandDataTransferObject<T = string> extends EntityDataTransferObject<T> {
  constructor(model?: any) {
    super(model);
  }
}
