/**
 * See https://www.angulararchitects.io/blog/micro-frontends-with-modern-angular-part-2-multi-version-and-multi-framework-solutions-with-angular-elements-and-web-components/
 */

import { NgZone } from '@angular/core';
import { Router, UrlMatchResult, UrlMatcher, UrlSegment } from '@angular/router';

const flatten = (url: UrlSegment[]): string => url.map((u) => u.path).join('/');

/**
 * A @see {@link UrlMatcher} factory used to match routes starting with the provided prefix
 * @param prefix The prefix to match the route with
 * @returns An @see {@link UrlMatcher}
 */
export function startsWith(prefix: string): UrlMatcher {
  return (url: UrlSegment[]): UrlMatchResult | null => {
    if (flatten(url).startsWith(prefix)) {
      return { consumed: url };
    }
    return null;
  };
}

/**
 * A @see {@link UrlMatcher} factory used to match routes starting with the provided suffix
 * @param suffix The suffix to match the route with
 * @returns An @see {@link UrlMatcher}
 */
export function endsWith(suffix: string): UrlMatcher {
  return (url: UrlSegment[]): UrlMatchResult | null => {
    if (flatten(url).endsWith(suffix)) {
      return { consumed: url };
    }
    return null;
  };
}

/** A fake ngZone api, just used to avoid writing the following in connectRouter:
 * !ngZone ? router.navigateByUrl(url) : ngZone.run(() => router.navigateByUrl(url))
 */
const ngZoneMock: Partial<NgZone> = {
  run: (callback: Function) => callback(),
};

/**
 * Connects the Angular @see {@link Router} to the current navigation events
 * @param router the Angular @see {@link Router}
 * @param useHash if the navigation uses hashtags
 * @param ngZone an optional instance of ngZone to run the navigation into
 */
export function connectRouter(router: Router, useHash = false, ngZone: Partial<NgZone> | undefined = undefined): void {
  let url: string;
  ngZone = ngZone || ngZoneMock;
  if (!useHash) {
    url = `${location.pathname.substring(1)}${location.search}`;
    ngZone.run!(() => router.navigateByUrl(url));
    window.addEventListener('popstate', () => {
      ngZone!.run!(() => router.navigateByUrl(url));
    });
  } else {
    url = `${location.hash.substring(1)}${location.search}`;
    ngZone.run!(() => router.navigateByUrl(url));
    window.addEventListener('hashchange', () => {
      ngZone!.run!(() => router.navigateByUrl(url));
    });
  }
}
