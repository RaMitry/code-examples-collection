import { IPlansBackendState, AsyncState } from 'lib/state/backend-state';
import * as actions from 'lib/actions';

const initialState: IPlansBackendState = {
  state: AsyncState.None,
  plans: [],
  operationPending: false
};

export const plansBackendReducer = (state = initialState, action): IPlansBackendState => {
  switch (action.type) {
    case actions.RELOAD_PLANS_BEGIN:
    case actions.CLONE_PLAN_BEGIN:
      return {
        ...state,
        state: AsyncState.Loading
      };
    case actions.CLONE_PLAN_END:
      return {
        ...state,
        operationPending: action.payload
      };
    case actions.RELOAD_PLANS_END:
      return {
        ...state,
        state: AsyncState.Loaded,
        plans: action.payload.sort((a, b) =>(b.id - a.id))
      };
    case actions.UPDATE_PLAN_BEGIN:
    case actions.UPDATE_PLAN_FAIL:
    case actions.UPDATE_PLAN_END:
      return {
        ...state,
        plans: state.plans.map(p => (p.id == action.payload.id) ? action.payload : p)
      };
    case actions.DELETE_PLAN_BEGIN:
      return {
        ...state
      };
    case actions.DELETE_PLAN_END:
      return {
        ...state,
        plans: state.plans.filter(p => p.id !== action.payload)
      };
  }
  return state;
};
