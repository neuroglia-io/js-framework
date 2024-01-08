import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ComponentRef,
  Input,
  OnChanges,
  OnDestroy,
  SimpleChanges,
  ViewChild,
  ViewContainerRef,
} from '@angular/core';
import {
  ColumnDefinition,
  ICellComponent,
  IQueryableTableComponent,
  QueryableTableTemplateProvider,
} from '@neuroglia/angular-ngrx-component-store-queryable-table';

@Component({
  selector: 'neuroglia-mat-queryable-table-cell',
  templateUrl: './cell.component.html',
  styleUrls: ['./cell.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CellComponent implements OnChanges, OnDestroy {
  /** The template view container reference */
  @ViewChild('templateContainer', { read: ViewContainerRef, static: true }) templateContainer: ViewContainerRef;

  /** The OData table container */
  @Input() table: IQueryableTableComponent;
  /** The row data */
  @Input() row: any;
  /** The column definition */
  @Input() columnDefinition: ColumnDefinition;
  /** The column definition */
  @Input() dataSourceType: string;
  /** The address of the OData service endpoint */
  @Input() serviceUrl: string;
  /** The name of the entity to gather the data from */
  @Input() target: string;
  /** The cell component reference */
  private cellRef: ComponentRef<ICellComponent> | null;

  constructor(
    private templateProvider: QueryableTableTemplateProvider,
    private changeDetectorRef: ChangeDetectorRef,
  ) {}

  ngOnChanges(changes: SimpleChanges): void {
    const { columnDefinition, row } = changes;
    if (
      columnDefinition?.currentValue &&
      row?.currentValue &&
      (this.columnDefinition != columnDefinition?.previousValue || this.row != row?.previousValue)
    ) {
      if (this.cellRef) {
        this.cellRef.destroy();
        this.cellRef = null;
        this.templateContainer.clear();
      }
      const componentType = this.templateProvider.getCellTemplate(
        this.row,
        this.columnDefinition,
        this.dataSourceType,
        this.serviceUrl,
        this.target,
      );
      if (componentType) {
        this.cellRef = this.templateContainer.createComponent(componentType);
        this.cellRef.instance.table = this.table;
        this.cellRef.instance.row = this.row;
        this.cellRef.instance.columnDefinition = this.columnDefinition;
        this.cellRef.instance.serviceUrl = this.serviceUrl;
        this.cellRef.instance.target = this.target;
        this.cellRef.instance.ngOnChanges && this.cellRef.instance.ngOnChanges(changes);
        this.changeDetectorRef.detectChanges();
      }
    }
  }

  ngOnDestroy(): void {
    if (this.cellRef) {
      this.cellRef.destroy();
      this.cellRef = null;
      this.templateContainer.clear();
    }
  }
}
