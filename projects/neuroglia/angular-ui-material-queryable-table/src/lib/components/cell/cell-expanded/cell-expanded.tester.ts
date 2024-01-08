import {
  CellTemplateTester,
  ColumnDefinition,
  expandRowColumnDefinition,
} from '@neuroglia/angular-ngrx-component-store-queryable-table';

export const cellExpandedTester: CellTemplateTester = (
  row: any,
  columnDefinition: ColumnDefinition,
  dataSourceType: string,
  serviceUrl: string,
  target: string,
): boolean => {
  return columnDefinition.type?.toLowerCase() === expandRowColumnDefinition.type?.toLowerCase();
};
