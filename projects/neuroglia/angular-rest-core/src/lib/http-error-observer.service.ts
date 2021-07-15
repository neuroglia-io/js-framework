import { Injectable } from '@angular/core';
import { ReplaySubject, Observable } from 'rxjs';
import { HttpErrorInfo } from './models/http-error-info';

/*
 * Used to stream http errors
 */
@Injectable({
  providedIn: 'root',
})
export class HttpErrorObserverService {
  private errorSource: ReplaySubject<HttpErrorInfo> = new ReplaySubject<HttpErrorInfo>(5);
  error$: Observable<HttpErrorInfo> = this.errorSource.asObservable();

  next(error: HttpErrorInfo) {
    this.errorSource.next(error);
  }
}
