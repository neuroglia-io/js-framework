import { ColumnDefinition, FilterTemplateTester } from '@neuroglia/angular-ngrx-component-store-queryable-table';

export const filterGuidTester: FilterTemplateTester = (
  columnDefinition: ColumnDefinition,
  dataSourceType: string,
  serviceUrl: string,
  target: string,
): boolean => {
  return columnDefinition.type === 'Edm.Guid';
};
