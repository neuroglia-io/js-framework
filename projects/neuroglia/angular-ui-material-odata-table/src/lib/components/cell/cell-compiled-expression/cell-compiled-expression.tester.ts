import { CellTemplateTester, ColumnDefinition } from '@neuroglia/angular-ngrx-component-store-odata-table';

export const cellCompiledExpressionTester: CellTemplateTester = (
  row: any,
  columnDefinition: ColumnDefinition,
  serviceUrl: string,
  entityName: string,
): boolean => {
  return !!columnDefinition.expression;
};
