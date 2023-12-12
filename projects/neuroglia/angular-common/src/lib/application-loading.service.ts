import { Injectable, inject } from '@angular/core';
import { NamedLoggingServiceFactory } from '@neuroglia/angular-logging';
import { ILogger } from '@neuroglia/logging';
import { BehaviorSubject, Observable } from 'rxjs';

/**
 * Provides application wide loading state mecanisms
 */
@Injectable({
  providedIn: 'root',
})
export class ApplicationLoadingService {
  /** Stores the list of emitted loading tokens */
  private loadingTokens: string[] = [];
  /** The loading state */
  loading = false;
  /** The loading state subject */
  private loadingSource: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(this.loading);
  /** The loading state observable */
  loading$: Observable<boolean> = this.loadingSource.asObservable();
  /** The service used to create a named logger */
  private namedLoggingServiceFactory = inject(NamedLoggingServiceFactory);
  /** An instance of @see ILogger */
  private logger: ILogger;

  constructor() {
    this.logger = this.namedLoggingServiceFactory.create('ApplicationLoadingService');
  }

  /**
   * Generates a loading token and switches the loading state to true
   */
  startLoading(): string {
    const token = this.generateToken();
    this.logger.trace(`Emitted new token '${token}'`);
    this.loadingTokens.push(token);
    this.loading = true;
    this.loadingSource.next(this.loading);
    this.logger.trace(`Loading state set to 'true'`);
    return token;
  }

  /**
   * Cancels the provided loading token and turn off the loading state if there is no more active tokens
   * @param token a loading token
   */
  stopLoading(token: string): void {
    const loadingIndex = this.loadingTokens.indexOf(token);
    if (loadingIndex === -1) return;
    this.loadingTokens.splice(loadingIndex, 1);
    this.logger.trace(`Removed token '${token}'`);
    if (!this.loadingTokens.length) {
      this.loading = false;
      this.loadingSource.next(this.loading);
      this.logger.trace(`No more active tokens, loading state set to 'false' '${token}'`);
    }
  }

  /**
   * Tells if the provided token is still active
   * @param token a loading token
   */
  isLoading(token: string): boolean {
    return this.loadingTokens.indexOf(token) !== -1;
  }

  /**
   * Generates a loading token
   */
  private generateToken(): string {
    return Math.random().toString(36).substring(7);
  }
}
