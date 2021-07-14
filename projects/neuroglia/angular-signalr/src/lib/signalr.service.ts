import * as signalR from '@microsoft/signalr';
import { Inject, Injectable, OnDestroy } from '@angular/core';
import { Observable, BehaviorSubject, from, Subject, Observer, of, throwError, timer } from 'rxjs';
import { mergeMap, retryWhen, tap } from 'rxjs/operators';

import { ILogger } from '@neuroglia/logging';
import { NamedLoggingServiceFactory } from '@neuroglia/angular-logging';
import { 
  HttpErrorObserverService,
  HttpRequestInfo,
  logHttpRequest
} from '@neuroglia/angular-rest-core';
import { WS_URL_TOKEN } from './ws-url-token';
import { LABEL_TOKEN } from './label-token';

const defaultReconnectPolicyFactory: (delays?: (number | null)[]) => signalR.IRetryPolicy = (delays = [0, 2000, 10000, 30000]) => ({
  nextRetryDelayInMilliseconds(retryContext: signalR.RetryContext): number | null {
    return [...delays, null][retryContext.previousRetryCount];
  }
});


/**
 * Used to wrap SignalR hub connections
 */
@Injectable()
export abstract class SignalRService implements OnDestroy {

  protected servicePath: string = '';
  protected get url() {
    return `${this.wsUrl}${this.wsUrl.slice(-1) !== '/' ? '/' : ''}${this.servicePath}`;
  }
  connected: boolean = false;
  protected connectedSource: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(this.connected);
  connected$: Observable<boolean> = this.connectedSource.asObservable();
  protected connection?: signalR.HubConnection;
  protected listerners: { [eventName: string]: Subject<any> } = {};
  protected logger: ILogger;

  /**
   * Creates a new SignalRService instance
   * @param apiUrl the base url of the websocket API, e.g.: https://server.com/websockets
   * @param errorObserver  an instance of @see HttpErrorObserverService
   * @param namedLoggingServiceFactory an instance of @see NamedLoggingServiceFactory
   * @param loggingLabel the label used for logging for the current instance
   */
  constructor(
    @Inject(WS_URL_TOKEN) protected wsUrl: string,
    protected errorObserver: HttpErrorObserverService,
    protected namedLoggingServiceFactory: NamedLoggingServiceFactory,
    @Inject(LABEL_TOKEN) protected label: string
  ) {
    //super(wsUrl, errorObserver, namedLoggingServiceFactory, label);
    this.logger = this.namedLoggingServiceFactory.create(label);
  }
 
  /**
   * Connects to the configured SignalR hub
   * @param withAutomaticReconnect activates the automatic reconnection (and its policy)
   * @param logLevel the desired @see signalR.LogLevel
   * @param hubProtocol the desired @see signalR.IHubProtocol
   * @param onReconnectingCallback a function to call when reconnecting
   * @param onReconnectedCallback a function to call when reconnected
   * @param onCloseCallback a function to call when closing
   */
  connect(
    withAutomaticReconnect: boolean | number[] | signalR.IRetryPolicy = true,
    logLevel: signalR.LogLevel = signalR.LogLevel.Warning,
    hubProtocol: signalR.IHubProtocol | null = null,
    onReconnectingCallback: Function | null = null,
    onReconnectedCallback: Function | null = null,
    onCloseCallback: Function | null = null
  ): Observable<void> {
    const httpRequestInfo: HttpRequestInfo = new HttpRequestInfo({ clientServiceName: 'SignalRService', methodName: 'connect', verb: 'websocket', url: this.url });
    if (this.connection) {
      this.logger.log(`websocket is already connected`);
      return of();
    }
    let builder: signalR.HubConnectionBuilder = new signalR.HubConnectionBuilder()
      .withUrl(this.url)
      .configureLogging(logLevel);
    if (withAutomaticReconnect) {
      if (typeof withAutomaticReconnect === typeof true) {
        builder.withAutomaticReconnect();
      }
      else {
        builder.withAutomaticReconnect(withAutomaticReconnect as signalR.IRetryPolicy);
      }
    }
    if (hubProtocol) {
      builder = builder.withHubProtocol(hubProtocol);
    }
    this.connection = builder.build();
    this.connection.onreconnecting((error) => {
      this.logger.error(`Reconnecting after error '${JSON.stringify(error)}'`);
      this.notifyConnectionState(false);
      if (onReconnectingCallback) onReconnectingCallback(error);
    });
    this.connection.onreconnected((connectionId) => {
      this.logger.error(`Reconnected with connectionId '${connectionId}'`);
      this.notifyConnectionState(true);
      if (onReconnectedCallback) onReconnectedCallback(connectionId);
    });
    this.connection.onclose((error) => {
      this.logger.error(`Closed connection with error '${JSON.stringify(error)}'`);
      this.notifyConnectionState(false);
      if (onCloseCallback) onCloseCallback(onCloseCallback);
    });
    let retryStrategy: (attemps: Observable<Error>) => Observable<number>;
    if (!withAutomaticReconnect) {
      retryStrategy = (attemps: Observable<Error>): Observable<number> => attemps.pipe(mergeMap(error => throwError(error)));
    }
    else {
      let retryPolicy: signalR.IRetryPolicy;
      if ((withAutomaticReconnect as any).nextRetryDelayInMilliseconds) {
        retryPolicy = (withAutomaticReconnect as signalR.IRetryPolicy);
      }
      else if (Array.isArray(withAutomaticReconnect)) {
        retryPolicy = defaultReconnectPolicyFactory(withAutomaticReconnect as (number | null)[]);
      }
      else {
        retryPolicy = defaultReconnectPolicyFactory();
      }
      const nextRetryDelayInMilliseconds: (retryContext: signalR.RetryContext) => (number | null) = retryPolicy.nextRetryDelayInMilliseconds;
      const reconnectStartTime = Date.now();
      let retryReason: Error;
      let elapsedMilliseconds: number = 0;
      retryStrategy = (attemps: Observable<Error>): Observable<number> => attemps.pipe(
        mergeMap((error: Error, previousRetryCount: number) => {
          retryReason = error !== undefined ? error : new Error("Attempting to reconnect due to a unknown error.");
          elapsedMilliseconds = Date.now() - reconnectStartTime;
          const retryContext: signalR.RetryContext = {
            previousRetryCount: previousRetryCount++,
            elapsedMilliseconds,
            retryReason
          };
          const nextDelay = nextRetryDelayInMilliseconds(retryContext);
          if (nextDelay === null) {
            return throwError(error);
          }
          if (!this.connection) {
            return throwError(error);
          }
          return timer(nextDelay);
        })
      );
    }
    const repeatableConnect = new Observable<void>(subscribe => {
      if (!this.connection) {
        return subscribe.error();
      }
      this.connection.start()
        .then(subscribe.next.bind(subscribe))
        .catch(subscribe.error.bind(subscribe));
    });
    return logHttpRequest<void>(this.logger, this.errorObserver, repeatableConnect, httpRequestInfo)
      .pipe(
        retryWhen(retryStrategy),
        tap(
          () => {
            this.logger.log(`Connected`);
            this.notifyConnectionState(true);
          },
          (err: any) => {
            this.logger.error(`Connection error '${JSON.stringify(err)}'`);
            this.notifyConnectionState(false);
          }
        )
      );
  }

