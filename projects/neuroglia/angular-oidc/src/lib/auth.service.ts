import { Injectable, inject } from '@angular/core';
import { StorageHandlerFactoryService } from '@neuroglia/angular-common';
import { NamedLoggingServiceFactory } from '@neuroglia/angular-logging';
import { IStorageHandler } from '@neuroglia/common';
import { ILogger } from '@neuroglia/logging';
import { User, UserManager, Log } from 'oidc-client';
import { Observable, from, of, BehaviorSubject } from 'rxjs';
import { tap, shareReplay } from 'rxjs/operators';
import { OidcOptions } from './models/oidc-options';

/**
 * The service used to manage user authorization
 */
@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private logger: ILogger;
  private userManager: UserManager;
  private returnUrlStorageKey = 'oidc_return_url';
  private returnUrlStorage: IStorageHandler<string>;
  private userRequest?: Observable<User | null>;
  private user: User | null = null;
  private userSource: BehaviorSubject<User | null> = new BehaviorSubject<User | null>(this.user);
  user$: Observable<User | null> = this.userSource.asObservable();

  private namedLoggingFactory = inject(NamedLoggingServiceFactory);
  private oidcOptions = inject(OidcOptions);
  private storageService = inject(StorageHandlerFactoryService);

  constructor() {
    this.logger = this.namedLoggingFactory.create('AuthService');
    Log.logger = this.logger;
    this.userManager = new UserManager(this.oidcOptions);
    this.returnUrlStorage = this.storageService.create<string>(this.returnUrlStorageKey);
    this.userManager.events.addUserLoaded(this.onUserLoaded.bind(this));
    this.userManager.events.addUserUnloaded(this.onUserUnloaded.bind(this));
    this.userManager.events.addAccessTokenExpiring(this.onAccessTokenExpiring.bind(this));
    this.userManager.events.addAccessTokenExpired(this.onAccessTokenExpired.bind(this));
    this.userManager.events.addSilentRenewError(this.onSilentRenewError.bind(this));
    this.userManager.events.addUserSessionChanged(this.onUserSessionChanged.bind(this));
    this.userManager.events.addUserSignedOut(this.onUserSignedOut.bind(this));
  }

  /**
   * Returns the current OIDC user if any
   */
  getUser(): Observable<User | null> {
    if (this.user) return of(this.user);
    this.userRequest =
      this.userRequest ||
      from(this.userManager.getUser()).pipe(
        tap((user: User | null) => {
          this.user = user;
          this.userSource.next(this.user);
        }),
        shareReplay(1),
      );
    return this.userRequest;
  }

  /**
   * Initiates login process
   * @param returnUrl
   */
  login(returnUrl?: string): Observable<unknown> {
    if (!returnUrl) {
      returnUrl = window.location.pathname;
    }
    this.returnUrlStorage.setItem(returnUrl);
    return from(this.userManager.signinRedirect());
  }
  /**
   * Initiates token renewal process
   */
  renewToken(): Observable<User> {
    return from(this.userManager.signinSilent());
  }

  /**
   * Initiates logout process
   * @param returnUrl
   */
  logout(returnUrl?: string): Observable<unknown> {
    if (!returnUrl) {
      returnUrl = window.location.pathname;
    }
    this.returnUrlStorage.setItem(returnUrl);
    return from(this.userManager.signoutRedirect());
  }

  /**
   * Initiates the signin verification after OP callback
   */
  signinRedirectCallback(): Observable<void | User> {
    return from(this.userManager.signinRedirectCallback()).pipe(
      tap(
        () => {
          window.history.replaceState({}, window.document.title, window.location.origin);
          const returnUrl = this.returnUrlStorage.getItem() || '/';
          this.logger.debug(`Login successful, redirecting to '${returnUrl}'`);
          window.location.href = returnUrl;
        },
        (err) => {
          this.logger.error(`An error occured while logging in`, err);
        },
      ),
    );
  }

  /**
   * Initiates the silent signin verification after OP callback
   */
  signinSilentCallback(): Observable<void | User> {
    return from(this.userManager.signinSilentCallback()).pipe(
      tap(
        () => {
          this.logger.debug(`Silent renew successful`);
        },
        (err) => {
          this.logger.error(`An error occured during silent renew`, err);
        },
      ),
    );
  }

  /**
   * Initiates the signout redirection after OP callback
   */
  signoutRedirectCallback(): Observable<void> {
    const returnUrl = this.returnUrlStorage.getItem() || '/';
    this.logger.debug(`Signout successful, redirecting to '${returnUrl}'`);
    window.location.href = returnUrl;
    return of();
  }

  /**
   * Handles access token expiring event
   */
  private onAccessTokenExpiring() {
    this.logger.debug('Access token expiring');
  }

  /**
   * Handles access token expired event
   */
  private onAccessTokenExpired() {
    this.logger.debug('Access token expired');
  }

  /**
   * Handles user loaded event
   * @param user
   */
  private onUserLoaded(user: User) {
    this.logger.debug('User loaded');
    this.user = user;
    this.userSource.next(this.user);
  }

  /**
   * Handles user unloaded event
   */
  private onUserUnloaded() {
    this.logger.debug('User unloaded');
    this.user = null;
    this.userSource.next(this.user);
  }

  /**
   * Handles silent renew error event
   * @param err
   */
  private onSilentRenewError(err: Error) {
    this.logger.error('Silent renew error', err);
  }

  /**
   * Handles user signed out event
   */
  private onUserSignedOut() {
    this.logger.debug('User signed out');
    this.user = null;
    this.userSource.next(this.user);
  }

  /**
   * Handles user session changed event
   */
  private onUserSessionChanged() {
    this.logger.debug('User session changed');
  }
}
