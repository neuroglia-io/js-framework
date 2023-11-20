/**
 * Converts a string to snake case (snake_case)
 * @param source string The string to convert to snake case
 * @returns string The snake case string
 */
export const snakeCase = (source: string): string => {
  if (!source) return '';
  return source
    .replace(/([A-Z])/g, '_$1')
    .replace(/\s+/g, '_')
    .replace(/-+/g, '_')
    .replace(/_+/g, '_')
    .toLowerCase();
};
