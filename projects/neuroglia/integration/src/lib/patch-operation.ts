import { ModelConstructor } from '@neuroglia/common';

/**
 * Represents a single JSON Patch operation.
 */
export class PatchOperation extends ModelConstructor {
  constructor(model?: any) {
    super(model);
  }
  /** The operation type */
  op: 'add' | 'remove' | 'replace' | 'move' | 'copy' | 'test';
  /** The source path */
  from: string;
  /** The target path */
  path: string;
  /** The value */
  value: any;
}
