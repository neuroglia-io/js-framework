import { CellTemplateTester, ColumnDefinition } from '@neuroglia/angular-ngrx-component-store-queryable-table';

export const cellDateTester: CellTemplateTester = (
  row: any,
  columnDefinition: ColumnDefinition,
  dataSourceType: string,
  serviceUrl: string,
  target: string,
): boolean => {
  return !!columnDefinition.type?.replace('Edm.', '').startsWith('Date');
};
