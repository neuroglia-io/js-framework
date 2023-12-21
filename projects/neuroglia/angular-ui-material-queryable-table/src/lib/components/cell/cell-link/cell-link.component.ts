import { Component, ChangeDetectionStrategy, Input, SimpleChanges, OnChanges } from '@angular/core';
import { NamedLoggingServiceFactory } from '@neuroglia/angular-logging';
import {
  ColumnDefinition,
  ICellComponent,
  IQueryableTableComponent,
} from '@neuroglia/angular-ngrx-component-store-queryable-table';
import { ILogger } from '@neuroglia/logging';
import { strFormatNamed } from '@neuroglia/string-formatter';

@Component({
  selector: 'neuroglia-mat-queryable-table-cell-link',
  templateUrl: './cell-link.component.html',
  styleUrls: ['./cell-link.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CellLinkComponent implements OnChanges, ICellComponent {
  /** The queryable table container */
  @Input() table: IQueryableTableComponent;
  /** The row data */
  @Input() row: any;
  /** The column definition */
  @Input() columnDefinition: ColumnDefinition;
  /** The address of the OData service endpoint */
  @Input() serviceUrl: string;
  /** The name of the entity to gather the data from */
  @Input() entityName: string;
  routerLink: string | any[];
  buttonLabel: string;
  buttonColor: string;
  buttonIcon?: string;
  protected logger: ILogger;

  constructor(protected namedLoggingServiceFactory: NamedLoggingServiceFactory) {
    this.logger = this.namedLoggingServiceFactory.create('CellLinkComponent');
  }

  ngOnChanges(changes: SimpleChanges): void {
    const { columnDefinition } = changes;
    if (
      columnDefinition?.currentValue &&
      columnDefinition.previousValue != columnDefinition?.currentValue &&
      !!columnDefinition.currentValue.metadata.routerLink
    ) {
      let routerLink = '';
      try {
        if (Array.isArray(this.columnDefinition.metadata.routerLink)) {
          (this.columnDefinition.metadata.routerLink as any[]).forEach((fragment) => {
            routerLink += strFormatNamed(fragment, { item: this.row });
          });
        } else {
          routerLink = strFormatNamed(this.columnDefinition.metadata.routerLink, { item: this.row });
        }
        this.routerLink = routerLink;
        this.buttonLabel = this.columnDefinition.metadata.buttonLabel;
        this.buttonIcon = this.columnDefinition.metadata.buttonIcon;
        this.buttonColor = this.columnDefinition.metadata.buttonColor || 'btn--primary';
        if (!this.buttonColor.startsWith('btn--')) {
          this.buttonColor = `btn--${this.buttonColor}`;
        }
      } catch (ex) {
        this.logger.error('An error occured while compiling the expression', ex);
      }
    }
  }
}
