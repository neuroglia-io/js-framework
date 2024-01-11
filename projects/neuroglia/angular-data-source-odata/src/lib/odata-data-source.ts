import { Observable, of } from 'rxjs';
import buildQuery from 'odata-query';
import { HttpRequestInfo, ODataQueryResultDto, logHttpRequest } from '@neuroglia/angular-rest-core';
import { CombinedParams, QueryableDataSource } from '@neuroglia/angular-data-source-queryable';
import { Injectable, inject } from '@angular/core';
import { ODATA_DATA_SOURCE_ENDPOINT } from './odata-data-source-endpoint-token';

/**
 * A data source used to handle OData interactions
 */
@Injectable()
export class ODataDataSource<T = any> extends QueryableDataSource<T> {
  protected endpoint: string = inject(ODATA_DATA_SOURCE_ENDPOINT);

  constructor() {
    super();
    this.loggerName = `ODataDataSource|${this.endpoint}`;
    this.logger = this.namedLoggingServiceFactory.create(this.loggerName);
  }

  /**
   * Builds the query
   * @param combinedParams
   */
  protected buildQuery(combinedParams: CombinedParams<T>): Observable<string> {
    // remove empty parameters & build OData query
    return of(
      buildQuery(
        Object.fromEntries(
          combinedParams
            .flatMap((param) => (param ? Object.entries(param) : []))
            .filter(([, value]) => (!Array.isArray(value) ? value != null : !!value?.length)),
        ),
      ),
    );
  }

  /**
   * Queries the OData endpoint
   * @param query
   */
  protected gatherData(query: string): Observable<ODataQueryResultDto<T>> {
    const url: string = `${this.endpoint}${!this.endpoint.includes('?') ? query : query.replace('?', '&')}`;
    const httpRequestInfo: HttpRequestInfo = new HttpRequestInfo({
      clientServiceName: this.loggerName,
      methodName: 'gatherData',
      verb: 'get',
      url,
    });
    return logHttpRequest(this.logger, this.errorObserver, this.http.get<ODataQueryResultDto<T>>(url), httpRequestInfo);
  }
}
