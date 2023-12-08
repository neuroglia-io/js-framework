import { StaticProvider } from '@angular/core';

/**
 * Represents an angular component configuration
 */
export type AngularComponentConfig = {
  component: any;
  providers: Array<StaticProvider>;
};
