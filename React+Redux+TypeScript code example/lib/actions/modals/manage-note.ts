export const OPEN_NOTE_FORM = 'openNoteForm';
export const CLOSE_NOTE_FORM = 'closeNoteForm';

export const openNoteForm = (note) => ({
  type: OPEN_NOTE_FORM,
  note
});

export const closeNoteForm = () => ({
  type: CLOSE_NOTE_FORM
});
