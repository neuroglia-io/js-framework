import { Pipe, PipeTransform } from '@angular/core';
import { kebabCase } from '@neuroglia/common';

/**
 * A pipe to transform text into kebab-case
 */
@Pipe({
  name: 'kebabCase',
})
export class KebabCasePipe implements PipeTransform {
  transform(source: string): string {
    if (!source) return '';
    return kebabCase(source);
  }
}
