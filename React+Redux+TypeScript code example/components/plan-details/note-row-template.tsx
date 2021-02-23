import * as React from 'react';
import * as moment from 'moment';
import { connect } from 'react-redux';
import { ManagedIconMenu } from 'src/components/common';
import { ConfirmationDialog } from 'components/containers/modals/confirmation-dialog';
import { typography } from 'src/styles/typography';
import { thinBordersGreyColor } from 'src/styles/index';
import { classes, style } from 'typestyle';
import { IPlanTaskModel } from 'lib/client-models';
import { deletePlanTask } from 'lib/actions';

const noteListBlockClassName = style({
  cursor: 'pointer',
  display: 'flex',
  justifyContent: 'space-between',
  borderBottom: `1px solid ${thinBordersGreyColor}`,
  $nest: {
    '&:hover': {
      backgroundColor: '#F6F6F6',
      boxShadow: '0 0 3px 2px #edeaea'
    }
  }
});

const lastNoteListBlockClassName = style({
  cursor: 'pointer',
  display: 'flex',
  justifyContent: 'space-between',
  $nest: {
    '&:hover': {
      backgroundColor: '#F6F6F6',
      boxShadow: '0 0 3px 2px #edeaea'
    }
  }
});

const noteTextBlockClassName = style({
  padding: '20px 0 20px 10px',
  width: '100%'
});

const noteTextClassName = style({
  marginBottom: '6px'
});

const rightMenuClassName = style({
  alignSelf: 'center'
});

export interface INoteRowTemplateOwnProps {
  note: IPlanTaskModel;
  planId: number;
  creator: string;
  isLast: boolean;
  onEditClicked?: (note: IPlanTaskModel) => void;
}

export interface INoteRowTemplateDispatchProps {
  onDeleteNote: () => void;
}

export type INoteRowTemplateProps = INoteRowTemplateOwnProps & INoteRowTemplateDispatchProps;

export interface INoteRowTemplateState {
  isDeleteNoteConfirmationDialogOpen: boolean;
}

export class NoteRowTemplatePure extends React.PureComponent<INoteRowTemplateProps, INoteRowTemplateState> {

  componentWillMount() {
    this.setState({
      isDeleteNoteConfirmationDialogOpen: false
    });
  }

  private handleEdit = () => {
    this.props.onEditClicked(this.props.note);
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
    const { note, creator, isLast } = this.props;
    const noteBlockClassName = isLast
      ? lastNoteListBlockClassName
      : noteListBlockClassName;

    const dialogTitle = 'Do you really want to delete "' + this.props.note.value + '" note?';

    return (
      <div className={noteBlockClassName}>
        <div className={noteTextBlockClassName} onClick={this.handleEdit}>
          <div className={classes(typography.regularText, noteTextClassName)}>
            {note.value.split('\n').map((item, key) => {
              return <span key={key}>{item}<br/></span>;
            })}
          </div>
          <div className={typography.descriptionText}>
            {`${moment(note.createdOn).fromNow()}, by ${creator ? creator : ''}`}
          </div>
        </div>
        <div className={rightMenuClassName}>
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
          confirmButtonLabel="Delete note"
          onCancel={this.handleCloseConfirmationDialog}
          onConfirm={this.handleDialogConfirm}
          title={dialogTitle}/>
        }
      </div>
    );
  }
}

const mapDispatch = (dispatch, ownProps:INoteRowTemplateOwnProps) => {
  return {
    onDeleteNote: () => dispatch(deletePlanTask(ownProps.planId, ownProps.note.id))
  };
};

export const NoteRowTemplate = connect<{},INoteRowTemplateDispatchProps, INoteRowTemplateOwnProps>(null, mapDispatch)(NoteRowTemplatePure);
