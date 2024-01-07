import { InjectionToken } from '@angular/core';
import { GraphQLQueryBuilder, GraphQLVariablesMapper } from './models';

export const GRAPHQL_DATA_SOURCE_ENDPOINT = new InjectionToken<string>('graphql-data-source-endpoint');
export const GRAPHQL_DATA_SOURCE_TARGET = new InjectionToken<string>('graphql-data-source-target');
export const GRAPHQL_DATA_SOURCE_FIELDS = new InjectionToken<string[]>('graphql-data-source-fields');
export const GRAPHQL_DATA_SOURCE_ARGS = new InjectionToken<{ [arg: string]: string }>('graphql-data-source-args');
export const GRAPHQL_DATA_SOURCE_QUERY_BUILDER = new InjectionToken<GraphQLQueryBuilder>(
  'graphql-data-source-query-builder',
);
export const GRAPHQL_DATA_SOURCE_VARIABLES_MAPPER = new InjectionToken<GraphQLVariablesMapper>(
  'graphql-data-source-variables-mapper',
);
