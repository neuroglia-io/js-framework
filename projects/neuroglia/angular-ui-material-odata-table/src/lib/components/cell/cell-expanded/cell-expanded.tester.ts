import {
  CellTemplateTester,
  ColumnDefinition,
  expandRowColumnDefinition,
} from '@neuroglia/angular-ngrx-component-store-odata-table';

export const cellExpandedTester: CellTemplateTester = (
  row: any,
  columnDefinition: ColumnDefinition,
  serviceUrl: string,
  entityName: string,
): boolean => {
  return columnDefinition.type?.toLowerCase() === expandRowColumnDefinition.type?.toLowerCase();
};
