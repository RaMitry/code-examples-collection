import {
  FormMode, ICoords, ISVGSymbol, IDraft, PlanToolsMode,
  SymbolSize
} from 'lib/interfaces';
import { ICustomerModel, IPlanTaskModel } from 'lib/client-models';

export interface INoteFormState {
  open: boolean;
  note?: IPlanTaskModel;
}

export interface ITaskFormState {
  open: boolean;
  task?: IPlanTaskModel;
}

export interface INotesState {
  notes: IPlanTaskModel[];
  creators: ICustomerModel[];
}

export interface IAddPlanWizardState {
  open: boolean;
}

export interface IDeletePlanWizardState {
  open: boolean;
  planId: number;
  planName: string;
}

export interface IModalsState {
  addPlan: IAddPlanWizardState;
  deletePlan: IDeletePlanWizardState;
  noteForm: INoteFormState;
  taskForm: ITaskFormState;
}
