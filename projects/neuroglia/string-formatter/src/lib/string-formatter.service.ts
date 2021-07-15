/**
 * Formats the provided message with the provided array of parameters
 * @param message the message with numeric arguments like {0}, {1}...
 * @param params the parameters to format the message with
 */
export function strFormat(message: string, ...params: any[]): string {
  if (!message) return '';
  if (!params || !params.length) return message;
  return message.replace(/{(\d+)}/g, (pattern, index) => params[index] || pattern);
}

/**
 * Formats the provided message with the provided object
 * @param message the message with string interpolation like placeholders (eg: ${name})
 * @param params the object to format the message with
 */
export function strformatNamed(message: string, params: any): string {
  if (!message) return '';
  if (!params) return message;
  return message.replace(/\${(\w+)}/g, (pattern, match) => params[match] || pattern);
}

/**
 * Formats the provided message with the provided object (works with nested properties but is unsafe)
 * @param message the message with string interpolation like placeholders (eg: ${name})
 * @param params the object to format the message with
 */
export function strformatNamedUnsafe(message: string, params: any): string {
  if (!message || !params) return message || '';
  const renderer = new Function('p', 'return `' + message.replace(/\$\{/g, '${p.') + '`;');
  return renderer(params);
}
