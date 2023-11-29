import { ModelConstructor } from '@neuroglia/common';

/**
 * Represents the base class of all Data Transfer Objects (DTOs)
 */
export abstract class DataTransfertObject extends ModelConstructor {
  constructor(model?: any) {
    super(model);
  }
}
