import { ModelConstructor } from '@neuroglia/common';

/**
 * Represents the options used to configure an OData query
 */
export class ODataQueryOptions extends ModelConstructor {
  constructor(model?: any) {
    super(model);
  }

  $filter?: string | undefined;
  $orderBy?: string | undefined;
  $select?: string | undefined;
  $skip?: number | undefined;
  $top?: number | undefined;
  $count?: boolean | undefined;
  $expand?: string | undefined;
}
