import { createAction } from 'redux-actions';

export const OPEN_DELETE_PLAN_WIZARD = 'openPlanWizardClose';
export const CLOSE_DELETE_PLAN_WIZARD = 'deletePlanWizardClose';


export const openDeletePlanWizard = createAction(OPEN_DELETE_PLAN_WIZARD, (planId: number, planName: string) => { return { planId: planId, planName: planName }; });
export const closeDeletePlanWizard = createAction(CLOSE_DELETE_PLAN_WIZARD);

