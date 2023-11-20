/**
 * Converts a string to kebab case (kebab-case)
 * @param source string The string to convert to kebab case
 * @returns string The kebab case string
 */
export const kebabCase = (source: string): string => {
  if (!source) return '';
  return source
    .replace(/([A-Z])/g, '-$1')
    .replace(/\s+/g, '-')
    .replace(/_+/g, '-')
    .replace(/-+/g, '-')
    .toLowerCase();
};
