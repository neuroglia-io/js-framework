import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { NamedLoggingServiceFactory } from '@neuroglia/angular-logging';
import { HttpErrorObserverService, HttpRequestInfo, logHttpRequest } from '@neuroglia/angular-rest-core';
import { ILogger } from '@neuroglia/logging';
import { GraphQLSchema, Source, buildSchema } from 'graphql';
import { Observable, map } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class GraphQLMetadataService {
  /** The @see {@link HttpErrorObserverService} */
  protected readonly errorObserver = inject(HttpErrorObserverService);
  /** The @see {@link NamedLoggingServiceFactory} */
  protected readonly namedLoggingServiceFactory = inject(NamedLoggingServiceFactory);
  /** The @see {@link HttpClient} */
  protected readonly http = inject(HttpClient);
  /** The logger instance */
  protected readonly logger: ILogger = this.namedLoggingServiceFactory.create('GraphQLMetadataService');
  /** The GraphQL schema */
  protected schema: GraphQLSchema | null;

  /**
   * Gathers the schema from the provided service
   * @param schemaUrl
   * @returns
   */
  getMetadata(schemaUrl: string): Observable<GraphQLSchema> {
    const httpRequestInfo: HttpRequestInfo = new HttpRequestInfo({
      clientServiceName: 'ODataMetadataService',
      methodName: 'metadata$',
      verb: 'get',
      url: schemaUrl,
    });
    return logHttpRequest(this.logger, this.errorObserver, this.http.get<string>(schemaUrl), httpRequestInfo).pipe(
      map((schemaDefinition: string) => {
        this.schema = buildSchema(new Source(schemaDefinition));
        return this.schema;
      }),
    );
  }
}
