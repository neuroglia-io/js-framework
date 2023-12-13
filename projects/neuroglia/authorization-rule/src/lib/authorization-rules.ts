import { AuthorizationRule } from './authorization-rule';
import { AuthorizationRuleset } from './authorization-ruleset';

export type AuthorizationRules = Array<AuthorizationRule | AuthorizationRuleset>;
