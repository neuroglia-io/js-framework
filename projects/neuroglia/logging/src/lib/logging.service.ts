import { LoggingLevel } from './logging-level';
import { ILogger } from './logger.interface';
import { ILogInfo } from './log-info.interface';

/**
 * The main service used for logging purpose
 */
export class LoggingService implements ILogger {
  /**
   * Default logging level (default: @see LoggingLevel.trace )
   */
  loggingLevel: LoggingLevel = LoggingLevel.trace;
  /**
   * Stores registered transports
   */
  protected transports: ILogger[] = [];
  /**
   * Stores logInfo providers
   */
  protected logInfoProviders: Function[] = [];

  /**
   * Creates a new instance of a logging service with the provided log level
   * @param loggingLevel the @see LoggingLevel to use, default is trace
   */
  constructor(loggingLevel?: LoggingLevel) {
    if (typeof loggingLevel !== typeof undefined) {
      this.setLoggingLevel(loggingLevel as LoggingLevel);
    } else {
      this.setLoggingLevel(LoggingLevel.trace);
    }
  }

  /**
   * Adds the specified transport to the service
   * @param transport the @see ILogger to add
   */
  addTransport(transport: ILogger): void {
    const index = this.transports.indexOf(transport);
    if (index === -1) this.transports.push(transport);
  }

  /**
   * Removes the specified logger to the service
   * @param transport the @see ILogger to remove
   */
  removeTransport(transport: ILogger): void {
    this.transports = this.transports.filter((l) => l !== transport);
  }

  /**
   * Clears all transports from the service
   */
  clearTransports(): void {
    this.transports = [];
  }

  /**
   * Adds the specified logInfo provider
   * @param provider a function that provides an object that will extend the logInfo
   */
  addLogInfoProvider(provider: Function): void {
    this.logInfoProviders.push(provider);
  }

  /**
   * Removes the specified logInfo provider
   * @param provider a function that provides an object that will extend the logInfo
   */
  removeLogInfoProvider(provider: Function): void {
    this.logInfoProviders = this.logInfoProviders.filter((p) => p !== provider);
  }

  /**
   * Clears all log info providers from the service
   */
  clearLogInfoProviders(): void {
    this.logInfoProviders = [];
  }

  /**
   * Clears both transports and log info providers from the service
   */
  clear(): void {
    this.clearTransports();
    this.clearLogInfoProviders();
  }

  /**
   * Sets the service default logging level and the underlying transports if specified
   * @param loggingLevel the desired @see LoggingLevel
   * @param applyToTransports if the @see LoggingLevel should be applied to all the @see ILogger attached to the service (default: false)
   */
  setLoggingLevel(loggingLevel: LoggingLevel, applyToTransports: boolean = false): void {
    this.loggingLevel = loggingLevel;
    if (applyToTransports) {
      this.transports.forEach((transport) => {
        transport.loggingLevel = loggingLevel;
      });
    }
  }

  /**
   * Logs critical level messages
   * @param message
   * @param optionalParams
   */
  critical(message?: any, ...optionalParams: any[]): void {
    this.process(LoggingLevel.critical, message, ...optionalParams);
  }

  /**
   * Logs critical level messages
   * @param message
   * @param optionalParams
   */
  fatal(message?: any, ...optionalParams: any[]): void {
    this.critical(message, ...optionalParams);
  }

  /**
   * Logs error level messages
   * @param message
   * @param optionalParams
   */
  error(message?: any, ...optionalParams: any[]): void {
    this.process(LoggingLevel.error, message, ...optionalParams);
  }

  /**
   * Logs warning level messages
   * @param message
   * @param optionalParams
   */
  warn(message?: any, ...optionalParams: any[]): void {
    this.process(LoggingLevel.warning, message, ...optionalParams);
  }

  /**
   * Logs information level messages
   * @param message
   * @param optionalParams
   */
  info(message?: any, ...optionalParams: any[]): void {
    this.process(LoggingLevel.information, message, ...optionalParams);
  }

  /**
   * Logs debug level messages
   * @param message
   * @param optionalParams
   */
  debug(message?: any, ...optionalParams: any[]): void {
    this.process(LoggingLevel.debug, message, ...optionalParams);
  }

  /**
   * Logs debug(=log) level messages
   * @param message
   * @param optionalParams
   */
  log(message?: any, ...optionalParams: any[]): void {
    this.debug(message, ...optionalParams);
  }

  /**
   * Logs debug(=verbose) level messages
   * @param message
   * @param optionalParams
   */
  verbose(message?: any, ...optionalParams: any[]): void {
    this.debug(message, ...optionalParams);
  }

  /**
   * Logs trace level messages
   * @param message
   * @param optionalParams
   */
  trace(message?: any, ...optionalParams: any[]): void {
    this.process(LoggingLevel.trace, message, ...optionalParams);
  }

  /**
   * Returns various info about the logging event such as the timestamp or log level name
   * @param level
   */
  protected getLoggingInfo(level: LoggingLevel): any {
    let logInfo: ILogInfo = {
      timestamp: new Date(),
      levelName: LoggingLevel[level],
      level: level,
    };
    logInfo = this.logInfoProviders.reduce((acc, provider) => Object.assign({}, acc, provider()), logInfo);
    return logInfo;
  }

  /**
   * Calls the logger using the proper logging level
   * @param level
   * @param message
   * @param optionalParams
   */
  protected process(level: LoggingLevel, message?: any, ...optionalParams: any[]): void {
    let levelMethod = LoggingLevel[level];
    if (level === LoggingLevel.warning) {
      levelMethod = 'warn';
    } else if (level === LoggingLevel.information) {
      levelMethod = 'info';
    }
    const logInfo = this.getLoggingInfo(level);
    const extendedOptionalParams = (optionalParams || []).concat([logInfo]);
    this.transports.forEach((transport) => {
      if (this.shouldLog(transport, level)) (transport as any)[levelMethod](message, ...extendedOptionalParams);
    });
  }

  /**
   * Verifies whenever a @see ILogger should be logging a message of the provided @see LoggingLevel
   * @param logger
   * @param level
   */
  protected shouldLog(logger: ILogger, level: LoggingLevel): boolean {
    if (typeof logger.loggingLevel === typeof undefined) {
      return (this.loggingLevel as LoggingLevel) >= level;
    } else {
      return (logger.loggingLevel as LoggingLevel) >= level;
    }
  }
}
