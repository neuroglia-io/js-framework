import { ColumnDefinition, FilterTemplateTester } from '@neuroglia/angular-ngrx-component-store-queryable-table';

export const filterDateTester: FilterTemplateTester = (
  columnDefinition: ColumnDefinition,
  dataSourceType: string,
  serviceUrl: string,
  target: string,
): boolean => {
  return columnDefinition.type === 'Edm.Date' || columnDefinition.type === 'Edm.DateTimeOffset';
};
