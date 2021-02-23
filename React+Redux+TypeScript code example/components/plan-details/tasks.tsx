import * as React from 'react';
import { connect } from 'react-redux';
import { IPlanTaskModel, ICustomerModel, IUserModel } from 'lib/client-models';
import { customerFromPlanSelector } from 'lib/selectors/selectors-plan';
import { usersSelector } from 'lib/selectors/selectors-user';
import { openTaskForm } from 'lib/actions';
import { style, classes } from 'typestyle';
import { typography } from 'src/styles/typography';
import { INITIAL_TASK } from 'lib/constants';
import { TaskRowTemplate } from './task-row-template';
import { TaskForm } from './task-form';
import { FlatButton, FontIcon, Panel, DataList } from 'components/common';
import { PlanTaskModelType } from 'lib/api';
import { deletePlanTask } from 'lib/actions';
import { planTasksSelector } from 'lib/selectors/selectors-plan-task';

const wrapperClassName = style({
  width: '25%',
  boxSizing: 'border-box',
  marginTop: '0',
  padding: '20px',
  position: 'relative',
});

const addTaskButtonClassName = style({
  position: 'absolute',
  right: '35px',
  top: '13px',
});

const tasksListClassName = style({
  marginTop: '20px'
});

const tasksHeaderClassName = style({
  fontWeight: 300,
  width: '100%'
});

export interface ITasksOwnProps {
  planId: number;
}

export interface ITasksStoreProps {
  tasks: IPlanTaskModel[];
  customer: ICustomerModel;
  users: IUserModel[];
}

interface ITasksDispatchProps {
  openTaskForm: (task: IPlanTaskModel) => void;
  deleteTask: (taskId: number) => void;
}

interface ITasksState {
  tasks: IPlanTaskModel[];
}

export type ITasksProps = ITasksOwnProps & ITasksStoreProps & ITasksDispatchProps;

export class TasksPure extends React.PureComponent<ITasksProps, ITasksState> {

  constructor(props) {
    super(props);
    this.state = {
      tasks: [],
    };
  }

  fontIconElement = <FontIcon icon="add" />;

  componentWillReceiveProps(nextProps: ITasksProps) {

    if (nextProps.tasks) {
      this.setState({
        tasks: this.extractTaskFrom(nextProps.tasks)
      });
    }

  }

  extractTaskFrom = (tasks: IPlanTaskModel[]) => {
    return tasks.filter(task=>task.type === PlanTaskModelType.Task);
  }

  getCreatorName = (task: IPlanTaskModel) => {
    if (task.createdByUserId) {
      const creatorsArr = this.props.users.filter(u => u.id === task.createdByUserId);
      if (creatorsArr.length > 0 && creatorsArr[0].displayName) {
        return creatorsArr[0].displayName;
      } else {
        return 'Undefined';
      }
    } else {
      return 'Undefined';
    }
  }

  render() {

    const tasksRowsData = this.state.tasks.map((task, i, tasks) => ({
      key: task.id,
      task: task,
      planId: this.props.planId,
      isLast: tasks.length - 1 === i,
      creator: this.getCreatorName(task),
      onEditClicked: this.props.openTaskForm,
      onDeleteClicked: this.props.deleteTask
    }));

    return (
      <Panel className={wrapperClassName}>

          <div>
            <div className={classes(typography.formSectionTitleText, tasksHeaderClassName)}>
              Tasks ({this.state.tasks.length})
            </div>
            <div className={addTaskButtonClassName}>
              <TaskForm planId={this.props.planId} />

              <FlatButton
                label="Add task"
                icon={this.fontIconElement}
                key="addTask"
                fullWidth={false}
                onClick={()=>this.props.openTaskForm(INITIAL_TASK)}
                primary
              />

            </div>
          </div>

          <div className={tasksListClassName}>
            <DataList
              rowTemplate={TaskRowTemplate}
              data={tasksRowsData}
            />
          </div>

      </Panel>
    );

  }
}

const mapState = (state, ownProps) => ({
  tasks: planTasksSelector(state),
  customer: customerFromPlanSelector(state, ownProps),
  users: usersSelector(state)
});

const mapDispatch = (dispatch, ownProps) => ({
  openTaskForm: (task) => dispatch(openTaskForm(task)),
  deleteTask: (taskId: number) => dispatch(deletePlanTask(ownProps.planId, taskId))
});

export const Tasks = connect(mapState, mapDispatch)(TasksPure);
