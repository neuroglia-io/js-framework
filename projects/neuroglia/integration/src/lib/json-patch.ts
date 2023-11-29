import { ModelConstructor } from '@neuroglia/common';
import { PatchOperation } from './patch-operation';

/**
 * Models a JSON Patch document.
 */
export class JsonPatch extends ModelConstructor {
  constructor(model?: any) {
    super(model);
    this.operations = (model?.operations || []).map((operation: PatchOperation) => new PatchOperation(operation));
  }
  /** The collection of operations. */
  operations: PatchOperation[];
}
