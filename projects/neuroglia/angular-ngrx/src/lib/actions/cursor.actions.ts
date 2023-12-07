import { createAction, props } from '@ngrx/store';

const CHANGE_CURSOR = '[App] Change cursor';

const changeCursor = createAction(CHANGE_CURSOR, props<{ cursor: string }>());

export const CursorActions = {
  changeCursor,
};
