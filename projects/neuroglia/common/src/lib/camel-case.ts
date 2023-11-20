import { CaseConvertionOptions, defaultConvertingOptions } from './models';
import { pascalCase } from './pascal-case';

/**
 * Converts a string to camel case (camelCase)
 * @param source string The string to convert to camel case
 * @param convertionOptions CaseConvertionOptions Defaults: keepDashes: false, capitalizeAfterDashes: false, keepUnderscores: false, capitalizeAfterUnderscores: false, keepDots: true, capitalizeAfterDots: true
 * @returns string The camel case string
 */
export const camelCase = (
  source: string,
  convertionOptions: CaseConvertionOptions = defaultConvertingOptions,
): string => {
  if (!source) return '';
  return pascalCase(source, convertionOptions).replace(/\w/, (s) => s.toLowerCase());
};
