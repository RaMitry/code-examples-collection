import { createAction } from 'redux-actions';

export const OPEN_ADD_PLAN_WIZARD = 'modals_addPlan_openAddPlanWizard';
export const CLOSE_ADD_PLAN_WIZARD = 'modals_addPlan_closeAddPlanWizard';

export const openAddPlanfWizard = createAction(OPEN_ADD_PLAN_WIZARD);
export const closeAddPlanWizard = createAction(CLOSE_ADD_PLAN_WIZARD);
