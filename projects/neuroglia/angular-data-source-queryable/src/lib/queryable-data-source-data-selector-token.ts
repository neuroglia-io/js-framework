import { InjectionToken } from '@angular/core';

export const QUERYABLE_DATA_SOURCE_DATA_SELECTOR = new InjectionToken<<T = any>(response: any) => Array<T>>(
  'queryable-data-source-data-selector',
);
