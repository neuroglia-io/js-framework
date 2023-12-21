import { Component, ChangeDetectionStrategy, Input } from '@angular/core';
import { ColumnDefinition } from '@neuroglia/angular-ngrx-component-store-queryable-table';

@Component({
  selector: 'neuroglia-mat-queryable-table-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeaderComponent {
  @Input() columnDefinition: ColumnDefinition;
}
