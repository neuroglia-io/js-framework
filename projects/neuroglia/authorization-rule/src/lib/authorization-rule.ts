/**
 * Describes an authorization rule to test the user's token against
 */
export interface AuthorizationRule {
  // The token path to access the value, e.g. `realm_access.roles`
  path: string;
  // The operation, equals for strict equality, contains for partial match, default `contains`
  operation?: 'equals' | 'contains';
  // The value(s) to test against
  value: string | string[];
}
