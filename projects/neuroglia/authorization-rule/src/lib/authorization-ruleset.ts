import { AuthorizationRule } from './authorization-rule';

/**
 * Describes a set of authorization rules to test the user's token against
 */
export interface AuthorizationRuleset {
  // The strategy to apply, default `anyOf`
  strategy?: 'anyOf' | 'allOf';
  // The rules to test
  rules: AuthorizationRule[] | AuthorizationRuleset[] | Array<AuthorizationRule | AuthorizationRuleset>;
}
