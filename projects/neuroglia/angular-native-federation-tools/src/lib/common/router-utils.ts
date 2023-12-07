/**
 * See https://www.angulararchitects.io/blog/micro-frontends-with-modern-angular-part-2-multi-version-and-multi-framework-solutions-with-angular-elements-and-web-components/
 */

import { Router, UrlMatchResult, UrlMatcher, UrlSegment } from '@angular/router';

const flatten = (url: UrlSegment[]): string => url.map((u) => u.path).join('/');

/**
 * A {@link UrlMatcher} factory used to match routes starting with the provided prefix
 * @param prefix The prefix to match the route with
 * @returns An {@link UrlMatcher}
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
 * A {@link UrlMatcher} factory used to match routes starting with the provided suffix
 * @param suffix The suffix to match the route with
 * @returns An {@link UrlMatcher}
 */
export function endsWith(suffix: string): UrlMatcher {
  return (url: UrlSegment[]): UrlMatchResult | null => {
    if (flatten(url).endsWith(suffix)) {
      return { consumed: url };
    }
    return null;
  };
}

/**
 * Connects the Angular {@see Router} to the current navigation events
 * @param router the Angular {@see Router}
 * @param useHash if the navigation uses hashtags
 */
export function connectRouter(router: Router, useHash = false): void {
  let url: string;
  if (!useHash) {
    url = `${location.pathname.substring(1)}${location.search}`;
    router.navigateByUrl(url);
    window.addEventListener('popstate', () => {
      router.navigateByUrl(url);
    });
  } else {
    url = `${location.hash.substring(1)}${location.search}`;
    router.navigateByUrl(url);
    window.addEventListener('hashchange', () => {
      router.navigateByUrl(url);
    });
  }
}
