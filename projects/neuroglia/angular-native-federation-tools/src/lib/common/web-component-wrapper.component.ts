/**
 * See https://www.angulararchitects.io/blog/micro-frontends-with-modern-angular-part-2-multi-version-and-multi-framework-solutions-with-angular-elements-and-web-components/
 */

import { OnInit, Component, ElementRef, Input, OnChanges, SimpleChanges, ViewChild, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { loadRemoteModule } from '@angular-architects/native-federation';
import { NamedLoggingServiceFactory } from '@neuroglia/angular-logging';
import { ILogger } from '@neuroglia/logging';
import { WebComponentWrapperConfig } from '../models/web-component-wrapper-config';
import { CommonModule } from '@angular/common';

type EventHandlers = { [event: string]: (event: Event) => void };

/**
 * A component used to load a web component
 */
@Component({
  selector: 'web-component-wrapper',
  standalone: true,
  imports: [CommonModule],
  template: `<div #host></div>`,
})
export class WebComponentWrapper implements OnChanges, OnInit {
  /** The web component host */
  @ViewChild('host', { read: ElementRef, static: true }) host: ElementRef | undefined;

  /** The web component config */
  @Input() config: WebComponentWrapperConfig | undefined;
  /** The web component inputs/attributes */
  @Input() props: { [prop: string]: unknown } | undefined;
  /** The web component outputs/events handlers */
  @Input() handlers: EventHandlers | undefined;

  /** The web component instance */
  protected webComponent: HTMLElement | undefined;
  /** The current activated route */
  protected route = inject(ActivatedRoute);
  /** The {@link ILogger} factory */
  protected namedLoggingServiceFactory = inject(NamedLoggingServiceFactory);
  /** The current {@link ILogger} */
  protected logger: ILogger = this.namedLoggingServiceFactory.create('WebComponentWrapper<unknown>');

  /** Implements OnInit */
  async ngOnInit(): Promise<void> {
    await this.loadWebComponent();
  }

  /** Implements OnChanges */
  async ngOnChanges(changes: SimpleChanges): Promise<void> {
    if (!this.webComponent) return;
    const { config, handlers } = changes;
    if (config?.previousValue !== config?.currentValue && config?.currentValue) {
      await this.loadWebComponent();
    }
    if (handlers?.previousValue !== handlers?.currentValue && handlers?.previousValue) {
      this.unbindEventHandlers(handlers.previousValue);
    }
    this.bindEventHandlers();
    this.bindProps();
  }

  /** Loads the remote using the {@link WebComponentWrapperConfig} and create an instance of the web component */
  protected async loadWebComponent(): Promise<void> {
    const config = this.config || (this.route.snapshot.data as WebComponentWrapperConfig);
    if (!config) return;
    this.logger = this.namedLoggingServiceFactory.create(`WebComponentWrapper<${config.elementName}>`);
    try {
      await loadRemoteModule(config);
      this.webComponent = document.createElement(config.elementName);
      this.bindProps();
      this.bindEventHandlers();
      this.host!.nativeElement.appendChild(this.webComponent);
    } catch (ex) {
      this.logger.error(ex);
    }
  }

  /** Binds input/attributes to the web component instance */
  protected bindProps(): void {
    if (!this.webComponent) return;
    for (const prop in this.props) {
      (this.webComponent as any)[prop] = this.props[prop];
    }
  }

  /** Binds outputs/events handlers to the web component instance */
  protected bindEventHandlers(): void {
    if (!this.webComponent) return;
    for (const event in this.handlers) {
      this.webComponent.addEventListener(event, this.handlers[event]);
    }
  }

  /** Clears the previous outputs/events handlers of the web component instance */
  protected unbindEventHandlers(handlers: EventHandlers): void {
    if (!this.webComponent) return;
    for (const event in handlers) {
      this.webComponent.removeEventListener(event, handlers[event]);
    }
  }
}
