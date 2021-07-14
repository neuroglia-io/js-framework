import { LoggingLevel } from './logging-level';

/**
 * Defines the interface of a logger
 */
export interface ILogger {

  /**
   * Logging level applied to the logger
   */
  loggingLevel: LoggingLevel | null | undefined;
  /**
   * Logs critical level messages
   * @param message 
   * @param optionalParams 
   */
  critical(message?: any, ...optionalParams: any[]): void;
  /**
   * Logs critical level messages (same as critical method)
   * @param message 
   * @param optionalParams 
   */
  fatal(message?: any, ...optionalParams: any[]): void;
  /**
   * Logs error level messages
   * @param message 
   * @param optionalParams 
   */
  error(message?: any, ...optionalParams: any[]): void;
  /**
   * Logs warning level messages
   * @param message 
   * @param optionalParams 
   */
  warn(message?: any, ...optionalParams: any[]): void;
  /**
   * Logs information level messages
   * @param message 
   * @param optionalParams 
   */
  info(message?: any, ...optionalParams: any[]): void;
  /**
   * Logs debug level messages
   * @param message 
   * @param optionalParams 
   */
  debug(message?: any, ...optionalParams: any[]): void;
  /**
   * Logs debug level messages (same as debug method)
   * @param message 
   * @param optionalParams 
   */
  log(message?: any, ...optionalParams: any[]): void;
  /**
   * Logs trace level messages (same as debug method)
   * @param message 
   * @param optionalParams 
   */
  verbose(message?: any, ...optionalParams: any[]): void;
  /**
   * Logs trace level messages
   * @param message 
   * @param optionalParams 
   */
  trace(message?: any, ...optionalParams: any[]): void;

}
