import { LoggingLevel } from './logging-level';
import { LoggingService } from './logging.service';

/**
 * Wraps the LoggingService to add a logging name to the log info
 */
export class NamedLoggingService extends LoggingService {
  /**
   * The name appended to the log info
   */
  logInfoName: string;

  constructor(logInfoName: string, loggingLevel?: LoggingLevel) {
    super(loggingLevel);
    this.logInfoName = logInfoName;
    this.addLogInfoProvider(this.nameLogInfoProvider.bind(this));
  }

  /**
   * The log info provider providing the name
   */
  private nameLogInfoProvider(): any {
    return {
      name: this.logInfoName,
    };
  }
}
