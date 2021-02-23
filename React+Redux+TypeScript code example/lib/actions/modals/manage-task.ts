export const OPEN_TASK_FORM = 'openTaskForm';
export const CLOSE_TASK_FORM = 'closeTaskForm';

export const openTaskForm = (task) => ({
  type: OPEN_TASK_FORM,
  task
});

export const closeTaskForm = () => ({
  type: CLOSE_TASK_FORM
});
