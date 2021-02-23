import * as React from 'react';
import { connect } from 'react-redux';
import { IPlanTaskModel, ICustomerModel, IUserModel } from 'lib/client-models';
import { openNoteForm } from 'lib/actions';
import { style, classes } from 'typestyle';
import { typography } from 'src/styles/typography';
import { INITIAL_NOTE } from 'lib/constants';
import { NoteRowTemplate } from './note-row-template';
import { NoteForm } from './note-form';
import { FlatButton, FontIcon, Panel, DataList } from 'components/common';
import { PlanTaskModelType } from 'lib/api';
import { deletePlanTask } from 'lib/actions';
import { planTasksSelector } from 'lib/selectors/selectors-plan-task';
import { customerFromPlanSelector } from 'lib/selectors/selectors-plan';
import { usersSelector } from 'lib/selectors/selectors-user';

const wrapperClassName = style({
  width: '50%',
  boxSizing: 'border-box',
  marginTop: '0',
  padding: '20px',
  position: 'relative',
});

const addNotesButtonClassName = style({
  position: 'absolute',
  right: '35px',
  top: '13px',
});

const notesListClassName = style({
  marginTop: '20px'
});

const notesHeaderClassName = style({
  fontWeight: 300,
  textAlign: 'center',
  width: '100%'
});

export interface INotesOwnProps {
  planId: number;
}

export interface INotesStoreProps {
  tasks: IPlanTaskModel[];
  customer: ICustomerModel;
  users: IUserModel[];
}

interface INotesDispatchProps {
  openNoteForm: (note: IPlanTaskModel) => void;
  deleteNote: (taskId: number) => void;
}

interface INotesState {
  notes: IPlanTaskModel[];
}

export type INotesProps = INotesOwnProps & INotesStoreProps & INotesDispatchProps;

export class NotesPure extends React.PureComponent<INotesProps, INotesState> {

  constructor(props) {
    super(props);
    this.state = {
      notes: [],
    };
  }

  fontIconElement = <FontIcon icon="add" />;

  componentWillReceiveProps(nextProps: INotesProps) {

    if (nextProps.tasks) {
      this.setState({
        notes: this.extractNotesFromTasks(nextProps.tasks)
      });
    }

  }

  extractNotesFromTasks = (tasks: IPlanTaskModel[]) => {
    return tasks.filter(task=>task.type === PlanTaskModelType.Note);
  }

  getCreatorName = (note: IPlanTaskModel) => {
    if(note.createdByUserId) {
      const creatorsArr = this.props.users.filter(u => u.id === note.createdByUserId);
      if(creatorsArr.length > 0 && creatorsArr[0].displayName) {
        return creatorsArr[0].displayName;
      } else {
        return 'Undefined';
      }
    } else {
      return 'Undefined';
    }
  }

  render() {

    const notesRowsData = this.state.notes.map((note, i, notes) => ({
      key: note.id,
      note: note,
      planId: this.props.planId,
      isLast: notes.length - 1 === i,
      creator: this.getCreatorName(note),
      onEditClicked: this.props.openNoteForm,
      onDeleteClicked: this.props.deleteNote
    }));

    return (
      <Panel className={wrapperClassName}>

          <div>
            <div className={classes(typography.formSectionTitleText, notesHeaderClassName)}>
              Notes ({this.state.notes.length})
            </div>
            <div className={addNotesButtonClassName}>
              <NoteForm planId={this.props.planId} />

              <FlatButton
                label="Add note"
                icon={this.fontIconElement}
                key="addNote"
                fullWidth={false}
                onClick={()=>this.props.openNoteForm(INITIAL_NOTE)}
                primary
              />

            </div>
          </div>

          <div className={notesListClassName}>
            <DataList
              rowTemplate={NoteRowTemplate}
              data={notesRowsData}
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
  openNoteForm: (note) => dispatch(openNoteForm(note)),
  deleteNote: (taskId: number) => dispatch(deletePlanTask(ownProps.planId, taskId))
});

export const Notes = connect(mapState, mapDispatch)(NotesPure);
