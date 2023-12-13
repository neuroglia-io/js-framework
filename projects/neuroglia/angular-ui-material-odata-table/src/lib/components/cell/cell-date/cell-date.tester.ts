import { CellTemplateTester, ColumnDefinition } from '@neuroglia/angular-ngrx-component-store-odata-table';

export const cellDateTester: CellTemplateTester = (
  row: any,
  columnDefinition: ColumnDefinition,
  serviceUrl: string,
  entityName: string,
): boolean => {
  return columnDefinition.type === 'Edm.Date' || columnDefinition.type === 'Edm.DateTimeOffset';
};
