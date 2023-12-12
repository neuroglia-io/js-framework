import { Injectable } from '@angular/core';
import { LoggingService as NeurogliaLoggingService } from '@neuroglia/logging';

/**
 * Wraps a LoggingService so it can be injected by Angular
 */
@Injectable({
  providedIn: 'root',
})
export class LoggingService {
  logger: NeurogliaLoggingService = new NeurogliaLoggingService();

  constructor() {}
}
