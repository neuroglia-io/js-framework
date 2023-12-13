import { ColumnDefinition, FilterTemplateTester } from '@neuroglia/angular-ngrx-component-store-odata-table';

export const filterNumberTester: FilterTemplateTester = (
  columnDefinition: ColumnDefinition,
  serviceUrl: string,
  entityName: string,
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
