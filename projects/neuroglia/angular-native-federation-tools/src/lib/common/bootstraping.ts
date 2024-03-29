import { ApplicationConfig, ApplicationRef, NgZone, Type, reflectComponentType } from '@angular/core';
import { bootstrapApplication, createApplication } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { NgElementConstructor, createCustomElement } from '@angular/elements';
import { BootstrapFederatedApplicationOptions, BootstrapFederatedWebComponentOptions } from '../models';
import { connectRouter } from './router-utils';

/**
 * Bootstraps a federated application with a standalone component entry point
 * @param component The standalone component to bootstrap the application for
 * @param appConfig The @see {@link ApplicationConfig} to bootstrap the application with
 * @param options The @see {@link BootstrapFederatedApplicationOptions} use to bootstrap the federation
 * @returns the bootstraped @see {@link ApplicationRef}
 */
export function bootstrapFederatedApplication<TRootComponent>(
  component: Type<TRootComponent>,
  appConfig: ApplicationConfig,
  options: BootstrapFederatedApplicationOptions,
): Promise<ApplicationRef> {
  let { appType, enableNgZoneSharing } = options;
  enableNgZoneSharing = enableNgZoneSharing !== false;
  if (enableNgZoneSharing && appType === 'microfrontend') {
    const ngZoneProvider = (globalThis as any).ngZone ? { provide: NgZone, useValue: (globalThis as any).ngZone } : [];
    appConfig = { ...appConfig };
    appConfig.providers = [ngZoneProvider, ...appConfig.providers];
  }
  return bootstrapApplication(component, appConfig).then((appRef: ApplicationRef) => {
    if (appType === 'shell') {
      if (enableNgZoneSharing) {
        const ngZone = appRef.injector.get(NgZone);
        if (ngZone) {
          (globalThis as any).ngZone = ngZone;
        }
      }
    } else if (appType === 'microfrontend') {
      const router = appRef.injector.get(Router);
      const ngZone = appRef.injector.get(NgZone);
      if (router) {
        const useHash = location.href.includes('#');
        connectRouter(router, useHash, ngZone);
      }
    }
    return appRef;
  });
}

/**
 * Bootstraps a federated application with an Angular Elements based web component entry point
 * @param component The web component to bootstrap the application for
 * @param appConfig The @see {@link ApplicationConfig} to bootstrap the application with
 * @param options The @see {@link BootstrapFederatedApplicationOptions} use to bootstrap the federation
 * @returns the bootstraped @see {@link ApplicationRef} and @see {@link NgElementConstructor<TRootComponent>}
 */
export function bootstrapFederatedWebComponent<TRootComponent>(
  component: Type<TRootComponent>,
  appConfig: ApplicationConfig,
  options: BootstrapFederatedWebComponentOptions,
): Promise<{ appRef: ApplicationRef; elementCtr: NgElementConstructor<TRootComponent> }> {
  let { appType, enableNgZoneSharing } = options;
  enableNgZoneSharing = enableNgZoneSharing !== false;
  if (enableNgZoneSharing && appType === 'microfrontend') {
    const ngZoneProvider = (globalThis as any).ngZone ? { provide: NgZone, useValue: (globalThis as any).ngZone } : [];
    appConfig = { ...appConfig };
    appConfig.providers = [ngZoneProvider, ...appConfig.providers];
  }
  return createApplication(appConfig).then((appRef: ApplicationRef) => {
    if (appType === 'shell') {
      if (enableNgZoneSharing) {
        const ngZone = appRef.injector.get(NgZone);
        if (ngZone) {
          (globalThis as any).ngZone = ngZone;
        }
      }
    } else if (appType === 'microfrontend') {
      const router = appRef.injector.get(Router);
      const ngZone = appRef.injector.get(NgZone);
      if (router) {
        const useHash = location.href.includes('#');
        connectRouter(router, useHash, ngZone);
      }
    }
    const elementCtr = createCustomElement<TRootComponent>(component, { injector: appRef.injector });
    const componentType = reflectComponentType(component);
    customElements.define(componentType?.selector || options.elementName, elementCtr);
    return { appRef, elementCtr };
  });
}
