import { Type } from '@angular/core';
import { CellTemplateTester } from './cell-template-tester';

/** Describes a cell template */
export interface CellTemplate {
  /** The function to test if the template should be used */
  tester: CellTemplateTester;
  /** The cell template */
  template: Type<any>;
  /** The priority, the highest one comes first */
  priority: number;
}
