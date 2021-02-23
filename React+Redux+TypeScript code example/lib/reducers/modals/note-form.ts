import * as actions from 'lib/actions';
import { INoteFormState } from 'lib/state';
import { INITIAL_NOTE } from 'lib/constants';

const initialState:INoteFormState = {
  open: false,
  note: INITIAL_NOTE
};

export const noteFormReducer = (state = initialState, action) => {
  switch (action.type) {
    case actions.OPEN_NOTE_FORM:
      return { ...state, open: true, note: action.note };

    case actions.CLOSE_NOTE_FORM:
      return { ...state, open: false };
  }
  return state;
};
