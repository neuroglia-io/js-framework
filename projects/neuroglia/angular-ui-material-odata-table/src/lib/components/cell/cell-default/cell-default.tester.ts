import { CellTemplateTester, ColumnDefinition } from '@neuroglia/angular-ngrx-component-store-odata-table';

export const cellDefaultTester: CellTemplateTester = (
  row: any,
  columnDefinition: ColumnDefinition,
  serviceUrl: string,
  entityName: string,
): boolean => {
  return true;
};
