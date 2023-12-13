import { NgModule } from '@angular/core';
import { JsonPresenterComponent } from './angular-ui-json-presenter.component';
import { CommonModule } from '@angular/common';
import { NeurogliaNgCommonModule } from '@neuroglia/angular-common';

@NgModule({
  declarations: [JsonPresenterComponent],
  imports: [CommonModule, NeurogliaNgCommonModule],
  exports: [JsonPresenterComponent],
})
export class NeurogliaNgUiJsonPresenterModule {}
