import { CaseConvertionOptions, defaultConvertingOptions } from './models';

/**
 * Converts a string to pascal case (PascalCase)
 * @param source string The string to convert to pascal case
 * @param convertionOptions CaseConvertionOptions Defaults: keepDashes: false, capitalizeAfterDashes: false, keepUnderscores: false, capitalizeAfterUnderscores: false, keepDots: true, capitalizeAfterDots: true
 * @returns string The pascal case string
 */
export const pascalCase = (
  source: string,
  convertionOptions: CaseConvertionOptions = defaultConvertingOptions,
): string => {
  if (!source) return '';
  let delimiter = '';
  if (!convertionOptions.keepDashes) {
    source = source.replace(/-+/g, ' ');
  } else if (convertionOptions.capitalizeAfterDashes) {
    delimiter += '-';
  }
  if (!convertionOptions.keepUnderscores) {
    source = source.replace(/_+/g, ' ');
  } else if (convertionOptions.capitalizeAfterUnderscores) {
    delimiter += '_';
  }
  if (!convertionOptions.keepDots) {
    source = source.replace(/\.+/g, ' ');
  } else if (convertionOptions.capitalizeAfterDots) {
    delimiter += '\\.';
  }
  if (delimiter) {
    source = source.replace(
      new RegExp('([' + delimiter + '])+(.)(\\w+)', 'g'),
      ($1, $2, $3, $4) => `${$2}${$3.toUpperCase()}${$4.toLowerCase()}`,
    );
  }
  return source
    .replace(/\s+(.)(\w+)/g, ($1, $2, $3) => `${$2.toUpperCase()}${$3.toLowerCase()}`)
    .replace(/\s/g, '')
    .replace(/\w/, (s) => s.toUpperCase());
};
