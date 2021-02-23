import * as React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { DateTimePicker, Dialog, TextField } from 'components/common';
import { IPlanTaskModel } from 'lib/client-models';
import { isOpenedTaskFormSelector } from 'lib/selectors/selectors-task-note-forms';
import {managedTaskSelector} from 'lib/selectors/selectors-task-note-forms';
import { closeTaskForm } from 'lib/actions';
import { createPlanTask, updatePlanTask } from 'lib/actions';
import { INITIAL_TASK } from 'lib/constants';

export interface ITaskFormOwnProps {
  planId: number;
}

export interface ITaskFormStateProps {
  title: string;
  open: boolean;
  task: IPlanTaskModel;
}

export interface ITaskFormDispatchProps {
  onClose: () => void;
  onCreate: (task:IPlanTaskModel) => void;
  onUpdate: (task:IPlanTaskModel) => void;
}

export type ITaskFormProps = ITaskFormOwnProps & ITaskFormStateProps & ITaskFormDispatchProps;

interface ITaskFormState {
  formValues: IPlanTaskModel;
}

export class TaskFormPure extends React.PureComponent<ITaskFormProps, ITaskFormState> {

  constructor (props) {
    super(props);

    this.state = {
      formValues: INITIAL_TASK
    };
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.task && (nextProps.task !== this.props.task)) {
      this.setState({
        formValues: nextProps.task
      });
    }
  }

  private onInputChange = (event, newValue) => this.onChange(event.target.name, newValue);
  private onDateTimeChange = (date) => {
    this.setState({
      formValues: {
        ...this.state.formValues,
        dueDate: date
      }
    });
  }

  private onChange = (key, value) => {
    this.setState({
      formValues: {
        ...this.state.formValues,
        [key]: value
      }
    });
  }

  private onSubmit = () => {
    if (this.state.formValues.id) {
      this.props.onClose();
      this.props.onUpdate(this.state.formValues);
    } else {
      this.props.onClose();
      this.props.onCreate(this.state.formValues);
      this.setState({
        formValues: INITIAL_TASK
      });
    }
  }

  render () {
    const { title, open, onClose } = this.props;
    const { formValues } = this.state;
    const dueDate = formValues.dueDate instanceof Date ? formValues.dueDate : new Date(formValues.dueDate);

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

        <DateTimePicker
          dateTime={dueDate}
          dateLabel="Due Date"
          timeLabel="Due Time"
          onChange={(date) => this.onDateTimeChange(date)}
        />
      </Dialog>
    );
  }
}

const mapStateToProps = (state):ITaskFormStateProps => {
  const task = managedTaskSelector(state);
  const open = isOpenedTaskFormSelector(state);
  const title = open && task.id ? 'Edit task' : 'Add task';

  return {
    title,
    open,
    task
  };
};

const mapDispatchToProps = (dispatch, ownProps):ITaskFormDispatchProps => ({
  onClose: bindActionCreators(closeTaskForm, dispatch),
  onCreate: (task:IPlanTaskModel) => dispatch(createPlanTask(ownProps.planId, task)),
  onUpdate: (task:IPlanTaskModel) => dispatch(updatePlanTask(ownProps.planId, task.id, task))
});


export const TaskForm = connect(mapStateToProps, mapDispatchToProps)(TaskFormPure);
