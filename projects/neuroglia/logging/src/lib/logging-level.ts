/**
 * Used to indicate importance or severity of the log message
 * log messages can be filtered based on their level
 */
export enum LoggingLevel {
  none = 0,
  critical = 1,
  error = 2,
  warning = 3,
  information = 4,
  debug = 5,
  trace = 6
};