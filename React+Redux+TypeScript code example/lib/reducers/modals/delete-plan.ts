import * as actions from 'lib/actions/modals/delete-plan';

export const initialState = {
  open: false
};

export const deletePlanReducer = (state = initialState, action) => {
  switch (action.type) {
    case actions.OPEN_DELETE_PLAN_WIZARD:
      return { ...state, open: true, planId: action.payload.planId, planName: action.payload.planName };
    case actions.CLOSE_DELETE_PLAN_WIZARD:
      return { ...state, open: false };
  }
  return state;
};
