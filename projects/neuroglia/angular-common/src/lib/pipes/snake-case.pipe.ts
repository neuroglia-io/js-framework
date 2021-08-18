import { Pipe, PipeTransform } from '@angular/core';
import { snakeCase } from '@neuroglia/common';

/**
 * A pipe to transform text into snake_case
 */
@Pipe({
  name: 'snakeCase'
})
export class SnakeCasePipe implements PipeTransform {

  transform(source: string): string {
    if (!source) return '';
    return snakeCase(source);
  }

}
