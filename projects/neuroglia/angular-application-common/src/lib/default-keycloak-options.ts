import { KeycloakInitOptions } from 'keycloak-js';

/** The default @see {@link KeycloakInitOptions} */
export const defaultKeycloakInitOptions: KeycloakInitOptions = {
  pkceMethod: 'S256',
  onLoad: 'check-sso',
  silentCheckSsoRedirectUri: window.location.origin + '/assets/silent-check-sso.html',
  enableLogging: false,
  checkLoginIframe: !(
    navigator.userAgent.toLowerCase().includes('firefox') && window.location.hostname === 'localhost'
  ), // prevent infinite redirect loop with Firefox when debugging on a local machine
};
