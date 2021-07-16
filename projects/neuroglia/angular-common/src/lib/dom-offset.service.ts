import { ElementRef, Injectable } from '@angular/core';

/**
 * DomOffsetService exposes methods to ease the calculation of DOM elements offsets
 */
@Injectable({
  providedIn: 'root',
})
export class DomOffsetService {
  constructor() {}

  /**
   * Calculates the offset between an element and one of its ancestor
   * @param elementRef The ElementRef to start with
   * @param ancestorElementRef The ancestor's ElementRef to stop to
   * @param removeMargins Don't take 'elementRef' margins into account
   * @returns the offset between 'elementRef' and 'ancestorElementRef'
   */
  getOffset(elementRef: ElementRef, ancestorElementRef?: ElementRef, removeMargins = false) {
    let element = elementRef.nativeElement,
      elementStyle = element.currentStyle || window.getComputedStyle(element),
      ancestorElement = ancestorElementRef ? ancestorElementRef.nativeElement : document.body,
      offset = { top: 0, left: 0 },
      offsetParent;
    while (element && element !== ancestorElement) {
      if (!offsetParent || element === offsetParent) {
        offset.top += element.offsetTop || 0;
        offset.left += element.offsetLeft || 0;
        offsetParent = element.offsetParent;
      }
      element = element.parentElement;
    }
    if (removeMargins) {
      offset.top -= parseInt(elementStyle.marginTop, 10) || 0;
      offset.left -= parseInt(elementStyle.marginLeft, 10) || 0;
    }
    return offset;
  }
}
