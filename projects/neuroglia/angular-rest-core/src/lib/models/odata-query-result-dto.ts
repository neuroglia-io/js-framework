import { ModelConstructor } from '@neuroglia/common';

/**
 * The results of an OData query
 */
export class ODataQueryResultDto<T> extends ModelConstructor {
  constructor(model?: any) {
    super(model);
    this.value = model.value ? model.value.map((m: any) => m as T) : [];
    this['@odata.context'] = model['@odata.context'] as string;
    this['@odata.count'] = model['@odata.count'] as number;
  }

  value: T[];
  '@odata.context': string;
  '@odata.count': number;
}
