import { CellTemplateTester, ColumnDefinition } from '@neuroglia/angular-ngrx-component-store-queryable-table';

export const cellNgrxActionWithConfirmTester: CellTemplateTester = (
  row: any,
  columnDefinition: ColumnDefinition,
  dataSourceType: string,
  serviceUrl: string,
  target: string,
): boolean => {
  return columnDefinition.type?.toLowerCase() === 'confirmaction';
};
