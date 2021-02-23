import * as React from 'react';
import * as moment from 'moment';
import { connect } from 'react-redux';
import { ManagedIconMenu, FontIcon } from 'src/components/common';
import { ConfirmationDialog } from 'components/containers/modals/confirmation-dialog';
import { typography } from 'src/styles/typography';
import { delayedStatusBgColor } from 'src/styles/index';
import { thinBordersGreyColor } from 'src/styles/index';
import { classes, style } from 'typestyle';
import { IPlanTaskModel } from 'lib/client-models';
import { deletePlanTask } from 'lib/actions';
import { calculateDaysLeft } from 'lib/util';

const taskListBlockClassName = style({
  cursor: 'pointer',
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  borderBottom: `1px solid ${thinBordersGreyColor}`,
  $nest: {
    '&:hover': {
      backgroundColor: '#F6F6F6',
      boxShadow: '0 0 3px 2px #edeaea'
    }
  }
});

const lastTaskListBlockClassName = style({
  cursor: 'pointer',
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  $nest: {
    '&:hover': {
      backgroundColor: '#F6F6F6',
      boxShadow: '0 0 3px 2px #edeaea'
    }
  }
});

const taskTextBlockClassName = style({
  padding: '20px 0 20px 7px',
  width: '100%'
});

const taskDataClassName = style({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'flex-end'
});

const taskDaysLeftBlockClassName = style({
  display: 'flex',
  alignItems: 'flex-end'
});

const taskDaysLeftTextClassName = style({
  fontWeight: 'bold',
  marginRight: '8px'
});

const taskRightMenuClassName = style({
  alignSelf: 'center'
});

export interface ITaskRowTemplateOwnProps {
  task: IPlanTaskModel;
  planId: number;
  creator: string;
  isLast: boolean;
  onEditClicked?: (note: IPlanTaskModel) => void;
}

export interface ITaskRowTemplateDispatchProps {
  onDeleteNote: () => void;
}

export type ITaskRowTemplateProps = ITaskRowTemplateOwnProps & ITaskRowTemplateDispatchProps;

export interface ITaskRowTemplateState {
  isDeleteNoteConfirmationDialogOpen: boolean;
}

export class TaskRowTemplatePure extends React.PureComponent<ITaskRowTemplateProps, ITaskRowTemplateState> {

  componentWillMount() {
    this.setState({
      isDeleteNoteConfirmationDialogOpen: false
    });
  }

  private handleEdit = () => {
    this.props.onEditClicked(this.props.task);
  }

  handleOpenDeleteNoteConfirmationDialog = () => {
    this.setState({
      isDeleteNoteConfirmationDialogOpen: true
    });
  }

  handleCloseConfirmationDialog = () => {
    this.setState({
      isDeleteNoteConfirmationDialogOpen: false
    });
  }

  handleDialogConfirm = () => {
    this.props.onDeleteNote();
    this.handleCloseConfirmationDialog();
  }

  render () {
    const { task, creator, isLast } = this.props;
    const taskBlockClassName = isLast
      ? lastTaskListBlockClassName
      : taskListBlockClassName;

    const daysLeft = calculateDaysLeft(task);
    const dialogTitle = `Do you really want to delete "${task.value}" task?`;

    return (
      <div className={taskBlockClassName}>
        <div>
          <FontIcon icon="flag" color={delayedStatusBgColor}/>
        </div>
        <div className={taskTextBlockClassName} onClick={this.handleEdit}>
          <div className={typography.regularText}>
            {task.value.split('\n').map((item, key) => {
              return <span key={key}>{item}<br/></span>;
            })}
          </div>
          <div className={taskDataClassName}>
            <div className={typography.descriptionText}>
              {`${moment(task.createdOn).fromNow()}, by ${creator ? creator : ''}`}
            </div>
            <div className={taskDaysLeftBlockClassName}>
              <div className={classes(typography.emphasizedSmallText, taskDaysLeftTextClassName)}>{daysLeft.date}</div>
              <FontIcon style={daysLeft.color} icon="insert_invitation" size="xsmall"/>
            </div>
          </div>
        </div>
        <div className={taskRightMenuClassName}>
          <ManagedIconMenu
            items={[
              {
                icon: 'edit',
                label: 'edit',
                onClick: this.handleEdit
              },
              {
                isDivider: true
              },
              {
                icon: 'delete',
                label: 'delete',
                onClick: this.handleOpenDeleteNoteConfirmationDialog
              }
            ]}/>
        </div>
        {this.state.isDeleteNoteConfirmationDialogOpen &&
        <ConfirmationDialog
          confirmButtonLabel="Delete task"
          onCancel={this.handleCloseConfirmationDialog}
          onConfirm={this.handleDialogConfirm}
          title={dialogTitle}/>
        }
      </div>
    );
  }
}

const mapDispatch = (dispatch, ownProps:ITaskRowTemplateOwnProps) => {
  return {
    onDeleteNote: () => dispatch(deletePlanTask(ownProps.planId, ownProps.task.id))
  };
};

export const TaskRowTemplate = connect<{},ITaskRowTemplateDispatchProps, ITaskRowTemplateOwnProps>(null, mapDispatch)(TaskRowTemplatePure);
