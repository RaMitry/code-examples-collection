import * as actions from 'lib/actions';
import { ITaskFormState } from 'lib/state';
import { INITIAL_TASK } from 'lib/constants';

const initialState:ITaskFormState = {
  open: false,
  task: INITIAL_TASK
};

export const taskFormReducer = (state = initialState, action) => {
  switch (action.type) {
    case actions.OPEN_TASK_FORM:
      return { ...state, open: true, task: action.task };

    case actions.CLOSE_TASK_FORM:
      return { ...state, open: false };
  }
  return state;
};
