import { Type } from '@angular/core';
import { ColumnDefinition } from './column-definition';
import { Filter } from './filter';
import { IFilterComponent } from './filter-component-interface';

/** The event emitter when the users triggers a filter configuration */
export interface ShowFilterEvent {
  /** The type of filter to display */
  filterComponentType: Type<IFilterComponent>;
  /** The filter value if any */
  filter: Filter | null;
  /** The column definition the filter applies to */
  columnDefinition: ColumnDefinition;
}
