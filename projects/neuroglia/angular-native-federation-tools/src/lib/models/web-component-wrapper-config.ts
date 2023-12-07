import { LoadRemoteModuleOptions } from '@angular-architects/native-federation';
import { WebComponentConfig } from './web-component-config';

/**
 * The congfiguration passed to the web component wrapper
 */
export type WebComponentWrapperConfig = LoadRemoteModuleOptions & WebComponentConfig;