  /**
   * Disconnects from the SignalR hub
   */
  disconnect(): Observable<void> {
    if (!this.connected || !this.connection) {
      return of();
    }
    return from(this.connection.stop()).pipe(
      tap(() => {
        this.notifyConnectionState(false);
      })
    );
  }

  /**
   * Listens for hub events as observable
   */
  on<T>(event: string): Observable<T> {
    if (!this.listerners[event] && this.connection) {
      this.listerners[event] = new Subject<T>();
      this.connection.on(event , (e: T) => this.listerners[event].next(e))
    }
    return this.listerners[event].asObservable();
  }

  /**
   * Sends data to the hub
   * @param method 
   * @param args 
   */
  send(method: string, ...args: any[]): Observable<void> {
    if (!this.connection) {
      this.logger.warn(`Sending without connection, ignored`);
      return of();
    }
    const httpRequestInfo: HttpRequestInfo = new HttpRequestInfo({ clientServiceName: 'SignalRService', methodName: `send '${method}'`, verb: 'websocket', url: this.url, postData: JSON.stringify(args) });
    return logHttpRequest<void>(this.logger, this.errorObserver, from(this.connection.send(method, ...args)), httpRequestInfo);
  }

  /**
   * Invokes hub method
   * @param method 
   * @param args 
   */
  invoke<T>(method: string, ...args: any[]): Observable<T> {
    if (!this.connection) {
      this.logger.warn(`Invoking without connection, ignored`);
      return of();
    }
    const httpRequestInfo: HttpRequestInfo = new HttpRequestInfo({ clientServiceName: 'SignalRService', methodName: `invoke '${method}'`, verb: 'websocket', url: this.url, postData: JSON.stringify(args) });
    return logHttpRequest<T>(this.logger, this.errorObserver, from(this.connection.invoke(method, ...args)), httpRequestInfo);
  }

  /**
   * Gets a stream from the hub
   * @param method 
   * @param args 
   */
  stream<T>(method: string, ...args: any[]): Observable<T> {
    if (!this.connection) {
      this.logger.warn(`Streaming without connection, ignored`);
      return of();
    }
    const httpRequestInfo: HttpRequestInfo = new HttpRequestInfo({ clientServiceName: 'SignalRService', methodName: `stream '${method}'`, verb: 'websocket', url: this.url, postData: JSON.stringify(args) });
    return logHttpRequest<T>(this.logger, this.errorObserver, new Observable((observer: Observer<T>) => {
      (this.connection as signalR.HubConnection).stream(method, ...args).subscribe({
        next: (data: T) => observer.next(data),
        error: (err: any) => observer.error(err),
        complete: () => observer.complete()
      });
    }), httpRequestInfo);
  }

  /**
   * Disconnects the SignalR hub when the service is disposed
   */
  ngOnDestroy() {
    this.disconnect()
      .subscribe()
      .unsubscribe();
  }

  /**
   * Updates the connected state
   * @param connected
   */
  private notifyConnectionState(connectedState: boolean) {
    if (this.connected !== connectedState) {
      this.connected = connectedState;
      this.connectedSource.next(this.connected);
    }
  }
}
