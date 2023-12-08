/**
 * See https://www.angulararchitects.io/blog/micro-frontends-with-modern-angular-part-2-multi-version-and-multi-framework-solutions-with-angular-elements-and-web-components/
 */

import { CommonModule } from '@angular/common';
import { Component, Input, inject, Injector } from '@angular/core';
import { loadRemoteModule } from '@neuroglia/angular-native-federation';
import { WebComponentWrapper } from './web-component-wrapper.component';
import { createCustomElement } from '@angular/elements';
import { WebComponentWrapperConfig } from '../models';
import { AngularComponentConfig } from '../models/angular-component-config';

type EventHandlers = { [event: string]: (event: Event) => void };

/**
 * A component used to load an angular component
 */
@Component({
  selector: 'angular-component-wrapper',
  standalone: true,
  imports: [CommonModule],
  template: `<div #host></div>`,
})
export class AngularComponentWrapper extends WebComponentWrapper {
  injector = inject(Injector);

  /** The angular component config */
  @Input() override config: WebComponentWrapperConfig | undefined;

  protected override async loadWebComponent(): Promise<void> {
    const config = this.config || (this.route.snapshot.data as WebComponentWrapperConfig);
    if (!config) return;
    this.logger = this.namedLoggingServiceFactory.create(`WebComponentWrapper<${config.elementName}>`);
    try {
      if (!customElements.get(config.elementName)) {
        const angularComponent = (await loadRemoteModule(config)) as AngularComponentConfig;
        const injector = Injector.create({
          name: 'CmpInjector',
          parent: this.injector,
          providers: angularComponent.providers,
        });
        const elementCtr = createCustomElement(angularComponent.component, { injector });
        customElements.define(config.elementName, elementCtr);
      }
      this.webComponent = document.createElement(config.elementName);
      this.bindProps();
      this.bindEventHandlers();
      this.host!.nativeElement.appendChild(this.webComponent);
    } catch (ex) {
      this.logger.error(ex);
    }
  }
}
