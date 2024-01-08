import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnChanges,
  OnDestroy,
  SimpleChanges,
  EventEmitter,
  Output,
  ContentChild,
  ElementRef,
  inject,
} from '@angular/core';
import { Sort as MatSort } from '@angular/material/sort';
import { Paging, Sort } from '@neuroglia/angular-data-source-queryable';
import { Observable, Subject, map } from 'rxjs';
import { MaterialQueryableTableStore } from './material-queryable-table.store';
import {
  ColumnDefinition,
  Filters,
  IQueryableTableComponent,
  QueryableTableConfig,
  ShowFilterEvent,
} from '@neuroglia/angular-ngrx-component-store-queryable-table';

@Component({
  selector: 'neuroglia-mat-queryable-table',
  templateUrl: './angular-material-queryable-table.component.html',
  styleUrls: ['./angular-material-queryable-table.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [MaterialQueryableTableStore],
})
export class NeurogliaNgMatQueryableDataTableComponent implements OnChanges, OnDestroy, IQueryableTableComponent {
  protected readonly store = inject(MaterialQueryableTableStore);
  @Input() configuration: QueryableTableConfig;
  @Output() rowClicked: EventEmitter<any> = new EventEmitter<any>();
  @Output() rowExpanded: EventEmitter<any> = new EventEmitter<any>();
  @Output() selectionChanged: EventEmitter<any[]> = new EventEmitter<any[]>();
  @ContentChild('title') title!: ElementRef;
  @ContentChild('interations') interations!: ElementRef;
  columnDefinitions$: Observable<ColumnDefinition[]> = this.store.columnDefinitions$;
  displayedColumns$: Observable<string[]> = this.store.displayedColumns$;
  data$: Observable<any> = this.store.data$;
  dataSourceType$: Observable<string> = this.store.dataSourceType$;
  error$: Observable<string> = this.store.error$;
  isLoading$: Observable<boolean> = this.store.isLoading$;
  stickHeader$: Observable<boolean> = this.store.stickHeader$;
  count$: Observable<number> = this.store.count$;
  sort$: Observable<Sort | null> = this.store.sort$;
  matSort$: Observable<MatSort | null> = this.sort$.pipe(
    map((sort) => (sort ? ({ active: sort.column, direction: sort.direction } as MatSort) : null)),
  );
  pageSize$: Observable<number | null> = this.store.pageSize$;
  pageIndex$: Observable<number | null> = this.store.pageIndex$;
  filters$: Observable<Filters> = this.store.filters$;
  serviceUrl$: Observable<string> = this.store.serviceUrl$;
  target$: Observable<string> = this.store.target$;
  enableSelection$: Observable<boolean> = this.store.enableSelection$;
  selectedRows$: Observable<any[]> = this.store.selectedRows$;
  enableRowExpansion$: Observable<boolean> = this.store.enableRowExpansion$;
  expandedRow$: Observable<any> = this.store.expandedRow$;
  enableColumnSettings$: Observable<boolean> = this.store.enableColumnSettings$;
  protected destroyNotifier: Subject<void> = new Subject<void>();

  ngOnChanges(changes: SimpleChanges): void {
    const { configuration } = changes;
    if (configuration.firstChange) {
      this.store.init(this.configuration).subscribe();
    }
  }

  ngOnDestroy(): void {
    this.store.destroy();
    this.destroyNotifier.next();
    this.destroyNotifier.complete();
  }

  onSortChange(sort: Sort | null) {
    this.store.sort(sort);
  }

  onPageChange(paging: Paging) {
    this.store.page(paging);
  }

  onShowFilter(evt: ShowFilterEvent) {
    const { filterComponentType, columnDefinition, filter } = evt;
    this.store.showFilterDialog(filterComponentType, columnDefinition, filter);
  }

  onShowColumnSettings() {
    this.store.showColumnSettingsDialog();
  }

  onExpandRow(row: any | null) {
    this.store.expandRow(row);
    this.rowExpanded.emit(row);
  }

  onSelectionChange(rows?: any[]) {
    this.store.selectRows(rows);
    this.selectionChanged.emit(rows);
  }

  clearSelection() {
    this.store.selectRows([]);
  }

  reload() {
    this.store.reload();
  }
}
