import { Component, ChangeDetectionStrategy, Input } from '@angular/core';
import { ColumnDefinition } from '@neuroglia/angular-ngrx-component-store-odata-table';

@Component({
  selector: 'neuroglia-mat-odata-table-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeaderComponent {
  @Input() columnDefinition: ColumnDefinition;
}
