import { EntityDataTransferObject } from './entity-dto';

/**
 * Describes an aggregate state data transfer object
 */
export class AggregateStateDataTransferObject<T = string> extends EntityDataTransferObject<T> {
  constructor(model?: any) {
    super(model);
  }

  /** The state's version */
  stateVersion: number;
}
