import { AuthorizationRule, AuthorizationRules, AuthorizationRuleset } from '@neuroglia/authorization-rule';

/**
 * Holds the information about a table's column
 */
export interface ColumnDefinition {
  /** Defines the column name identifier */
  name: string;
  /** The type of the column, by default a string type of the data source */
  type?: string;
  /** The column position, default the index in the ColumnDefinition[] array will be used */
  position?: number;
  /** Defines whenever the column should be displayed, default true */
  isVisible?: boolean;
  /** Defines whenever the column can be sorted, default false */
  isSortable?: boolean;
  /** Defines whenever the column can be filtered, default false */
  isFilterable?: boolean;
  /** Defines if the column should be sticked */
  sticky?: '' | 'start' | 'end';
  /** Defines the headler cell expression */
  headerExpression?: string;
  /** Defines the cell expression, typically used for collection or nested properties */
  expression?: string;
  /** Defines the sorting expression, typically used for collection or nested properties */
  sortExpression?: string;
  /** Defines the filter expression, typically used for collection or nested properties */
  filterExpression?: string;
  /** Defines if the column represents an enum */
  isEnum?: boolean;
  /** Defines the real type of the enum */
  enumType?: string;
  /** Defines the possible enum values */
  enumValues?: string[];
  /** Defines if the column is a collection */
  isCollection?: boolean;
  /** Defines if the column is a navigation property */
  isNavigationProperty?: boolean;
  /** Defines if the column is nullable */
  isNullable?: boolean;
  /** The authorization rules used to restrict the column's visibility, if any */
  authorizations?: AuthorizationRule | AuthorizationRuleset | AuthorizationRules | null;
  /** Extra data that could be used by specific templates */
  metadata?: any;
}
