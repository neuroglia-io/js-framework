import { OnInit, Component, ElementRef, Input, OnChanges, SimpleChanges, ViewChild, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { loadRemoteModule } from '@angular-architects/native-federation';
import { NamedLoggingServiceFactory } from '@neuroglia/angular-logging';
import { ILogger } from '@neuroglia/logging';
import { WebComponentWrapperConfig } from './models/web-component-wrapper-config';
import { CommonModule } from '@angular/common';

type EventHandlers = { [event: string]: (event: Event) => void };

@Component({
  selector: 'web-component-wrapper',
  standalone: true,
  imports: [CommonModule],
  template: `<div #host></div>`,
})
export class WebComponentWrapper implements OnChanges, OnInit {
  @ViewChild('host', { read: ElementRef, static: true }) host: ElementRef;

  @Input() config: WebComponentWrapperConfig;
  @Input() props: { [prop: string]: unknown };
  @Input() handlers: EventHandlers;

  webComponent: HTMLElement | undefined;
  protected route = inject(ActivatedRoute);
  protected namedLoggingServiceFactory = inject(NamedLoggingServiceFactory);
  protected logger: ILogger = this.namedLoggingServiceFactory.create('WebComponentWrapper<unknown>');

  async ngOnInit(): Promise<void> {
    await this.loadWebComponent();
  }

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

  protected bindProps(): void {
    if (!this.webComponent) return;
    for (const prop in this.props) {
      (this.webComponent as any)[prop] = this.props[prop];
    }
  }

  protected bindEventHandlers(): void {
    if (!this.webComponent) return;
    for (const event in this.handlers) {
      this.webComponent.addEventListener(event, this.handlers[event]);
    }
  }

  protected unbindEventHandlers(handlers: EventHandlers): void {
    if (!this.webComponent) return;
    for (const event in handlers) {
      this.webComponent.removeEventListener(event, this.handlers[event]);
    }
  }
}
