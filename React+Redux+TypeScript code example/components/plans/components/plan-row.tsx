import * as React from 'react';
import * as _ from 'lodash';
import { IState } from 'lib/state';
import { connect } from 'react-redux';
import { IPlanModel, IUserModel } from 'lib/client-models';
import { clonePlans, openPlan } from 'src/lib/actions/backend/plans-backend-actions';
import { ManagedIconMenu, FontIcon } from 'components/common';
import { openDeletePlanWizard, updatePlan } from 'lib/actions';
import { PlanStatusSwitcher } from './plan-status-switcher';
import { IPlansTabLabelProps } from './plan-tab-label';
import { ConfirmationDialog } from 'components/containers/modals/confirmation-dialog';
import * as moment from 'moment';
import { classes, style } from 'typestyle';
import { DragSource } from 'react-dnd';
import { planSelector, evaluatorFromPlanSelector } from 'lib/selectors/selectors-plan';
import { calculateDaysLeft } from 'lib/util';

const plansListItemStyle = style({

  borderBottom: '1px solid #dddbdb',
  marginRight: '8px',
  height: '70px',
  $nest: {
    '&:hover': {
      backgroundColor: '#F6F6F6',
      boxShadow: '0 0 3px 2px #edeaea'
    },

    '&>div': {
      display: 'flex',
      alignItems: 'center',
      padding: '0 5px',
      transition: '.2s',
      width: '100%',
      overflow: 'hidden',

      '& .selected': {
        backgroundColor: '#E5F1FF'
      },

      '& .hidden': {
        opacity: '.2'
      }

    }
  }

});

const planItemContentStyle = style({
  flexGrow: 1,
  marginLeft: '15px',
  overflow: 'hidden',
  minHeight: '68px'
});

const planItemLinkStyle = style({
  textDecoration: 'none',
  display: 'flex',
  alignItems: 'center',
  minHeight: '68px'
});

const planItemCenterStyle = style({
  flexGrow: 1,
  width: '100%'
});

const planItemTitleStyle = style({
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
  overflow: 'hidden',
  fontSize: '15px',
  color: '#006bf7',
  marginBottom: '5px'
});

const planItemTextStyle = style({
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
  overflow: 'hidden',
  fontSize: '12px',
  color: '#7F7F7F',
  paddingRight: '50px'
});

const planInfoBlockStyle = style({
  display: 'flex',
  flexDirection: 'column'
});

const planInfoIconTextStyle = style({
  display: 'inline-flex',
  alignItems: 'center',
  lineHeight: '28px'
});

const planEvaluatorNameTextStyle = style({
  width: '75px',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
  overflow: 'hidden'
});

const planLeftTimeStatusStyle = style({
  display: 'flex',
  flexDirection: 'column',
  marginLeft: '30px'
});

const planLeftTimeIconTextStyle = style({
  display: 'inline-flex',
  alignItems: 'center',
  marginTop: '3px'
});

const planInfoTextStyle = style({
  fontSize: '11px',
  paddingLeft: '4px'
});

const planCostsTextStyle = style({
  fontSize: '14px',
  fontWeight: 500,
  paddingLeft: '4px'
});

const planCreatedDateStyle = style({
  opacity: 0.5,
  color: '#000000',
  fontSize: '11px',
  width: '78px',
  marginLeft: '23px'
});

const isDraggingStyle = style({
  opacity: .4
});

export const dragPlanItem = 'plan';

export interface IPlanRowOwnProps {
  planId: number;
  connectDragSource?: (jsx) => any;
  isDragging?: boolean;
}

export interface IPlanRowStoreProps {
  plan: IPlanModel;
  evaluator?: IUserModel;
}

export interface IPlanRowDispatchProps {
  onClonePlan: () => void;
  onOpenDeletePlanWizard: (planName: string) => void;
  onChangeArchivePlanStatus: (archived: boolean) => void;
  onOpenPlan: () => void;
  onUpdatePlan: (patch: Partial<IPlanModel>) => void;
}

export interface IPlanRowState {
  isArchivePlanConfirmationDialogOpen: boolean;
}

type IPlanRowProps = IPlanRowOwnProps & IPlanRowStoreProps & IPlanRowDispatchProps;

class PlanRowPure extends React.Component<IPlanRowProps, IPlanRowState> {

  state = {
    isArchivePlanConfirmationDialogOpen: false
  };

  handleOnOpenPlanRequest = (e) => {
    this.props.onOpenPlan();
  }

  handleStatusChange = (newStatus) => {
    this.props.onUpdatePlan({ status: newStatus });
  }

  handleOpenDeletePlanWizard = () => {
    this.props.onOpenDeletePlanWizard(this.props.plan.name);
  }

  handleOpenArchivePlanConfirmationDialog = () => {
    this.setState({
      isArchivePlanConfirmationDialogOpen: true
    });
  }

  handleCloseConfirmationDialog = () => {
    this.setState({
      isArchivePlanConfirmationDialogOpen: false
    });
  }

  handleConfirmArchivePlan = () => {
    this.props.onChangeArchivePlanStatus(!this.props.plan.archived);
    this.handleCloseConfirmationDialog();
  }

  calculateCreatedDaysAgo = () => {
    if (_.isNil(this.props.plan.createdOn)) {
      return '';
    }

    const createdDaysAgo = moment(this.props.plan.createdOn).local().fromNow();

    return createdDaysAgo && createdDaysAgo || 'Wrong Creation Date';

  }

