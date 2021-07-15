import { ILogger, LoggingLevel } from '@neuroglia/logging';

/**
 * Provides an injectable class token for the interface ILogger, see https://v8.angular.io/guide/dependency-injection-in-action#class-interface
 */
export abstract class AbstractLogger implements ILogger {
  /**
   * Logging level applied to the logger
   */
  loggingLevel: LoggingLevel | null | undefined;
  /**
   * Logs critical level messages
   * @param message
   * @param optionalParams
   */
  critical: (message?: any, ...optionalParams: any[]) => void = (message?: any, ...optionalParams: any[]) => {};
  /**
   * Logs critical level messages (same as critical method)
   * @param message
   * @param optionalParams
   */
  fatal: (message?: any, ...optionalParams: any[]) => void = (message?: any, ...optionalParams: any[]) => {};
  /**
   * Logs error level messages
   * @param message
   * @param optionalParams
   */
  error: (message?: any, ...optionalParams: any[]) => void = (message?: any, ...optionalParams: any[]) => {};
  /**
   * Logs warning level messages
   * @param message
   * @param optionalParams
   */
  warn: (message?: any, ...optionalParams: any[]) => void = (message?: any, ...optionalParams: any[]) => {};
  /**
   * Logs information level messages
   * @param message
   * @param optionalParams
   */
  info: (message?: any, ...optionalParams: any[]) => void = (message?: any, ...optionalParams: any[]) => {};
  /**
   * Logs debug level messages
   * @param message
   * @param optionalParams
   */
  debug: (message?: any, ...optionalParams: any[]) => void = (message?: any, ...optionalParams: any[]) => {};
  /**
   * Logs debug level messages (same as debug method)
   * @param message
   * @param optionalParams
   */
  log: (message?: any, ...optionalParams: any[]) => void = (message?: any, ...optionalParams: any[]) => {};
  /**
   * Logs trace level messages (same as debug method)
   * @param message
   * @param optionalParams
   */
  verbose: (message?: any, ...optionalParams: any[]) => void = (message?: any, ...optionalParams: any[]) => {};
  /**
   * Logs trace level messages
   * @param message
   * @param optionalParams
   */
  trace: (message?: any, ...optionalParams: any[]) => void = (message?: any, ...optionalParams: any[]) => {};
}
