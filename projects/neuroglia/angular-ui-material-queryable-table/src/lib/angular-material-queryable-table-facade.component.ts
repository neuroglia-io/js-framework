import { ChangeDetectionStrategy, Component, Input, ContentChild, ElementRef } from '@angular/core';
import { IMatQueryableDataTableComponent } from './models';

/**
 * A component used to shared the template of the table entry point
 * useful to extend NeurogliaNgMatQueryableDataTableComponent without having to rewrite the template
 */
@Component({
  selector: 'neuroglia-mat-queryable-table-facade',
  templateUrl: './angular-material-queryable-table-facade.component.html',
  styleUrls: ['./angular-material-queryable-table-facade.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NeurogliaNgMatQueryableDataTableFacadeComponent {
  @Input() parent: IMatQueryableDataTableComponent;

  @ContentChild('title') title!: ElementRef;
  @ContentChild('interations') interations!: ElementRef;
}
