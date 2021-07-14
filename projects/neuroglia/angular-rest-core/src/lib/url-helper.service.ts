import { Injectable } from '@angular/core';

/**
 * Provides URL manipulation helpers
 */
@Injectable({
  providedIn: 'root'
})
export class UrlHelperService {

  /**
   * create query string from properties of the specified object
   * @param obj plain object
   */
  objectToQueryString(obj: any) {
    if (!obj)
      return '';
    const urlParams = new URLSearchParams();
    /*for (let p in obj) {
      if (obj[p] !== undefined && obj[p] !== null && obj[p] !== '')
        urlParams.set(p, obj[p].toString());
    }*/
    Object.keys(obj).forEach((k) => {
      const val = obj[k];
      if (typeof val !== typeof undefined
        && typeof val !== typeof function () { }
        && val !== null
        && val !== ''
      ) {
        urlParams.set(k, obj[k].toString());
      }
    });
    return urlParams.toString();
  }

  /**
   * adds query strings to url with proper separators
   * @param baseUrl url to add query string to
   * @param queryStrings query strings
   */
  addQueryStringsToBaseUrl(baseUrl: string, ...queryStrings: string[]) {
    const totalQueryString = queryStrings.filter(q => !!q).join('&');
    if (totalQueryString) {
      return baseUrl + '?' + totalQueryString;
    }
    return baseUrl;
  }

}
