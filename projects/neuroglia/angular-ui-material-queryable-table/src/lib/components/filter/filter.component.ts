import {
  Component,
  ChangeDetectionStrategy,
  Input,
  Type,
  OnChanges,
  SimpleChanges,
  Output,
  EventEmitter,
} from '@angular/core';
import { NamedLoggingServiceFactory } from '@neuroglia/angular-logging';
import {
  ColumnDefinition,
  Filters,
  IFilterComponent,
  QueryableTableTemplateProvider,
  ShowFilterEvent,
} from '@neuroglia/angular-ngrx-component-store-queryable-table';
import { ILogger } from '@neuroglia/logging';

@Component({
  selector: 'neuroglia-mat-queryable-table-filter',
  templateUrl: './filter.component.html',
  styleUrls: ['./filter.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FilterComponent implements OnChanges {
  /** The column definition */
  @Input() columnDefinition: ColumnDefinition;
  /** The type of data source */
  @Input() dataSourceType: string;
  /** The address of the OData service endpoint */
  @Input() serviceUrl: string;
  /** The name of the entity to gather the data from */
  @Input() target: string;
  /** The active filters  */
  @Input() filters: Filters;
  /** Emits when the filter button is clicked */
  @Output() showFilter: EventEmitter<ShowFilterEvent> = new EventEmitter<ShowFilterEvent>();
  /** Defines if the provided type is supported */
  isSupported: boolean = false;
  /** Defines if filter is active on the column */
  isFiltered: boolean = false;
  /**  */
  protected filterType: Type<IFilterComponent> | null;

  protected logger: ILogger;

  constructor(
    protected namedLoggingServiceFactory: NamedLoggingServiceFactory,
    protected templateProvider: QueryableTableTemplateProvider,
  ) {
    this.logger = this.namedLoggingServiceFactory.create('FilterComponent');
  }

  ngOnChanges(changes: SimpleChanges): void {
    const { columnDefinition, filters } = changes;
    if (columnDefinition?.currentValue && columnDefinition?.previousValue != this.columnDefinition) {
      this.isFiltered = this.filters && !!this.filters[this.columnDefinition.name];
      if (!this.columnDefinition.type) {
        // Should not happen as type is "defaulted" to Edm.String but it may change in the future.
        this.logger.warn(`Cannot filter column of unknwon type '${this.columnDefinition.name}'`);
        this.isSupported = false;
        return;
      }
      this.filterType = this.templateProvider.getFilterTemplate(
        this.columnDefinition,
        this.dataSourceType,
        this.serviceUrl,
        this.target,
      );
      this.isSupported = !!this.filterType;
    }
    if (filters?.previousValue != this.filters) {
      this.isFiltered = this.filters && !!this.filters[this.columnDefinition.name];
    }
  }

  show() {
    if (this.filterType) {
      this.showFilter.emit({
        filterComponentType: this.filterType,
        columnDefinition: this.columnDefinition,
        filter: this.filters ? this.filters[this.columnDefinition.name] : null,
      });
    }
  }
}
