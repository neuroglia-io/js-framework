import { DataTransferObject } from './data-transfer-object';
import { IIntegrationEvent } from './integration-event.interface';

/**
 * Represents the base class for all integration events
 */
export class IntergrationEvent<T = string> extends DataTransferObject implements IIntegrationEvent<T> {
  constructor(model?: any) {
    super(model);
  }

  /** The date and time at which the integration event has been created */
  createdAt: string | Date;
  /** The id of the aggregate, if any, that has produced the event */
  aggregateId: T;
  /** The version of the event's source aggregate, if any, at the time it produced the event */
  aggregateVersion: string;
  /** The type of the originating intergration event */
  type: string;
}
