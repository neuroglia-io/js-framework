import { Injectable } from '@angular/core';
import { ILogger, LoggingLevel, NamedLoggingService } from '@neuroglia/logging';

/**
 * Provides an injectable factory for creating NamedLoggingServices
 */
@Injectable({
  providedIn: 'root',
})
export class NamedLoggingServiceFactory {
  loggingLevel: LoggingLevel = LoggingLevel.trace;
  transports: ILogger[] = [];

  constructor() {}

  create(name: string): NamedLoggingService {
    const loggingService = new NamedLoggingService(name, this.loggingLevel);
    this.transports.forEach((transport) => loggingService.addTransport(transport));
    return loggingService;
  }
}
