import { CombinedParams } from '@neuroglia/angular-data-source-queryable';
import { GraphQLQueryArguments } from './graphql-query-arguments';

/**
 * Builds a GraphQL query based on the provided context
 */
export type GraphQLQueryBuilder = <T = any>(
  target: string,
  args: GraphQLQueryArguments | null,
  fields: string[],
  combinedParams: CombinedParams<T>,
) => string;
