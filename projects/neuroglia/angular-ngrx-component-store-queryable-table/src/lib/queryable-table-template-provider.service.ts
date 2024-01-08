import { Injectable, Type } from '@angular/core';
import {
  CellTemplate,
  CellTemplateTester,
  ColumnDefinition,
  FilterTemplate,
  FilterTemplateTester,
  ICellComponent,
  IFilterComponent,
} from './models';

@Injectable({
  providedIn: 'root',
})
/** The service used to provide template when rendering the table */
export class QueryableTableTemplateProvider {
  private templates: { cells: CellTemplate[]; filters: FilterTemplate[] } = {
    cells: [],
    filters: [],
  };

  /**
   * Register the provided template
   * @param tester The function to test if the template should be used
   * @param template The template
   * @param priority The priority, the highest one comes first
   * @returns
   */
  registerCellTemplate(tester: CellTemplateTester, template: Type<ICellComponent>, priority: number = 0) {
    if (!tester || !template) {
      return;
    }
    const existingTemplate = this.templates.cells.find(
      (cellTemplate) => cellTemplate.tester === tester && cellTemplate.template === template,
    );
    if (existingTemplate) {
      return;
    }
    this.templates.cells.push({ tester, template, priority });
    this.templates.cells = this.templates.cells.sort((a, b) => b.priority - a.priority);
  }

  /**
   * Removes the provided template
   * @param tester The function to test if the template should be used
   * @param template The template
   * @returns
   */
  unregisterCellTemplate(tester: CellTemplateTester, template: Type<ICellComponent>) {
    const templateIndex = this.templates.cells.findIndex(
      (cellTemplate) => cellTemplate.tester === tester && cellTemplate.template === template,
    );
    if (templateIndex === -1) {
      return;
    }
    this.templates.cells.splice(templateIndex, 1);
    this.templates.cells = this.templates.cells.sort((a, b) => b.priority - a.priority);
  }

  /**
   * Get the template component matching the specified colum definition and row
   * @param columnDefinition
   * @param row
   * @param dataSourceType
   * @param serviceUrl
   * @param target
   * @returns
   */
  getCellTemplate(
    row: any,
    columnDefinition: ColumnDefinition,
    dataSourceType: string,
    serviceUrl: string,
    target: string,
  ): Type<ICellComponent> | null {
    return (
      this.templates.cells.find((cellTemplate) =>
        cellTemplate.tester(row, columnDefinition, dataSourceType, serviceUrl, target),
      )?.template || null
    );
  }

  /**
   * Register the provided template
   * @param tester The function to test if the template should be used
   * @param template The template
   * @param filter The filter
   * @param priority The priority, the highest one comes first
   * @returns
   */
  registerFilterTemplate(
    tester: FilterTemplateTester,
    template: Type<IFilterComponent>,
    filter: any,
    priority: number = 0,
  ) {
    if (!tester || !template) {
      return;
    }
    const existingTemplate = this.templates.filters.find(
      (filter) => filter.tester === tester && filter.template === template,
    );
    if (existingTemplate) {
      return;
    }
    this.templates.filters.push({ tester, template, filter, priority });
    this.templates.filters = this.templates.filters.sort((a, b) => b.priority - a.priority);
  }

  /**
   * Removes the provided template
   * @param tester The function to test if the template should be used
   * @param template The template
   * @returns
   */
  unregisterFilterTemplate(tester: FilterTemplateTester, template: Type<IFilterComponent>) {
    const templateIndex = this.templates.filters.findIndex(
      (filter) => filter.tester === tester && filter.template === template,
    );
    if (templateIndex === -1) {
      return;
    }
    this.templates.filters.splice(templateIndex, 1);
    this.templates.filters = this.templates.filters.sort((a, b) => b.priority - a.priority);
  }

  /**
   * Gets the template component matching the specified column definition
   * @param columnDefinition
   * @param dataSourceType
   * @param serviceUrl
   * @param target
   * @returns
   */
  getFilterTemplate(
    columnDefinition: ColumnDefinition,
    dataSourceType: string,
    serviceUrl: string,
    target: string,
  ): Type<IFilterComponent> | null {
    return (
      this.templates.filters.find((filter) => filter.tester(columnDefinition, dataSourceType, serviceUrl, target))
        ?.template || null
    );
  }

  /**
   * Gets the filter matching the specified column definition
   * @param columnDefinition
   * @param dataSourceType
   * @param serviceUrl
   * @param target
   * @returns
   */
  getFilter(
    columnDefinition: ColumnDefinition,
    dataSourceType: string,
    serviceUrl: string,
    target: string,
  ): any | null {
    return (
      this.templates.filters.find((filter) => filter.tester(columnDefinition, dataSourceType, serviceUrl, target))
        ?.filter || null
    );
  }
}
