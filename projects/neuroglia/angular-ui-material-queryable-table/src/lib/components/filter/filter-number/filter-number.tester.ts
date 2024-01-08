import { ColumnDefinition, FilterTemplateTester } from '@neuroglia/angular-ngrx-component-store-queryable-table';

export const filterNumberTester: FilterTemplateTester = (
  columnDefinition: ColumnDefinition,
  dataSourceType: string,
  serviceUrl: string,
  target: string,
): boolean => {
  return (
    columnDefinition.type === 'Edm.Byte' ||
    columnDefinition.type === 'Edm.Decimal' ||
    columnDefinition.type === 'Edm.Double' ||
    columnDefinition.type === 'Edm.Int16' ||
    columnDefinition.type === 'Edm.Int32' ||
    columnDefinition.type === 'Edm.Int64' ||
    columnDefinition.type === 'Edm.SByte' ||
    columnDefinition.type === 'Edm.Single'
  );
};
