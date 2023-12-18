import { DataTransferObject } from './data-transfer-object';
import { JsonPatch } from './json-patch';

/**
 * Represents the command used to patch the specified aggregate
 */
export class PatchCommand extends DataTransferObject {
  /** The id of the aggregate to patch */
  id!: string;
  /** The patch to apply */
  patch!: JsonPatch;

  constructor(model?: Partial<PatchCommand>) {
    super(model);
    this.patch = new JsonPatch(model?.patch || {});
  }
}
