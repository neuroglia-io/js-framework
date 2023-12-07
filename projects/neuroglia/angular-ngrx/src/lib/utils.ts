import { Actions, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { Observable, of, race, timer } from 'rxjs';
import { finalize, take, takeUntil, tap } from 'rxjs/operators';

/**
 * Creates an observable that completes when one of the reactions have been emitted (or timedout)
 * @param store
 * @param actions$
 * @param action
 * @param reactions
 * @param timeout
 * @returns
 */
export const createReactiveAction = (
  store: Store,
  actions$: Actions,
  action: any,
  reactions: any[],
  timeout: number = 2000,
): Observable<any> =>
  new Observable((subscriber) => {
    store.dispatch(action);
    race(
      actions$.pipe(
        ofType(...reactions),
        tap((action) => subscriber.next(action)),
      ),
      timer(timeout).pipe(tap(() => subscriber.next())),
    )
      .pipe(take(1))
      .subscribe({
        complete: () => subscriber.complete(),
        error: (err) => subscriber.error(err),
      });
  });
