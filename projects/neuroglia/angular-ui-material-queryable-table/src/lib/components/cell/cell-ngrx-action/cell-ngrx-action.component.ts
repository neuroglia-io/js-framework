import { Component, ChangeDetectionStrategy, Input, SimpleChanges } from '@angular/core';
import { NamedLoggingServiceFactory } from '@neuroglia/angular-logging';
import { ILogger } from '@neuroglia/logging';
import { Action, Store } from '@ngrx/store';
import { Actions } from '@ngrx/effects';
import { createReactiveAction } from '@neuroglia/angular-ngrx';
import {
  ColumnDefinition,
  ICellComponent,
  IQueryableTableComponent,
} from '@neuroglia/angular-ngrx-component-store-queryable-table';

@Component({
  selector: 'neuroglia-mat-queryable-table-cell-ngrx-action',
  templateUrl: './cell-ngrx-action.component.html',
  styleUrls: ['./cell-ngrx-action.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CellNgrxActionComponent implements ICellComponent {
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
  buttonLabel: string;
  buttonColor: string;
  buttonIcon?: string;
  actionType: string;
  reactionTypes: string[];
  protected logger: ILogger;

  constructor(
    protected store: Store,
    protected namedLoggingServiceFactory: NamedLoggingServiceFactory,
    private actions$: Actions,
  ) {
    this.logger = this.namedLoggingServiceFactory.create('CellNgrxActionComponent');
  }

  ngOnChanges(changes: SimpleChanges): void {
    const { columnDefinition } = changes;
    if (
      columnDefinition?.currentValue &&
      columnDefinition.previousValue != columnDefinition?.currentValue &&
      !!columnDefinition.currentValue.metadata.action
    ) {
      this.actionType = this.columnDefinition.metadata.action;
      this.reactionTypes = this.columnDefinition.metadata.reactions;
      this.buttonLabel = this.columnDefinition.metadata.buttonLabel;
      this.buttonIcon = this.columnDefinition.metadata.buttonIcon;
      this.buttonColor = this.columnDefinition.metadata.buttonColor || 'btn--primary';
      if (!this.buttonColor.startsWith('btn--')) {
        this.buttonColor = `btn--${this.buttonColor}`;
      }
    }
  }

  trigger(): void {
    const action: Action = {
      type: this.actionType,
      ...this.row,
    };
    if (this.reactionTypes?.length) {
      createReactiveAction(this.store, this.actions$, action, this.reactionTypes).subscribe({
        complete: () => this.table.reload(),
      });
      return;
    }
    this.store.dispatch(action);
    setTimeout(() => {
      this.table.reload();
    }, 500);
  }
}
