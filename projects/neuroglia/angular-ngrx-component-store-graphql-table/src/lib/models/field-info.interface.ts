/**
 * Represents the information relative to an object field
 */
export interface FieldInfo {
  /** The name of the field */
  name: string;
  /** The type of the field */
  type: string;
  /** True if the field is nullable */
  isNullable: boolean;
  /** True if the field is an object type */
  isNavigationProperty: boolean;
  /** True if the field is a list type */
  isCollection: boolean;
  /** True if the field is a enum type */
  isEnum: boolean;
  /** The list of sub fields, if any */
  fields: Array<FieldInfo>;
  /** The list of possible enum values, if any */
  enumValues: Array<string>;
}
