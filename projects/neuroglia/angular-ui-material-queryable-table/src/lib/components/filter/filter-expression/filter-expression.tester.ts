import { ColumnDefinition, FilterTemplateTester } from '@neuroglia/angular-ngrx-component-store-queryable-table';

export const filterExpressionTester: FilterTemplateTester = (
  columnDefinition: ColumnDefinition,
  dataSourceType: string,
  serviceUrl: string,
  target: string,
): boolean => {
  return !!columnDefinition.filterExpression;
};
