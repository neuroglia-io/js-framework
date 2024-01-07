import { CombinedParams } from '@neuroglia/angular-data-source-queryable';
import { GraphQLQueryArguments } from './graphql-query-arguments';

/**
 * Builds a GraphQL query based on the provided context
 */
export type GraphQLVariablesMapper = <T = any>(
  args: GraphQLQueryArguments | null,
  combinedParams: CombinedParams<T>,
) => any;
