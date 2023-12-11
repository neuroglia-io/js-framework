export type AppType = 'shell' | 'microfrontend';

/**
 * The options used to boostrap a sandalone component based federated application
 */
export type BootstrapFederatedApplicationOptions = {
  /** The type of federated application */
  appType: AppType;
  /** If the global instance of @see {@link NgZone} should be shared or not */
  enableNgZoneSharing?: boolean;
};
