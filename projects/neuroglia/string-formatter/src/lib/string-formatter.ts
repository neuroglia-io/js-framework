import { get } from '@neuroglia/common';

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

function replacer(payload: any, pattern: string, ...matches: any[]): string {
  const value = get(payload, matches[0], pattern);
  if (!value) {
    return '';
  }
  if (typeof value !== 'object') {
    return value;
  }
  return JSON.stringify(value);
}
/**
 * Formats the provided message with the provided object
 * @param message the message with string interpolation like placeholders (eg: ${name})
 * @param params the object to format the message with
 */
export function strFormatNamed(message: string, params: any): string {
  if (!message) return '';
  if (!params) return message;
  const needle = /\$\{([^}]*)\}/g;
  return message.replace(needle, replacer.bind(null, params));
}

/**
 * Formats the provided message with the provided object (works with nested properties but is unsafe)
 * @param message the message with string interpolation like placeholders (eg: ${name})
 * @param params the object to format the message with
 */
export function strFormatNamedUnsafe(message: string, params: any): string {
  if (!message || !params) return message || '';
  const renderer = new Function('p', 'return `' + message.replace(/\$\{/g, '${p.') + '`;');
  return renderer(params);
}
