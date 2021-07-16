import { LoggingLevel } from './logging-level';

/**
 * Defines the interface of a log info
 */
export interface ILogInfo {
  /**
   * The moment the log has been created
   */
  timestamp: Date;
  /**
   * The log level
   */
  level: LoggingLevel;
  /**
   * The log level name
   */
  levelName: string;
  /**
   * Extended properties
   */
  [key: string]: any;
}
