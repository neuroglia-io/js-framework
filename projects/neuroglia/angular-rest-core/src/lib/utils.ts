import { HttpErrorResponse } from '@angular/common/http';
import { ILogger } from '@neuroglia/logging';
import { Observable, of } from 'rxjs';
import { mergeMap, tap } from 'rxjs/operators';
import { HttpErrorInfo, HttpRequestInfo } from './models';
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
  httpRequestInfo: HttpRequestInfo
): Observable<T> {  
  return of(null).pipe(
    tap(() => logger.log(`${httpRequestInfo.info} | call.`, httpRequestInfo)),
    mergeMap(() => httpRequest),
    tap({
      next: () => logger.log(`${httpRequestInfo.info} | succeeded.`, httpRequestInfo),
      error: (err: HttpErrorResponse) => {
        errorObserver.next(new HttpErrorInfo({ request: httpRequestInfo, error: err }));
        logger.error(`${httpRequestInfo.info} | failed: ${err.message}`, httpRequestInfo);
      },
    })
  );
}
