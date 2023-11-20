import { Pipe, PipeTransform } from '@angular/core';
import { humanCase } from '@neuroglia/common';

/**
 * A pipe to transform text into "Human case"
 */
@Pipe({
  name: 'humanCase',
})
export class HumanCasePipe implements PipeTransform {
  transform(source: string, keepCapitalLetters: boolean = false): string {
    if (!source) return '';
    return humanCase(source, keepCapitalLetters);
  }
}
