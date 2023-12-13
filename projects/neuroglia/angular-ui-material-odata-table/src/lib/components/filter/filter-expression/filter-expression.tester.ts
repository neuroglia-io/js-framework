import { ColumnDefinition, FilterTemplateTester } from '@neuroglia/angular-ngrx-component-store-odata-table';

export const filterExpressionTester: FilterTemplateTester = (
  columnDefinition: ColumnDefinition,
  serviceUrl: string,
  entityName: string,
): boolean => {
  return !!columnDefinition.filterExpression;
};
