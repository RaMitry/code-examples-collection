import { IPlanTaskModel } from 'lib/client-models';
import { PlanTaskModelType } from 'lib/api';


export const INITIAL_NOTE: IPlanTaskModel = {
  id: undefined,
  order: 1,
  value: '',
  createdByUserId: '',
  createdOn: new Date(),
  type: PlanTaskModelType.Note
};

export const INITIAL_TASK: IPlanTaskModel = {
  id: undefined,
  order: 1,
  value: '',
  createdByUserId: '',
  createdOn: new Date(),
  dueDate: new Date(),
  type: PlanTaskModelType.Task
};
