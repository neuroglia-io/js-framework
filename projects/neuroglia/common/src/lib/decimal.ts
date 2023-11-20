/**
 * Decimal is used to help decimal operations
 */
export class Decimal {
  /**
   * Returns a decimal from a floating number
   * @param floating the floating number to convert
   * @returns A decimal value
   */
  static convert(floating: number): number {
    return Math.round(floating * 100) / 100;
  }

  /**
   * Returns the decimal result of the addition of the two provided numbers
   * @param a The first number to add
   * @param b The second number to add
   * @returns The sum
   */
  static add(a: number, b: number): number {
    return (Math.round(a * 100) + Math.round(b * 100)) / 100;
  }

  /**
   * Returns the decimal result of the substraction of the two provided numbers
   * @param a The first number to substract
   * @param b The second number to substract
   * @returns The result
   */
  static sub(a: number, b: number): number {
    return (Math.round(a * 100) - Math.round(b * 100)) / 100;
  }

  /**
   * Returns the decimal result of the product of the two provided numbers
   * @param a The first number to multiply
   * @param b The second number to multiply
   * @returns The product
   */
  static mul(a: number, b: number): number {
    return (Math.round(a * 100) * Math.round(b * 100)) / (100 * 100);
  }

  /**
   * Returns the decimal result of the quotient  of the two provided numbers
   * @param a The dividend
   * @param b The divider
   * @returns The quotient
   */
  static div(a: number, b: number): number {
    return Math.round(a * 100) / Math.round(b * 100);
  }
}
