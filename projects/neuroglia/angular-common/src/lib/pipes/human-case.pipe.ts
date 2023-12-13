import { Pipe, PipeTransform } from '@angular/core';
import { humanCase } from '@neuroglia/common';

/**
 * A pipe to transform `PascalCase`/`camelCase` into `Human Case`
 */
@Pipe({
  name: 'humanCase',
  standalone: true,
})
export class HumanCasePipe implements PipeTransform {
  transform(value: string, keepCapitalLetters: boolean = false, removeUnions: boolean = false): string {
    if (!value) return '';
    let transformable = value.trim();
    if (removeUnions) {
      transformable = transformable.replace(/[\-_](.?)/g, (match, capture) => capture.toUpperCase());
    }
    transformable =
      transformable[0].toUpperCase() +
      transformable
        .slice(1)
        .replace(/([A-Z])/g, ' $1')
        .replace(/\s+/g, ' ');
    if (keepCapitalLetters) {
      return transformable;
    } else {
      return transformable.toLowerCase();
    }
  }
}
