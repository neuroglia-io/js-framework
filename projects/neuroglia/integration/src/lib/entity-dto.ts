import { DataTransfertObject } from './data-transfer-object';

/**
 * Represents the base class for Data Transfer Objects used to describe an entity
 */
export class EntityDataTransferObject<T = string> extends DataTransfertObject {
  constructor(model?: any) {
    super(model);
  }

  /** The id of the described entity */
  id: T;
  /** The date and time the described entity has been created at */
  createdAt: Date | string;
  /** The date and time the described entity has last been modified */
  lastModified: Date | string;
}
