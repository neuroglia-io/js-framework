import { UserManagerSettings, WebStorageStateStore, StateStore, ResponseValidatorCtor, MetadataServiceCtor, OidcMetadata } from 'oidc-client';

/**
 * Abstract class used to provide an injectable 'UserManagerSettings' interface, see https://angular.io/guide/dependency-injection-in-action#class-interface
 */
export abstract class OidcOptions implements UserManagerSettings {
  /** The URL of the OIDC/OAuth2 provider */
  authority?: string;
  metadataUrl?: string;
  /** Provide metadata when authority server does not allow CORS on the metadata endpoint */
  metadata?: Partial<OidcMetadata>;
  /** Provide signingKeys when authority server does not allow CORS on the jwks uri */
  signingKeys?: any[];
  /** Your client application's identifier as registered with the OIDC/OAuth2 */
  client_id?: string;
  client_secret?: string;
  /** The type of response desired from the OIDC/OAuth2 provider (default: 'id_token') */
  response_type?: string;
  response_mode?: string;
  /** The scope being requested from the OIDC/OAuth2 provider (default: 'openid') */
  scope?: string;
  /** The redirect URI of your client application to receive a response from the OIDC/OAuth2 provider */
  redirect_uri?: string;
  /** The OIDC/OAuth2 post-logout redirect URI */
  post_logout_redirect_uri?: string;
  /** The OIDC/OAuth2 post-logout redirect URI when using popup */
  popup_post_logout_redirect_uri?: string;
  prompt?: string;
  display?: string;
  max_age?: number;
  ui_locales?: string;
  acr_values?: string;
  /** Should OIDC protocol claims be removed from profile (default: true) */
  filterProtocolClaims?: boolean;
  /** Flag to control if additional identity data is loaded from the user info endpoint in order to populate the user's profile (default: true) */
  loadUserInfo?: boolean;
  /** Number (in seconds) indicating the age of state entries in storage for authorize requests that are considered abandoned and thus can be cleaned up (default: 300) */
  staleStateAge?: number;
  /** The window of time (in seconds) to allow the current time to deviate when validating id_token's iat, nbf, and exp values (default: 300) */
  clockSkew?: number;
  stateStore?: StateStore;
  userInfoJwtIssuer?: 'ANY' | 'OP' | string;
  ResponseValidatorCtor?: ResponseValidatorCtor;
  MetadataServiceCtor?: MetadataServiceCtor;
  /** An object containing additional query string parameters to be including in the authorization request */
  extraQueryParams?: Record<string, any>;
  /** The URL for the page containing the call to signinPopupCallback to handle the callback from the OIDC/OAuth2 */
  popup_redirect_uri?: string;
  /** The features parameter to window.open for the popup signin window.
   *  default: 'location=no,toolbar=no,width=500,height=500,left=100,top=100'
   */
  popupWindowFeatures?: string;
  /** The target parameter to window.open for the popup signin window (default: '_blank') */
  popupWindowTarget?: any;
  /** The URL for the page containing the code handling the silent renew */
  silent_redirect_uri?: any;
  /** Number of milliseconds to wait for the silent renew to return before assuming it has failed or timed out (default: 10000) */
  silentRequestTimeout?: any;
  /** Flag to indicate if there should be an automatic attempt to renew the access token prior to its expiration (default: false) */
  automaticSilentRenew?: boolean;
  validateSubOnSilentRenew?: boolean;
  /** Flag to control if id_token is included as id_token_hint in silent renew calls (default: true) */
  includeIdTokenInSilentRenew?: boolean;
  /** Will raise events for when user has performed a signout at the OP (default: true) */
  monitorSession?: boolean;
  /** Interval, in ms, to check the user's session (default: 2000) */
  checkSessionInterval?: number;
  query_status_response_type?: string;
  stopCheckSessionOnError?: boolean;
  /** Will invoke the revocation endpoint on signout if there is an access token for the user (default: false) */
  revokeAccessTokenOnSignout?: boolean;
  /** The number of seconds before an access token is to expire to raise the accessTokenExpiring event (default: 60) */
  accessTokenExpiringNotificationTime?: number;
  redirectNavigator?: any;
  popupNavigator?: any;
  iframeNavigator?: any;
  /** Storage object used to persist User for currently authenticated user (default: session storage) */
  userStore?: WebStorageStateStore;
}
