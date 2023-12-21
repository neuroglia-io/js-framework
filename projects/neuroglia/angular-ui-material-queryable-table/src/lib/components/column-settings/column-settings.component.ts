import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { Component, ChangeDetectionStrategy, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import {
  ColumnDefinition,
  expandRowColumnDefinition,
  selectRowColumnDefinition,
} from '@neuroglia/angular-ngrx-component-store-queryable-table';
import { ColumnSettingsDialogData } from '../../models';

@Component({
  selector: 'neuroglia-mat-queryable-table-column-settings',
  templateUrl: './column-settings.component.html',
  styleUrls: ['./column-settings.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ColumnSettingsComponent {
  columnDefinitions: ColumnDefinition[] = [];
  selectRowColumnDefinition = selectRowColumnDefinition;
  expandRowColumnDefinition = expandRowColumnDefinition;

  constructor(@Inject(MAT_DIALOG_DATA) public data: ColumnSettingsDialogData) {
    this.columnDefinitions = this.data.columnDefinitions;
  }

  onDrop(event: CdkDragDrop<ColumnDefinition>) {
    moveItemInArray(this.columnDefinitions, event.previousIndex, event.currentIndex);
    this.columnDefinitions.forEach((def, index) => {
      def.position = index + 1;
    });
  }
}
