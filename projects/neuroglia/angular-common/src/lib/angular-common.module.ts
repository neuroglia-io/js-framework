import { NgModule } from '@angular/core';
import { CamelCasePipe } from './pipes/camel-case.pipe';
import { HumanCasePipe } from './pipes/human-case.pipe';
import { KebabCasePipe } from './pipes/kebab-case.pipe';
import { PascalCasePipe } from './pipes/pascal-case.pipe';
import { SnakeCasePipe } from './pipes/snake-case.pipe';

@NgModule({
  imports: [CamelCasePipe, HumanCasePipe, KebabCasePipe, PascalCasePipe, SnakeCasePipe],
  exports: [CamelCasePipe, HumanCasePipe, KebabCasePipe, PascalCasePipe, SnakeCasePipe],
  providers: [CamelCasePipe, HumanCasePipe, KebabCasePipe, PascalCasePipe, SnakeCasePipe],
})
export class NeurogliaNgCommonModule {}
