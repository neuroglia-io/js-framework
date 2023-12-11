import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { EnvironmentProviders, Provider, enableProdMode } from '@angular/core';
import { KeycloakBearerInterceptor, KeycloakService } from 'keycloak-angular';
import { IApplicationConfig } from './models';
import { APPLICATION_CONFIG_TOKEN } from './providers';
import { defaultKeycloakInitOptions } from './default-keycloak-options';

// get the application baseUrl
function getBaseUrl() {
  return document.getElementsByTagName('base')[0].href;
}

// a KeycloakService instance created manually and provided to the app
const keycloakService = new KeycloakService();

// basic providers for BASE_URL and Keycloak. The application config token will be added later in the process
const providers: Array<Provider | EnvironmentProviders> = [
  { provide: 'BASE_URL', useFactory: getBaseUrl },
  { provide: KeycloakService, useValue: keycloakService },
  { provide: HTTP_INTERCEPTORS, useClass: KeycloakBearerInterceptor, multi: true },
];

/**
 * Startup the application with the provided configuration file
 * @param applicationConfigFile The configuration file URL to start the application with
 * @returns A promise resolving if the application startup succeeded and the user is authenticated
 */
export const startupApplication = (applicationConfigFile: string): Promise<boolean> =>
  fetch(applicationConfigFile)
    .then((res) => {
      if (res.status === 200) return res.json();
      throw new Error('Failed to fetch application configuration.');
    })
    .then((config: IApplicationConfig) => {
      if (!config?.environment || !config?.keycloakOptions?.config) {
        throw new Error('The configuration seems to be empty or invalid');
      }
      if (config.environment !== 'development') {
        enableProdMode();
      }
      providers.push({ provide: APPLICATION_CONFIG_TOKEN, useValue: config });
      return keycloakService.init({
        ...config.keycloakOptions,
        initOptions: {
          ...defaultKeycloakInitOptions,
          enableLogging: config.environment === 'development',
          ...(config.keycloakOptions.initOptions || {}),
        },
      });
    })
    .then((authenticated: boolean) => {
      if (authenticated) {
        return Promise.resolve(true);
      }
      return keycloakService
        .login({
          redirectUri: window.location.href,
        })
        .then(() => Promise.reject('Unauthenticated'));
    });
