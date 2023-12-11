import { KeycloakOptions } from 'keycloak-angular';

/**
 * Represents the basic configuration of an application
 */
export interface IApplicationConfig {
  /** The running environment type, 'development' | 'staging' | 'production' */
  environment: 'development' | 'staging' | 'production';
  /** The (partial) @see {@link KeycloakOptions} used when initializing the @see {@link KeycloakService}*/
  keycloakOptions: KeycloakOptions;
  /** Extra properties */
  [key: string]: any;
}