  render() {

    const { plan, connectDragSource, isDragging } = this.props;

    const planDueDate = _.isNil(plan.dueDate)
      ? 'Due Date not specified'
      : 'Plan due date: ' + moment(new Date(plan.dueDate)).format('llll');

    const planDetails = '/Plans/Details/' + plan.id;

    const nameAndDescription = (
      <div className={planItemCenterStyle}>
        <div className={planItemTitleStyle}>
          {plan.name}
        </div>
        <div className={planItemTextStyle}>
          {plan.description}
        </div>
      </div>
    );

    const planTotalCost = Math.round(plan.costs.total).toLocaleString('en-US');

    const evaluatorName = this.props.evaluator && this.props.evaluator.displayName || 'Not Assigned';

    const evaluatorTooltip = 'evaluator: ' + evaluatorName;

    const archivedLabel = plan.archived ? 'Restore plan' : 'Archive plan';

    const archivedIcon = plan.archived ? 'restore_page' : 'delete';

    const titleAction = plan.archived ? 'restore "' : 'archive "';

    const dialogTitle = 'Do you really want to ' + titleAction + plan.name + '" plan?';

    const daysLeft = calculateDaysLeft(this.props.plan);

    return connectDragSource(
      <div className={classes(plansListItemStyle, isDragging ? isDraggingStyle : '')}>

        <div>
          <div className={planItemContentStyle}>
            <a href={planDetails}
               onClick={this.handleOnOpenPlanRequest}
               className={planItemLinkStyle}
               style={{ cursor: 'pointer' }}
            >
              {nameAndDescription}
            </a>
          </div>

          <div className={planInfoBlockStyle}>
            <div data-tip="Total cost" className={planInfoIconTextStyle}>
              <FontIcon style={{ color: '#CBCBCB' }} icon="attach_money"/>
              <div className={planCostsTextStyle}>{planTotalCost}</div>
            </div>
            <div data-tip={evaluatorTooltip} className={planInfoIconTextStyle}>
              <FontIcon style={{ color: '#CBCBCB' }} icon="assignment_ind"/>
              <div className={classes(planInfoTextStyle, planEvaluatorNameTextStyle)}>{evaluatorName}</div>
            </div>
          </div>

          <div className={planLeftTimeStatusStyle}>
            <div data-tip={planDueDate}
                 className={planLeftTimeIconTextStyle}>
              <FontIcon style={daysLeft.color} icon="insert_invitation"/>
              <div className={planInfoTextStyle}>{daysLeft.date}</div>
            </div>
            <div>
              <PlanStatusSwitcher status={plan.status} onChange={this.handleStatusChange}/>
            </div>
          </div>

          <div>
            <div data-tip={'Plan created: ' + moment(plan.createdOn).calendar()}
                 className={planCreatedDateStyle}>
              {this.calculateCreatedDaysAgo()}
            </div>
          </div>

          <div>
            <ManagedIconMenu
              useLayerForClickAway={true}
              items={[
                {
                  icon: 'content_copy',
                  label: 'clone plan',
                  onClick: this.props.onClonePlan
                },
                {
                  icon: archivedIcon,
                  label: archivedLabel,
                  onClick: this.handleOpenArchivePlanConfirmationDialog
                },
                {
                  isDivider: true
                },
                {
                  icon: 'delete_forever',
                  label: 'delete plan',
                  onClick: this.handleOpenDeletePlanWizard
                }
              ]}/>
          </div>
        </div>
        {this.state.isArchivePlanConfirmationDialogOpen &&
        <ConfirmationDialog
          confirmButtonLabel={archivedLabel}
          onCancel={this.handleCloseConfirmationDialog}
          onConfirm={this.handleConfirmArchivePlan}
          title={dialogTitle}/>
        }
      </div>
    );
  }
}


/****************************************************************************
 * DRAG'N'DROP
 ****************************************************************************/

const dragSource = {
  beginDrag(props: IPlanRowProps) {
    return {
      id: props.planId,
      status: props.plan.status
    };
  },

  endDrag(props: IPlanRowProps, monitor, component) {
    const dropResult: IPlansTabLabelProps = monitor.getDropResult();
    if(!dropResult) return;
    props.onUpdatePlan(dropResult.onDropPatch);
  }
};

const dragSourceCollect = (connect, monitor) => {
  return {
    connectDragSource: connect.dragSource(),
    isDragging: monitor.isDragging()
  };
};

const DragPlanRow = DragSource(dragPlanItem, dragSource, dragSourceCollect)(PlanRowPure);

/****************************************************************************
 * End of DRAG'N'DROP
 ****************************************************************************/

const mapStateToProps = (state: IState, ownProps) => {
  return {
    plan: planSelector(state, ownProps),
    evaluator: evaluatorFromPlanSelector(state, ownProps)
  };
};

const mapDispatchToProps = (dispatch, ownProps: IPlanRowOwnProps) => {
  return {
    onOpenDeletePlanWizard: (planName) => dispatch(openDeletePlanWizard(ownProps.planId, planName)),
    onChangeArchivePlanStatus: (archived) => dispatch(updatePlan({ id: ownProps.planId, archived })),
    onClonePlan: () => dispatch(clonePlans(ownProps.planId)),
    onOpenPlan: () => dispatch(openPlan(ownProps.planId)),
    onUpdatePlan: (patch: Partial<IPlanModel>) => dispatch(updatePlan({ id: ownProps.planId, ...patch }))
  };
};

export const PlanRow = connect(mapStateToProps, mapDispatchToProps)(DragPlanRow);

