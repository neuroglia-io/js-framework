import { ColumnDefinition, FilterTemplateTester } from '../../../models';

export const filterDateTester: FilterTemplateTester = (
  columnDefinition: ColumnDefinition,
  serviceUrl: string,
  entityName: string,
): boolean => {
  return columnDefinition.type === 'Edm.Date' || columnDefinition.type === 'Edm.DateTimeOffset';
};
