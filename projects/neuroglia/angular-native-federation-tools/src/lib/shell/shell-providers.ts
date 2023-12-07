import { provideHttpClient } from '@angular/common/http';
import { EnvironmentProviders, Provider, importProvidersFrom } from '@angular/core';
import { Routes, provideRouter } from '@angular/router';
import { provideEffects } from '@ngrx/effects';
import { provideRouterStore } from '@ngrx/router-store';
import { provideStore } from '@ngrx/store';
import { StoreDevtoolsOptions, provideStoreDevtools } from '@ngrx/store-devtools';
import { IS_RUNNING_IN_SHELL_TOKEN } from './is-running-in-shell-token';

/** The default {@link StoreDevtoolsOptions} */
export const defaultStoreDevtoolsOptions: StoreDevtoolsOptions = {
  maxAge: 50,
  // logOnly: false,      // default, can be omitted
  // autoPause: false,    // default, can be omitted
  // connectInZone: false // default, can be omitted
};

/**
 * The service providers used by the shell. Also useful when running microfronted isolated.
 * @param routes The {@link Routes} used by the application
 * @param isRunningInShell Defines if the app is running inside a shell
 * @param storeDevtoolsOptions The {@link StoreDevtoolsOptions} to use
 * @returns
 */
export const getShellProviders = (
  routes: Routes,
  isRunningInShell: boolean,
  storeDevtoolsOptions: StoreDevtoolsOptions | undefined = {},
): Array<Provider | EnvironmentProviders> => [
  provideHttpClient(),
  provideRouter(routes),
  provideStore(),
  provideEffects(),
  provideRouterStore(),
  provideStoreDevtools({ ...defaultStoreDevtoolsOptions, ...storeDevtoolsOptions }),
  { provide: IS_RUNNING_IN_SHELL_TOKEN, useValue: isRunningInShell },

  /** Other samples: */

  /** Provide token */
  // { provide: TOKEN, useValue/factory: .... },

  /** Import "legacy" NgModule */
  // importProvidersFrom(
  //   MyModule.forRoot()

  //   NeurogliaNgCommonModule, //?
  //   NeurogliaNgLoggingModule, //?
  //   NeurogliaNgRestCoreModule, //?
  //   NeurogliaNgRestCoreModule, //?
  //   NeurogliaNgSignalrModule, //?
  // )
];
