import { Pipe, PipeTransform } from '@angular/core';
import { pascalCase } from '@neuroglia/common';

/**
 * A pipe to transform text into PascalCase
 */
@Pipe({
  name: 'pascalCase',
  standalone: true,
})
export class PascalCasePipe implements PipeTransform {
  transform(source: string): string {
    if (!source) return '';
    return pascalCase(source);
  }
}
