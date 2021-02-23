import { createAction } from 'redux-actions';
import { IState } from 'lib/state';
import { AsyncState } from 'lib/state';
import { IPlanModel } from 'lib/client-models';
import * as api from 'lib/api';
import * as toastr from 'toastr';
import * as _ from 'lodash';
import { planSelector } from 'lib/selectors/selectors-plan';
import { customerSelector } from 'lib/selectors/selectors-customer';

export const RELOAD_PLANS_BEGIN = 'Plans_Reload_Begin';
export const RELOAD_PLANS_END = 'Plans_Reload_End';
export const RELOAD_PLANS_FAIL = 'Plans_Reload_Fail';

export const DELETE_PLAN_BEGIN = 'Plans_Delete_Begin';
export const DELETE_PLAN_END = 'Plans_Delete_End';
export const DELETE_PLAN_FAIL = 'Plans_Delete_Fail';

export const UPDATE_PLAN_BEGIN = 'Plans_Update_Begin';
export const UPDATE_PLAN_END = 'Plans_Update_End';
export const UPDATE_PLAN_FAIL = 'Projcets_Update_Fail';

export const CLONE_PLAN_FAIL = 'Plans_Clone_Fail';
export const CLONE_PLAN_BEGIN = 'Plans_Clone_Begin';
export const CLONE_PLAN_END = 'Plans_Clone_End';

export const OPEN_PLAN_FAIL = 'Plans_Open_Fail';

const loadPlansBegin = createAction(RELOAD_PLANS_BEGIN);
const loadPlansEnd = createAction<IPlanModel[]>(RELOAD_PLANS_END);
const loadPlansFail = createAction<any>(RELOAD_PLANS_FAIL);

const deletePlanBegin = createAction<number>(DELETE_PLAN_BEGIN);
const deletePlanEnd = createAction<number>(DELETE_PLAN_END);
const deletePlanFail = createAction<number>(DELETE_PLAN_FAIL);

const updatePlanBegin = createAction<IPlanModel>(UPDATE_PLAN_BEGIN);
const updatePlanEnd = createAction<IPlanModel>(UPDATE_PLAN_END);
const updatePlanFail = createAction<IPlanModel>(UPDATE_PLAN_FAIL);

const clonePlanBegin = createAction(CLONE_PLAN_BEGIN);
const clonePlanEnd = createAction<boolean>(CLONE_PLAN_END);
const clonePlanFail = createAction<number>(CLONE_PLAN_FAIL);


const openPlanFail = createAction<number>(OPEN_PLAN_FAIL);

const mapCtoS = api.Mapping.clientPlanToServerPlan;
const mapStoC = api.Mapping.serverPlanToClientPlan;

export const loadPlansIfNeeded = () => (dispatch, getState) => {
  if ((getState() as IState).backend.allPlans.state === AsyncState.None) {
    dispatch(loadPlansBegin());
    new api.PlanApi()
      .apiPlanGet()
      .then(d => dispatch(loadPlansEnd(d.map(p => mapStoC(p)))))
      .catch(async e => {
        dispatch(loadPlansFail(e));
        console.error(e);
        toastr.error((await e.json()).message);
      });
  }
};

export const deletePlans = (planId: number) => (dispatch) => {
  dispatch(deletePlanBegin(planId));
  new api.PlanApi()
    .apiPlanByPlanIdDelete({ planId: planId })
    .then(d => dispatch(deletePlanEnd(planId)))
    .catch(async e => {
      //dispatch(deletePlanFail(planId)); ->NOTE: This line is for show page blocking NotificationBar
      toastr.error((await e.json()).message);
    });
};

export const updatePlan = (patch: Partial<IPlanModel>) => (dispatch, getState) => {
  let _patch = {...patch};
  const state = getState();
  const planId = _patch.id;
  const originalPlan = planSelector(state, { planId });
  if ((_patch.customerId) && (!_patch.addressId) && (_patch.customerId !== originalPlan.customerId)) {
    const customer = customerSelector(state, { id: _patch.customerId });
    _patch.addressId = (customer) ? customer.defaultAddress.id : null;
  }
  else if (_patch.customerId === null) {
    _patch.addressId = null;
  }

  _patch.lastModifiedByUserOn = new Date();
  const updatedPlan = _.merge({}, originalPlan, _patch);

  dispatch(updatePlanBegin(updatedPlan));
  new api.PlanApi()
    .apiPlanByPlanIdPatch({
      planId,
      patchModel: api.Mapping.clientPlanToServerPlan(_patch)
    })
    .then(p => dispatch(updatePlanEnd(mapStoC(p))))
    .catch(async e => {
      dispatch(updatePlanFail(originalPlan));
      toastr.error((await e.json()).message);
    });
};

export const clonePlans = (planId: number) => (dispatch) => {
  dispatch(clonePlanBegin());
  new api.PlanApi()
    .apiPlanByPlanIdClonePost({ planId: planId })
    .then(d => {
      dispatch(clonePlanEnd(false));
      window.location.href = '/Plans/Details/' + d.id;
    })
    .catch(async e => {
      dispatch(clonePlanEnd(true));
      //dispatch(clonePlanFail(planId)); ->NOTE: This line is for show page blocking NotificationBar
      toastr.error((await e.json()).message);
    });
};

export const openPlan = (planId: number) => (dispatch) => {
  window.location.href = '/Plans/Details/' + String(planId);
};
