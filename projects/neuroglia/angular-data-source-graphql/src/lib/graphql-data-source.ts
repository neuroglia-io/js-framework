import { Observable, of } from 'rxjs';
import buildQuery from 'odata-query';
import { HttpRequestInfo, ODataQueryResultDto, logHttpRequest } from '@neuroglia/angular-rest-core';
import { CombinedParams, QueryableDataSource } from '@neuroglia/angular-data-source-queryable';
import { Injectable, inject } from '@angular/core';
import {
  GRAPHQL_DATA_SOURCE_ARGS,
  GRAPHQL_DATA_SOURCE_ENDPOINT,
  GRAPHQL_DATA_SOURCE_FIELDS,
  GRAPHQL_DATA_SOURCE_QUERY_BUILDER,
  GRAPHQL_DATA_SOURCE_TARGET,
  GRAPHQL_DATA_SOURCE_VARIABLES_MAPPER,
} from './injection-tokens';
import { GraphQLQueryArguments, GraphQLQueryBuilder, GraphQLVariablesMapper } from './models';

/**
 * A data source used to handle GraphQL interactions
 */
@Injectable()
export class GraphQLDataSource<T = any> extends QueryableDataSource<T> {
  protected endpoint: string = inject(GRAPHQL_DATA_SOURCE_ENDPOINT);
  protected target: string = inject(GRAPHQL_DATA_SOURCE_TARGET);
  protected fields: string[] = inject(GRAPHQL_DATA_SOURCE_FIELDS);
  protected args: GraphQLQueryArguments | null = inject(GRAPHQL_DATA_SOURCE_ARGS, { optional: true });
  protected variablesMapper: GraphQLVariablesMapper | null = inject(GRAPHQL_DATA_SOURCE_VARIABLES_MAPPER, {
    optional: true,
  });
  protected queryBuilder: GraphQLQueryBuilder | null = inject(GRAPHQL_DATA_SOURCE_QUERY_BUILDER, { optional: true });

  constructor() {
    super();
    this.loggerName = `GraphQLDataSource|${this.endpoint}`;
    this.logger = this.namedLoggingServiceFactory.create(this.loggerName);
  }

  /**
   * Builds the query
   * @param combinedParams
   */
  protected buildQuery(combinedParams: CombinedParams<T>): Observable<string> {
    if (this.queryBuilder) {
      return this.queryBuilder(this.target, this.args, this.fields, combinedParams, this.variablesMapper);
    }
    const operationName = 'QueryDataSource';
    const select = combinedParams[0]?.select;
    const expand = combinedParams[1]?.expand;
    let selectAndExpand: string[] = [];
    if (select) {
      if (!Array.isArray(select)) {
        selectAndExpand.push(select as string);
      } else if (select.length) {
        selectAndExpand = [...selectAndExpand, ...(select as string[])];
      }
    }
    if (expand) {
      if (!Array.isArray(expand)) {
        selectAndExpand.push(expand as string);
      } else if (expand.length) {
        selectAndExpand = [...selectAndExpand, ...(expand as string[])];
      }
    }
    const fields = (!selectAndExpand.length ? this.fields : selectAndExpand).join('\n');
    let operationArgs = '($options: QueryOptionsInput)';
    let targetArgs = '(options: $options)';
    if (this.args && Object.keys(this.args).length) {
      operationArgs = `(${Object.entries(this.args).reduce(
        (acc, [name, type], idx) => acc + `${idx !== 0 ? ',' : ''}$${name}: ${type}`,
        '',
      )})`;
      targetArgs = `(${Object.keys(this.args).reduce(
        (acc, name, idx) => acc + `${idx !== 0 ? ',' : ''}${name}: $${name}`,
        '',
      )})`;
    }
    const query = `query ${operationName} ${operationArgs} {
      ${this.target} ${targetArgs} {
        ${fields}
      }
    }`;
    const options = Object.fromEntries(
      combinedParams
        .flatMap((param) => (param ? Object.entries(param) : []))
        .filter(([key, value]) => key != 'select' && (!Array.isArray(value) ? value != null : !!value?.length)),
    );
    const variables = this.variablesMapper ? this.variablesMapper(this.args, combinedParams) : { options };
    return of(JSON.stringify({ operationName, query, variables }));
  }

  /**
   * Queries the GraphQL endpoint
   * @param query
   */
  protected gatherData(query: string): Observable<ODataQueryResultDto<T>> {
    const url: string = `${this.endpoint}`;
    const httpRequestInfo: HttpRequestInfo = new HttpRequestInfo({
      clientServiceName: this.loggerName,
      methodName: 'gatherData',
      verb: 'post',
      url,
    });
    return logHttpRequest(
      this.logger,
      this.errorObserver,
      this.http.post<ODataQueryResultDto<T>>(url, JSON.parse(query)),
      httpRequestInfo,
    );
  }
}
