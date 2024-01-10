import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { NamedLoggingServiceFactory } from '@neuroglia/angular-logging';
import { ColumnDefinition } from '@neuroglia/angular-ngrx-component-store-queryable-table';
import { HttpErrorObserverService, HttpRequestInfo, logHttpRequest } from '@neuroglia/angular-rest-core';
import { ILogger } from '@neuroglia/logging';
import {
  buildSchema,
  getNamedType,
  getNullableType,
  getIntrospectionQuery,
  Source,
  GraphQLSchema,
  GraphQLList,
  GraphQLEnumType,
  GraphQLScalarType,
  GraphQLObjectType,
  IntrospectionQuery,
  buildClientSchema,
} from 'graphql';
import { Observable, map, of } from 'rxjs';
import { FieldInfo } from './models';
import { isSet } from '@neuroglia/common';

/** Guards the provided type is 'GraphQLObjectType' */
function isObjectType(type: any | null | undefined): type is GraphQLObjectType {
  return type instanceof GraphQLObjectType;
}

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
  protected metadata: GraphQLSchema | null;

  /**
   * Gathers the schema from the provided URL
   * @param schemaUrl
   * @returns
   */
  getMetadataFromSchema(schemaUrl: string): Observable<GraphQLSchema> {
    const httpRequestInfo: HttpRequestInfo = new HttpRequestInfo({
      clientServiceName: 'GraphQLMetadataService',
      methodName: schemaUrl,
      verb: 'get',
      url: schemaUrl,
    });
    return logHttpRequest(this.logger, this.errorObserver, this.http.get<string>(schemaUrl), httpRequestInfo).pipe(
      map((schemaDefinition: string) => {
        this.metadata = buildSchema(new Source(schemaDefinition));
        return this.metadata;
      }),
    );
  }
  /**
   * Builds the schema from the provided URL using introspection
   * @param serviceEndpoint
   * @returns
   */
  getMetadataFromIntrospection(serviceEndpoint: string): Observable<GraphQLSchema> {
    const introspectionQuery = getIntrospectionQuery();
    const httpRequestInfo: HttpRequestInfo = new HttpRequestInfo({
      clientServiceName: 'GraphQLMetadataService',
      methodName: 'introspection',
      verb: 'post',
      url: serviceEndpoint,
    });
    return logHttpRequest(
      this.logger,
      this.errorObserver,
      this.http.post<{ data: IntrospectionQuery }>(serviceEndpoint, { query: introspectionQuery }),
      httpRequestInfo,
    ).pipe(
      map((introspectionResponse: { data: IntrospectionQuery }) => {
        this.metadata = buildClientSchema(introspectionResponse.data);
        return this.metadata;
      }),
    );
  }

  /**
   * Gets the column definitions for the returned type of the provided query
   * @param target The query to gather the definitions from
   * @param subObject A nested object to gather the fields of, e.g.: 'pager.results'
   * @returns
   */
  getColumnDefinitions(target: string, subField: string = ''): Observable<ColumnDefinition[]> {
    return of(
      this.getQueryFieldsInfo(target, subField, true).map(
        ({ name, type, isNullable, isNavigationProperty, isCollection, isEnum, enumValues }, index) => {
          const columnDefinition: ColumnDefinition = {
            name,
            type,
            position: index + 1,
            isNullable,
            isNavigationProperty,
            isCollection,
            isEnum,
            isVisible: !isNavigationProperty && !isCollection,
            isSortable: !isNavigationProperty && !isCollection,
            isFilterable: !isNavigationProperty && !isCollection,
          };
          if (columnDefinition.isEnum) {
            columnDefinition.type = 'String';
            columnDefinition.enumValues = enumValues;
          }
          return columnDefinition;
        },
      ),
    );
  }

  getFieldsQuery(target: string, subField: string = '', maxDepth: number = 5): Observable<string> {
    return of(this.getFieldsInfoQuery(this.getQueryFieldsInfo(target, subField, false, maxDepth)));
  }

  getArgsQuery(target: string): Observable<string> {
    if (!this.metadata) {
      throw new Error(
        `Schema must be initialized first with 'getMetadataFromSchema' or 'getMetadataFromIntrospection'`,
      );
    }
    const Query = this.metadata.getQueryType();
    if (!isSet(Query)) {
      throw new Error(`The current schema does't expose any Query root object.`);
    }
    const queryType = this.metadata.getType(Query.name);
    if (!isObjectType(queryType)) {
      throw new Error(`The Query root object does't seem to be of type 'GraphQLObjectType'.`);
    }
    const queries = queryType.getFields();
    const targetQuery = queries[target];
    if (!isSet(targetQuery)) {
      throw new Error(`The target query '${target}' cannot be found.`);
    }

    return of('');
  }

  protected getFieldsInfoQuery(fieldsInfo: Array<FieldInfo>): string {
    return fieldsInfo.reduce((acc, info) => {
      acc += info.name;
      if (!info.fields.length) {
        acc += '\n';
        return acc;
      }
      acc += ' {\n';
      acc += this.getFieldsInfoQuery(info.fields);
      acc += '}\n';
      return acc;
    }, '');
  }

  protected getQueryFieldsInfo(
    target: string,
    subField: string = '',
    includeEmptyObjects: boolean = false,
    maxDepth: number = 5,
  ): Array<FieldInfo> {
    if (!this.metadata) {
      throw new Error(
        `Schema must be initialized first with 'getMetadataFromSchema' or 'getMetadataFromIntrospection'`,
      );
    }
    const Query = this.metadata.getQueryType();
    if (!isSet(Query)) {
      throw new Error(`The current schema does't expose any Query root object.`);
    }
    const queryType = this.metadata.getType(Query.name);
    if (!isObjectType(queryType)) {
      throw new Error(`The Query root object does't seem to be of type 'GraphQLObjectType'.`);
    }
    const queries = queryType.getFields();
    const targetQuery = queries[target];
    if (!isSet(targetQuery)) {
      throw new Error(`The target query '${target}' cannot be found.`);
    }
    const returnType = getNamedType(targetQuery.type);
    if (!isObjectType(returnType)) {
      throw new Error(`The return type of the query '${target}' is not of type 'GraphQLObjectType'.`);
    }
    const subFields = subField.split('.');
    const depth = subFields.length + maxDepth;
    let fieldsInfo: Array<FieldInfo> | undefined = this.getFieldsInfo(returnType, includeEmptyObjects, depth);
    if (subField.length) {
      for (let field of subFields) {
        fieldsInfo = fieldsInfo.find((info) => info.name === field)?.fields;
        if (!isSet(fieldsInfo)) {
          throw new Error(`Impossible to find info for subField '${subField}'`);
        }
      }
    }
    return fieldsInfo;
  }

  /**
   * Gathers the @see {@link FieldInfo}s of the provided @see {@link GraphQLObjectType}
   * @param targetType
   * @param includeEmptyObjects Defines if an object should be kept even if its fields haven't been crawled or don't contrain scalar values, default false
   * Used to prevent queries such as:
   * `myObject {
   * }`
   * @param maxDepth
   * @param currentDepth
   */
  protected getFieldsInfo(
    targetType: GraphQLObjectType,
    includeEmptyObjects: boolean = false,
    maxDepth: number = 1,
    currentDepth: number = 1,
  ): Array<FieldInfo> {
    if (!isObjectType(targetType)) {
      throw new Error(`Expected target type to be a 'GraphQLObjectType'`);
    }
    return Object.values(targetType.getFields())
      .filter((field) => !field.args?.length)
      .map((field) => {
        const { name, type } = field;
        const namedType = getNamedType(type);
        const info: FieldInfo = {
          name,
          type: namedType.name,
          isNullable: field.type === getNullableType(field.type),
          isNavigationProperty: !(namedType instanceof GraphQLScalarType || namedType instanceof GraphQLEnumType),
          isCollection: field.type instanceof GraphQLList,
          isEnum: namedType instanceof GraphQLEnumType,
          fields: [],
          enumValues: (namedType as GraphQLEnumType).getValues
            ? (namedType as GraphQLEnumType).getValues().map((member) => member.value)
            : [],
        };
        if (info.isNavigationProperty && maxDepth > currentDepth && isObjectType(namedType)) {
          info.fields = this.getFieldsInfo(namedType, includeEmptyObjects, maxDepth, currentDepth + 1);
        }
        return info;
      })
      .filter((info) => includeEmptyObjects || !info.isNavigationProperty || !!info.fields.length);
  }
}
