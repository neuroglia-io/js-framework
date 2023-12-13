import { ChangeDetectionStrategy, Component, Input, SimpleChanges } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { NamedLoggingServiceFactory } from '@neuroglia/angular-logging';
import { createReactiveAction } from '@neuroglia/angular-ngrx';
import {
  ColumnDefinition,
  ICellComponent,
  IODataTableComponent,
} from '@neuroglia/angular-ngrx-component-store-odata-table';
import { ILogger } from '@neuroglia/logging';
import { strFormatNamed } from '@neuroglia/string-formatter';
import { Actions } from '@ngrx/effects';
import { Action, Store } from '@ngrx/store';
import { ConfirmActionDialog } from './confirm-action-dialog.component';

@Component({
  selector: 'neuroglia-mat-odata-table-cell-ngrx-action-with-confirm',
  templateUrl: './cell-ngrx-action-with-confirm.component.html',
  styleUrls: ['./cell-ngrx-action-with-confirm.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CellNgrxActionWithConfirmComponent implements ICellComponent {
  /** The OData table container */
  @Input() odataTable: IODataTableComponent;
  /** The row data */
  @Input() row: any;
  /** The column definition */
  @Input() columnDefinition: ColumnDefinition;
  /** The address of the OData service endpoint */
  @Input() serviceUrl: string;
  /** The name of the entity to gather the data from */
  @Input() entityName: string;
  message: string;
  buttonLabel: string;
  buttonColor: string;
  buttonIcon?: string;
  actionType: string;
  reactionTypes: string[];
  protected logger: ILogger;

  constructor(
    protected store: Store,
    protected namedLoggingServiceFactory: NamedLoggingServiceFactory,
    protected dialog: MatDialog,
    private actions$: Actions,
  ) {
    this.logger = this.namedLoggingServiceFactory.create('CellNgrxActionWithConfirmComponent');
  }

  ngOnChanges(changes: SimpleChanges): void {
    const { columnDefinition } = changes;
    if (
      columnDefinition?.currentValue &&
      columnDefinition.previousValue != columnDefinition?.currentValue &&
      !!columnDefinition.currentValue.metadata.action
    ) {
      this.message = strFormatNamed(this.columnDefinition.metadata.message, { item: this.row });
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

  confirm() {
    const config = new MatDialogConfig();
    config.data = this.message;
    const dialogRef = this.dialog.open(ConfirmActionDialog, config);
    dialogRef.afterClosed().subscribe({
      next: (result: boolean | string): void => {
        if (!result) return;
        const action: Action = {
          type: this.actionType,
          ...this.row,
        };
        if (this.reactionTypes?.length) {
          createReactiveAction(this.store, this.actions$, action, this.reactionTypes).subscribe({
            complete: () => this.odataTable.reload(),
          });
          return;
        }
        this.store.dispatch(action);
        setTimeout(() => {
          this.odataTable.reload();
        }, 500);
      },
    });
  }
}
