import { ActionReducer, INIT, UPDATE } from '@ngrx/store';
import { StorageHandler } from '@neuroglia/common';
import { MetaReducer } from '@ngrx/store';

/**
 * The factory used to build a persistence meta-reducer.
 * The persistence meta-reducer saves the state to the local storage each time a reducer is called.
 * It loads the saved state, if any and not expired, when the application loads.
 * Either use it at feature level or root level but not both!
 * @param featureName The name of the ngrx feature store. If none, root store assumed
 * @param expiresIn The sliding expiracy delay is milliseconds (default 7 days, 7 * 24 * 60 * 60 * 1000)
 */
export const persistenceMetaReducerFactory = (
  featureName: string | null,
  expiresIn: number | null = null,
): MetaReducer<any> => {
  expiresIn = expiresIn || 7 * 24 * 60 * 60 * 1000;
  const STORAGE_KEY = featureName ? `STATE::${featureName}` : 'STATE::APPLICATION_ROOT';
  const storage = new StorageHandler<any>(STORAGE_KEY, expiresIn);
  return (reducer: ActionReducer<any>): ActionReducer<any> =>
    (state, action: any) => {
      if (
        (!featureName && action.type === INIT) ||
        (featureName &&
          action.type === UPDATE &&
          action.features &&
          (action.features as string[]).includes(featureName))
      ) {
        const savedState = storage.getItem();
        if (savedState) {
          //console.log(`(${featureName|| 'root' }) using persisted state`, 'action', action.type, action, 'state', savedState);
          return savedState;
        }
      }
      const nextState = reducer(state, action);
      storage.setItem(nextState);
      return nextState;
    };
};
