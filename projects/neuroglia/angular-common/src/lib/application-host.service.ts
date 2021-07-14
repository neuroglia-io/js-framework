import { isPlatformBrowser } from '@angular/common';
import { Inject, Injectable, PLATFORM_ID } from '@angular/core';

/**
 * Exposes the application root URL (e.g.: https://domain:port)
 */
@Injectable({
  providedIn: 'root'
})
export class ApplicationHostService {

  /** The application root URL */
  rootUrl: string;

  constructor(
    @Inject(PLATFORM_ID) private platformId: any
  ) {
    if (isPlatformBrowser(this.platformId)) {
      this.rootUrl = `${window.location.protocol}//${window.location.host}`;
    }
    else {
      this.rootUrl = '<<Erroneous ApplicationHostService in SSR>>';
    }
  }

}
