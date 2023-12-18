/**
 * Defines the fundamentals of an integration event, an event published accross domain boundaries
 */
export interface IIntegrationEvent<T = string> {
  /** The date and time at which the integration event has been created */
  createdAt: string | Date;
  /** The id of the aggregate, if any, that has produced the event */
  aggregateId: T;
  /** The version of the event's source aggregate, if any, at the time it produced the event */
  aggregateVersion: number;
  /** The type of the originating intergration event */
  type: string;
}
