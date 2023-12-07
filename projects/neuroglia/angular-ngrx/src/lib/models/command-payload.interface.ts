/**
 * Represents payload for a command based action
 * */
export interface ICommandPayload<T = any> {
  command: T;
}
