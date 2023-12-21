import { Type } from '@angular/core';
import { FilterTemplateTester } from './filter-template-tester';
import { IFilterComponent } from './filter-component-interface';
import { Filter } from './filter';

/** Describes a filter template */
export interface FilterTemplate {
  /** The function to test if the template should be used */
  tester: FilterTemplateTester;
  /** The filter template */
  template: Type<IFilterComponent>;
  /** The priority, the highest one comes first */
  priority: number;
  /** The associated filter type */
  filter: Filter;
}
