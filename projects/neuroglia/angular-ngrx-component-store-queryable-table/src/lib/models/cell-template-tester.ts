import { ColumnDefinition } from './column-definition';

/**
 * The signature of a function used to test if a template should be used for the
 * provided arguments.
 */
export type CellTemplateTester = (
  row: any,
  columnDefinition: ColumnDefinition,
  dataSourceType: string,
  serviceUrl: string,
  entityName: string,
) => boolean;
