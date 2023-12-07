import { Injectable } from '@angular/core';
import { Actions } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { createReactiveAction } from '../utils';
import { PartialObserver } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ReactiveActionService {
  constructor(
    protected store: Store,
    protected actions$: Actions,
  ) {}

  createReactiveAction(action: any, reactions: any[], callback: (value: any) => void, timeout: number = 2000): void {
    createReactiveAction(this.store, this.actions$, action, reactions).subscribe(callback);
  }
}
