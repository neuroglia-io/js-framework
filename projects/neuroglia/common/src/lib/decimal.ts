/**
 * Decimal is used to help decimal operations
 */
export class Decimal {

  constructor() { }

  /**
   * Returns a decimal from a floating number
   * @param floating the floating number to convert
   * @returns A decimal value
   */
  static convert(floating: number): number {
    return Math.round(floating * 100) / 100;
  }
  
}
