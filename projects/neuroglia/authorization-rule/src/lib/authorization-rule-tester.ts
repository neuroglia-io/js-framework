import { get } from '@neuroglia/common';
import { KeycloakTokenParsed } from 'keycloak-js';
import { AuthorizationRule } from './authorization-rule';
import { AuthorizationRuleset } from './authorization-ruleset';
import { AuthorizationRules } from './authorization-rules';

const isRuleset = (
  authorization: AuthorizationRule | AuthorizationRuleset | AuthorizationRules,
): authorization is AuthorizationRuleset => !!(authorization as AuthorizationRuleset).rules;
const isRule = (
  authorization: AuthorizationRule | AuthorizationRuleset | AuthorizationRules,
): authorization is AuthorizationRule =>
  !!(authorization as AuthorizationRule).path && !!(authorization as AuthorizationRule).value;
const areRules = (
  authorizations: AuthorizationRule | AuthorizationRuleset | AuthorizationRules,
): authorizations is AuthorizationRules =>
  Array.isArray(authorizations) && authorizations.every((rule) => isRuleset(rule) || isRule(rule) || areRules(rule));

const ruleTester =
  (token: KeycloakTokenParsed) =>
  (rule: AuthorizationRule): boolean => {
    const tokenValue = get(token, rule.path);
    if (!tokenValue) return false;
    if (!Array.isArray(tokenValue)) {
      if (rule.operation === 'equals') {
        if (!Array.isArray(rule.value)) {
          return tokenValue === rule.value;
        }
        return rule.value.includes(tokenValue);
      }
      if (!Array.isArray(rule.value)) {
        return tokenValue.includes(rule.value);
      }
      return rule.value.some((rValue) => tokenValue.includes(rValue));
    }
    if (rule.operation === 'equals') {
      if (!Array.isArray(rule.value)) {
        return tokenValue.includes(rule.value);
      }
      return tokenValue.some((tValue) => rule.value.includes(tValue));
    }
    if (!Array.isArray(rule.value)) {
      return tokenValue.some((tValue) => tValue.includes(rule.value));
    }
    return tokenValue.some((tValue) => (rule.value as string[]).some((rValue) => tValue.includes(rValue)));
  };

const mixedTester =
  (token: KeycloakTokenParsed) => (rule: AuthorizationRuleset | AuthorizationRule | AuthorizationRules) => {
    if (isRuleset(rule)) return rulesetTester(token)(rule);
    if (isRule(rule)) return ruleTester(token)(rule);
    if (areRules(rule)) {
      return rulesetTester(token)({ rules: rule });
    }
    return false;
  };

const rulesetTester =
  (token: KeycloakTokenParsed) =>
  (ruleset: AuthorizationRuleset): boolean => {
    if (ruleset.strategy === 'allOf') return ruleset.rules.every(mixedTester(token));
    return ruleset.rules.some(mixedTester(token));
  };

/**
 * Tests authorization rules against the user's token
 * @param token
 * @param rules
 * @returns
 */
export function validateAuthorizations(
  token: KeycloakTokenParsed,
  authorizations: AuthorizationRule | AuthorizationRuleset | AuthorizationRules | null | undefined,
): boolean {
  if (!token) return false;
  if (!authorizations) return true;
  if (!isRule(authorizations) && !isRuleset(authorizations) && !areRules(authorizations)) {
    throw new Error(`Invalid authorizations to test against: ${JSON.stringify(authorizations, null, 4)}`);
  }
  const rules = isRule(authorizations)
    ? [authorizations]
    : (authorizations as AuthorizationRuleset).rules || (authorizations as AuthorizationRules);
  if (!rules?.length) return true;
  const strategy = (authorizations as AuthorizationRuleset).strategy || 'anyOf';
  return rulesetTester(token)({ strategy, rules });
}
