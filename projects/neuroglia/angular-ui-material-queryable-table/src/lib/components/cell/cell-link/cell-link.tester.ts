import { CellTemplateTester, ColumnDefinition } from '@neuroglia/angular-ngrx-component-store-queryable-table';

export const cellLinkTester: CellTemplateTester = (
  row: any,
  columnDefinition: ColumnDefinition,
  dataSourceType: string,
  serviceUrl: string,
  target: string,
): boolean => {
  return columnDefinition.type?.toLowerCase() === 'link';
};
