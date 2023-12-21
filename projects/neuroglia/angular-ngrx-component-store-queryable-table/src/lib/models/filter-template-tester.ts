import { ColumnDefinition } from './column-definition';

/**
 * The signature of a function used to test if a template should be use for the provided
 * column definition .
 */
export type FilterTemplateTester = (
  columnDefinition: ColumnDefinition,
  dataSourceType: string,
  serviceUrl: string,
  entityName: string,
) => boolean;
