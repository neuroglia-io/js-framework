import { ApplicationConfig, ApplicationRef, NgZone, Type, reflectComponentType } from '@angular/core';
import { bootstrapApplication, createApplication } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { NgElementConfig, NgElementConstructor, createCustomElement } from '@angular/elements';
import { BootstrapFederatedApplicationOptions, BootstrapFederatedWebComponentOptions } from './models';
import { connectRouter } from './router-utils';

export function bootstrapFederatedApplication<TRootComponent>(
  component: Type<TRootComponent>,
  appConfig: ApplicationConfig,
  options: BootstrapFederatedApplicationOptions,
): Promise<ApplicationRef> {
  let { appType, enableNgZoneSharing } = options;
  enableNgZoneSharing = enableNgZoneSharing !== false;
  if (enableNgZoneSharing && appType === 'microfrontend') {
    appConfig = { ...appConfig };
    appConfig.providers = [
      (globalThis as any).ngZone ? { provide: NgZone, useValue: (globalThis as any).ngZone } : [],
      ...appConfig.providers,
    ];
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
      if (router) {
        const useHash = location.href.includes('#');
        connectRouter(router, useHash);
      }
    }
    return appRef;
  });
}

export function bootstrapFederatedWebComponent<TRootComponent>(
  component: Type<TRootComponent>,
  appConfig: ApplicationConfig,
  elementConfig: NgElementConfig,
  options: BootstrapFederatedWebComponentOptions,
): Promise<{ appRef: ApplicationRef; elementCtr: NgElementConstructor<TRootComponent> }> {
  let { appType, enableNgZoneSharing } = options;
  enableNgZoneSharing = enableNgZoneSharing !== false;
  if (enableNgZoneSharing && appType === 'microfrontend') {
    appConfig = { ...appConfig };
    appConfig.providers = [
      (globalThis as any).ngZone ? { provide: NgZone, useValue: (globalThis as any).ngZone } : [],
      ...appConfig.providers,
    ];
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
      if (router) {
        const useHash = location.href.includes('#');
        connectRouter(router, useHash);
      }
    }
    elementConfig.injector = elementConfig.injector || appRef.injector;
    const elementCtr = createCustomElement<TRootComponent>(component, elementConfig);
    const componentType = reflectComponentType(component);
    customElements.define(componentType?.selector || options.elementName, elementCtr);
    return { appRef, elementCtr };
  });
}
