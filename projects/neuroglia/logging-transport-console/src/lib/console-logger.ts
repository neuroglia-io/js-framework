import { ILogger, LoggingLevel } from '@neuroglia/logging';

/**
 * Wraps console logging
 */
export class ConsoleLogger implements ILogger {
  private format: string;

  constructor(format?: string | null) {
    this.format = format || '[${logInfo.timestamp.toISOString()}] ${logInfo.levelName} ${message}';
  }

  loggingLevel: LoggingLevel | null | undefined;
  /**
   * Logs critical level messages
   * @param message
   * @param optionalParams
   */
  critical(message?: any, ...optionalParams: any[]): void {
    this.process('error', message, ...optionalParams);
  }
  /**
   * Logs critical level messages (same as critical method)
   * @param message
   * @param optionalParams
   */
  fatal(message?: any, ...optionalParams: any[]): void {
    this.process('error', message, ...optionalParams);
  }
  /**
   * Logs error level messages
   * @param message
   * @param optionalParams
   */
  error(message?: any, ...optionalParams: any[]): void {
    this.process('error', message, ...optionalParams);
  }
  /**
   * Logs warning level messages
   * @param message
   * @param optionalParams
   */
  warn(message?: any, ...optionalParams: any[]): void {
    this.process('warn', message, ...optionalParams);
  }
  /**
   * Logs information level messages
   * @param message
   * @param optionalParams
   */
  info(message?: any, ...optionalParams: any[]): void {
    this.process('info', message, ...optionalParams);
  }
  /**
   * Logs debug level messages
   * @param message
   * @param optionalParams
   */
  debug(message?: any, ...optionalParams: any[]): void {
    this.process('log', message, ...optionalParams);
  }
  /**
   * Logs debug level messages (same as debug method)
   * @param message
   * @param optionalParams
   */
  log(message?: any, ...optionalParams: any[]): void {
    this.process('log', message, ...optionalParams);
  }
  /**
   * Logs verbose level messages (same as debug method)
   * @param message
   * @param optionalParams
   */
  verbose(message?: any, ...optionalParams: any[]): void {
    this.process('log', message, ...optionalParams);
  }
  /**
   * Logs trace level messages
   * @param message
   * @param optionalParams
   */
  trace(message?: any, ...optionalParams: any[]): void {
    this.process('trace', message, ...optionalParams);
  }

  /**
   * Compiles the configured message format with the log data
   * @param logInfo
   * @param message
   * @param params
   */
  private compile(logInfo: string, message: string, params: any[]): string {
    const compiler = new Function('logInfo', 'message', 'return `' + this.format + '`;');
    return compiler(logInfo, message);
  }

  /**
   * Processes the log data
   * @param level
   * @param message
   * @param optionalParams
   */
  private process(level: string, message?: any, ...optionalParams: any[]): void {
    const simplifiedParams = ([] as any[]).concat(optionalParams || []);
    const logInfo = simplifiedParams.pop();
    if (typeof message === typeof '') {
      message = this.compile(logInfo, message, simplifiedParams);
    }
    (console as any)[level](message, ...simplifiedParams);
  }
}
