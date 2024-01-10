import { InjectionToken } from '@angular/core';
import { IMaterialQueryableTableStore } from './material-queryable-table.store';

export const MATERIAL_QUERYABLE_TABLE_STORE = new InjectionToken<IMaterialQueryableTableStore>(
  'material-queryable-table-store',
);
