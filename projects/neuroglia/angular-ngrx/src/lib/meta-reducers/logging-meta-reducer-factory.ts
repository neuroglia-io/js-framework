import { ActionReducer, MetaReducer } from '@ngrx/store';

/**
 * The factory used to build a logging meta-reducer.
 * The logging meta-reducer logs the action and their state.
 * @param featureName The name of the ngrx feature store. If none, root store assumed
 */
export const loggingMetaReducerFactory = (featureName: string | null = null): MetaReducer<any> => {
  featureName = featureName || 'root';
  return (reducer: ActionReducer<any>): ActionReducer<any> =>
    (state, action) => {
      console.log(`[${featureName}]`, 'action', action.type, action, 'state', state);
      return reducer(state, action);
    };
};
