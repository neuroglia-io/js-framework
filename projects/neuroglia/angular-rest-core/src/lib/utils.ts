import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { ILogger } from '@neuroglia/logging';
import { EMPTY, Observable, of } from 'rxjs';
import { catchError, expand, map, tap } from 'rxjs/operators';
import { HttpErrorInfo, HttpRequestInfo, ODataQueryOptions } from './models';
import { HttpErrorObserverService } from './http-error-observer.service';

/**
 * The default http options
 */
export const defaultHttpOptions = {
  headers: { 'Content-Type': 'application/json-patch+json' },
};

/**
 * A function used to log a piped http request
 * @param logger a ILogger instance
 * @param errorObserver the HttpErrorObserverService
 * @param httpRequest the observalbe http request
 * @param httpRequestInfo the http request info
 * @returns the provided observalbe http request
 */
export function logHttpRequest<T>(
  logger: ILogger,
  errorObserver: HttpErrorObserverService,
  httpRequest: Observable<T>,
  httpRequestInfo: HttpRequestInfo,
): Observable<T> {
  logger.log(`${httpRequestInfo.info} | call.`, httpRequestInfo);
  return httpRequest.pipe(
    tap({
      next: () => logger.log(`${httpRequestInfo.info} | succeeded.`, httpRequestInfo),
      error: (err: HttpErrorResponse) => {
        errorObserver.next(new HttpErrorInfo({ request: httpRequestInfo, error: err }));
        logger.error(`${httpRequestInfo.info} | failed: ${err.message}`, httpRequestInfo);
      },
    }),
  );
}

export interface outcome<T> {
  response: any;
  results: T[];
}

/**
 * Recursively fetches data for `sourceUrl`
 * @param logger The `ILogger` to use
 * @param errorObserver A `HttpErrorObserverService` instance
 * @param http A `HttpClient`
 * @param sourceUrl The URL to fetch the data from
 * @param pageLength The number of results expected per page
 * @param pageLengthParam The name of the query string parameter for the pager length
 * @param skipParam The name of the query string parameter for the pager index/skip
 * @param resultsSelector A function to select the results from the response
 * @param until A function that indicates when to terminate processing by returning true
 * @param computeSkip A function to compute the next index/skip parameter
 * @returns
 */
export function recursiveFetch<TResult>(
  logger: ILogger,
  errorObserver: HttpErrorObserverService,
  http: HttpClient,
  sourceUrl: string,
  pageLength: number = 50,
  pageLengthParam: string = '$top',
  skipParam: string = '$skip',
  resultsSelector: (response: any) => TResult[] = (response: any) => response as TResult[],
  until: (response: any, results: TResult[]) => boolean = (response: any, _: TResult[]): boolean =>
    (response || []).length < pageLength,
  computeSkip: (length: number, index: number) => number = (length: number, index: number) => length * index,
): Observable<TResult[]> {
  let skip = 0;
  let index = 0;
  return of(undefined).pipe(
    expand((outcome: outcome<TResult> | null | undefined) => {
      if (outcome !== undefined && (outcome === null || until(outcome.response, outcome.results as TResult[]))) {
        return EMPTY;
      }
      skip = computeSkip(pageLength, index);
      index++;
      const url = new URL(sourceUrl);
      const params = url.searchParams || new URLSearchParams();
      params.set(pageLengthParam, pageLength.toString());
      params.set(skipParam, skip.toString());
      url.search = params.toString();
      const httpRequestInfo: HttpRequestInfo = new HttpRequestInfo({
        clientServiceName: 'none',
        methodName: 'recursiveFetch',
        verb: 'get',
        url: url.toString(),
      });
      return logHttpRequest(logger, errorObserver, http.get<any>(url.toString()), httpRequestInfo).pipe(
        map(
          (response: any): outcome<TResult> =>
            ({
              response,
              results: [...(outcome?.results || []), ...resultsSelector(response)],
            }) as outcome<TResult>,
        ),
        catchError((err) => of(null as any)),
      );
    }),
    map((outcome: outcome<TResult>) => outcome?.results || []),
  );
}

export function recursiveODataServiceFetch<TResult>(
  service: any,
  getter: (queryOptions: ODataQueryOptions) => Observable<TResult[]>,
  queryOptions: ODataQueryOptions = {},
  isAPI: boolean = true,
): Observable<TResult[]> {
  queryOptions = queryOptions || {};
  const $top = queryOptions.$top || 50;
  let $skip = 0 - $top; // will be set to 0 at the first call of expand()
  const until = (response: any, results: TResult[]): boolean => {
    if (isAPI) {
      return (response || []).length < $top;
    }
    return results.length >= response['@odata.count'];
  };
  const resultsSelector = (response: any): TResult[] =>
    isAPI ? (response as TResult[]) : (response.value as TResult[]);
  return of(undefined).pipe(
    expand((outcome: outcome<TResult> | null | undefined) => {
      if (outcome !== undefined && (outcome === null || until(outcome.response, outcome.results as TResult[]))) {
        return EMPTY;
      }
      $skip += $top;
      const query = { ...queryOptions, $top, $skip, $count: true };
      return getter
        .bind(service)(query)
        .pipe(
          map(
            (response: any): outcome<TResult> =>
              ({
                response,
                results: [...(outcome?.results || []), ...resultsSelector(response)],
              }) as outcome<TResult>,
          ),
          catchError((err) => of(null as any)),
        );
    }),
    map((outcome: outcome<TResult>) => outcome?.results || []),
  );
}
