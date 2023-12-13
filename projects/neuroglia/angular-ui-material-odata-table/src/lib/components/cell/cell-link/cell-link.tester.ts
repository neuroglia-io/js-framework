import { CellTemplateTester, ColumnDefinition } from '@neuroglia/angular-ngrx-component-store-odata-table';

export const cellLinkTester: CellTemplateTester = (
  row: any,
  columnDefinition: ColumnDefinition,
  serviceUrl: string,
  entityName: string,
): boolean => {
  return columnDefinition.type?.toLowerCase() === 'link';
};
