import { Pipe, PipeTransform } from '@angular/core';
import { camelCase } from '@neuroglia/common';

/**
 * A pipe to transform text into camelCase
 */
@Pipe({
  name: 'camelCase',
})
export class CamelCasePipe implements PipeTransform {
  transform(source: string): string {
    if (!source) return '';
    return camelCase(source);
  }
}
