import * as actions from 'lib/actions/modals/add-plan';

export const initialState = {
  open: false
};

export const addPlanReducer = (state = initialState, action) => {
  switch (action.type) {
    case actions.OPEN_ADD_PLAN_WIZARD:
      return { ...state, open: true };
    case actions.CLOSE_ADD_PLAN_WIZARD:
      return { ...state, open: false };
  }
  return state;
};
