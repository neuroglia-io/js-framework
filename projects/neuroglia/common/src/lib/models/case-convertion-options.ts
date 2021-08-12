/**
 * Represents the options used to convert string to pascal case or camel case
 */
export interface CaseConvertionOptions {
  /** Keep dashes (-) characters */
  keepDashes: boolean;
  /** Capitalize after dashes (-) characters, if kept */
  capitalizeAfterDashes: boolean;
  /** Keep underscores (_) characters */
  keepUnderscores: boolean;
  /** Capitalize after underscores (_) characters, if kept */
  capitalizeAfterUnderscores: boolean;
  /** Keep dots (.) characters */
  keepDots: boolean;
  /** Capitalize after dots (.) characters, if kept */
  capitalizeAfterDots: boolean;
}

export const defaultConvertingOptions = {
  keepDashes: false,
  capitalizeAfterDashes: false,
  keepUnderscores: false,
  capitalizeAfterUnderscores: false,
  keepDots: true,
  capitalizeAfterDots: true
} as CaseConvertionOptions;