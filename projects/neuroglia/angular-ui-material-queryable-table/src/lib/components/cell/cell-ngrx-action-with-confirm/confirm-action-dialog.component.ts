import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'neuroglia-mat-queryable-table-cell-ngrx-action-with-confirm-dialog',
  templateUrl: 'confirm-action-dialog.component.html',
})
export class ConfirmActionDialog {
  constructor(@Inject(MAT_DIALOG_DATA) public data: string) {}
}
