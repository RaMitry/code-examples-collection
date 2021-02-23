import { IState } from 'lib/state';

export const isOpenedNoteFormSelector = (state:IState) => state.ui.modals.noteForm.open;
export const managedNoteSelector = (state:IState) => state.ui.modals.noteForm.note;

export const isOpenedTaskFormSelector = (state:IState) => state.ui.modals.taskForm.open;
export const managedTaskSelector = (state:IState) => state.ui.modals.taskForm.task;
