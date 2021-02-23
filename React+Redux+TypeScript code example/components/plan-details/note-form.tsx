import * as React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Dialog, TextField } from 'components/common';
import { IPlanTaskModel } from 'lib/client-models';
import { closeNoteForm } from 'lib/actions';
import { createPlanTask, updatePlanTask } from 'lib/actions';
import { INITIAL_NOTE } from 'lib/constants';
import { isOpenedNoteFormSelector } from 'lib/selectors/selectors-task-note-forms';
import { managedNoteSelector } from 'lib/selectors/selectors-task-note-forms';

export interface INoteFormOwnProps {
  planId: number;
}

export interface INoteFormStateProps {
  title: string;
  open: boolean;
  note: IPlanTaskModel;
}

export interface INoteFormDispatchProps {
  onClose: () => void;
  onCreate: (task:IPlanTaskModel) => void;
  onUpdate: (task:IPlanTaskModel) => void;
}

export type INoteFormProps = INoteFormOwnProps & INoteFormStateProps & INoteFormDispatchProps;

interface INoteFormState {
  formValues: IPlanTaskModel;
}

export class NoteFormPure extends React.PureComponent<INoteFormProps, INoteFormState> {

  constructor (props) {
    super(props);

    this.state = {
      formValues: INITIAL_NOTE
    };
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.note && (nextProps.note !== this.props.note)) {
      this.setState({
        formValues: nextProps.note
      });
    }
  }

  private onInputChange = (event, newValue) => this.onChange(event.target.name, newValue);

  private onChange = (key, value) => {
    this.setState({
      formValues: {
        ...this.state.formValues,
        [key]: value
      }
    });
  }

  private onSubmit = () => {
    if(this.state.formValues.id){
      this.props.onClose();
      this.props.onUpdate(this.state.formValues);
    } else {
      this.props.onClose();
      this.props.onCreate(this.state.formValues);
      this.setState({
        formValues: INITIAL_NOTE
      });
    }
  }

  render () {
    const { title, open, onClose } = this.props;
    const { formValues } = this.state;

    if (!open) {
      return (<span />);
    }

    return (
      <Dialog
        open={open}
        onRequestClose={onClose}
        autoScrollBodyContent
        title={title}
        actions={[
          <Dialog.CancelButton onClick={onClose} />,
          <Dialog.ConfirmButton label="Save" onClick={this.onSubmit} />
        ]}
      >
        <TextField
          autoSelect
          onChange={this.onInputChange}
          name="value"
          value={formValues.value}
          floatingLabelText="Description"
          floatingLabelFixed
          fullWidth
          rows={2}
          rowsMax={4}
          multiLine
        />
      </Dialog>
    );
  }
}

const mapStateToProps = (state, ownProps):INoteFormStateProps => {
  const note = managedNoteSelector(state);
  const open = isOpenedNoteFormSelector(state);
  const title = open && note.id ? 'Edit note' : 'Add Note';

  return {
    title,
    open,
    note
  };
};

const mapDispatchToProps = (dispatch, ownProps):INoteFormDispatchProps => ({
  onClose: bindActionCreators(closeNoteForm, dispatch),
  onCreate: (task:IPlanTaskModel) => dispatch(createPlanTask(ownProps.planId, task)),
  onUpdate: (task:IPlanTaskModel) => dispatch(updatePlanTask(ownProps.planId, task.id, task))
});


export const NoteForm = connect(mapStateToProps, mapDispatchToProps)(NoteFormPure);
