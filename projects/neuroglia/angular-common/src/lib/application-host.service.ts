import { isPlatformBrowser } from '@angular/common';
import { Injectable, PLATFORM_ID, inject } from '@angular/core';

/**
 * Exposes the application root URL (e.g.: https://domain:port)
 */
@Injectable({
  providedIn: 'root',
})
export class ApplicationHostService {
  /** The application root URL */
  rootUrl: string;

  /** The plateform ID */
  platformId: object = inject(PLATFORM_ID);

  constructor() {
    if (isPlatformBrowser(this.platformId)) {
      this.rootUrl = `${window.location.protocol}//${window.location.host}`;
    } else {
      this.rootUrl = '<<Erroneous ApplicationHostService in SSR>>';
    }
  }
}
