/**
 * Defines the fundamentals of an integration event, an event published accross domain boundaries
 */
export interface IIntegrationEvent<T = string> {
  /** The id of the aggregate that has produced the IIntegrationEvent */
  aggregateId: T;
  /** the date and time at which the IIntegrationEvent has been created */
  createdAt: Date | string;
}
