import { APP_INITIALIZER, EnvironmentProviders, Provider, enableProdMode, importProvidersFrom } from '@angular/core';
import { KeycloakAngularModule, KeycloakEvent, KeycloakEventType, KeycloakService } from 'keycloak-angular';
import { IApplicationConfig } from './models';
import { APPLICATION_CONFIG_TOKEN } from './providers';
import { defaultKeycloakInitOptions } from './default-keycloak-options';

/** Gets the application baseUrl */
function getBaseUrl() {
  return document.getElementsByTagName('base')[0].href;
}

/** Basic providers for BASE_URL. The array will be extented in the startup process */
const providers: Array<Provider | EnvironmentProviders> = [{ provide: 'BASE_URL', useFactory: getBaseUrl }];

/** The factory used to initialize the keycloak */
const initKeycloak = (config: IApplicationConfig, keycloak: KeycloakService) => () =>
  keycloak
    .init({
      ...config.keycloakOptions,
      initOptions: {
        ...defaultKeycloakInitOptions,
        enableLogging: config.environment === 'development',
        ...(config.keycloakOptions.initOptions || {}),
      },
    })
    .then((authenticated: boolean) => {
      if (!authenticated) {
        return keycloak.login({ redirectUri: window.location.href }).then(() => Promise.reject());
      }
      // Token verification, try to renew when expired, if it fails, redirect to the login page
      keycloak.keycloakEvents$.subscribe({
        next(event: KeycloakEvent) {
          if (event.type === KeycloakEventType.OnTokenExpired) {
            keycloak.updateToken(10).then((hasBeenRenewed) => {
              if (hasBeenRenewed) {
                return Promise.resolve();
              }
              return keycloak.login({ redirectUri: window.location.href });
            });
          }
        },
      });
      return Promise.resolve();
    });
/**
 * Startup the application with the provided configuration file
 * @param applicationConfigFile The configuration file URL to start the application with
 * @param extraConfig Some extra configuration, useful for non serializable members
 * @returns A promise of providers (@see {@link Provider} and @see {@link EnvironmentProviders}) containing the application config token and keycloak services/interceptors
 */
export const startupApplication = (
  applicationConfigFile: string,
  extraConfig: Partial<IApplicationConfig> | undefined = undefined,
): Promise<Array<Provider | EnvironmentProviders>> =>
  fetch(applicationConfigFile)
    .then((res) => {
      if (res.status === 200) return res.json();
      throw new Error('Failed to fetch application configuration.');
    })
    .then((config: IApplicationConfig) => {
      config = {
        ...config,
        ...(extraConfig || {}),
      };
      if (!config?.environment || !config?.keycloakOptions?.config) {
        throw new Error('The configuration seems to be empty or invalid');
      }
      if (config.environment !== 'development') {
        enableProdMode();
      }
      providers.push({ provide: APPLICATION_CONFIG_TOKEN, useValue: config });
      providers.push(importProvidersFrom([KeycloakAngularModule]));
      providers.push({
        provide: APP_INITIALIZER,
        useFactory: initKeycloak,
        multi: true,
        deps: [APPLICATION_CONFIG_TOKEN, KeycloakService],
      });
      return Promise.resolve(providers);
    });
