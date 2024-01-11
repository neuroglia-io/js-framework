import { CombinedParams } from '@neuroglia/angular-data-source-queryable';
import { GraphQLQueryArguments } from './graphql-query-arguments';
import { Observable } from 'rxjs';
import { GraphQLVariablesMapper } from './graphql-variables-mapper';

/**
 * Builds a GraphQL query based on the provided context
 */
export type GraphQLQueryBuilder = <T = any>(
  target: string,
  args: GraphQLQueryArguments | null,
  fields: string[],
  combinedParams: CombinedParams<T>,
  variablesMapper: GraphQLVariablesMapper | null,
) => Observable<string>;
