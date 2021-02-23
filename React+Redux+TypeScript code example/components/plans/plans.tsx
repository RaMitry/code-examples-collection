import * as React from 'react';
import { connect } from 'react-redux';
import { AsyncState, IState } from 'lib/state';
import {
  loadCompanyIfNeeded,
  loadCurrentUserIfNeeded,
  loadPlansIfNeeded,
  loadTutorialActionsIfNeeded,
  loadUsersIfNeeded,
  updateCurrentUser
} from 'lib/actions';
import { NotificationBar, RefreshIndicator } from 'components/common';
import { ICompanyModel, IPlanModel, ITutorialActionModel } from 'lib/client-models';
import { Tutorial } from './components/tutorial';
import { PlanList } from './components/plan-list';
import { UiBlocker } from 'components/containers/modals/ui-blocker';
import { DeletePlanWizard } from 'components/containers/modals';
import { style } from 'typestyle';
import { Tooltip } from 'components/common/tooltip';
import { DragDropContext } from 'react-dnd';
import { withDragDropContext } from 'lib/with-drag-drop-context';

export const plansFullheightStyle = style({
  height: '100%',
  $nest: {
    '&>div': {
      height: '100%',
      display: 'flex',
      flexDirection: 'row'
    }
  }

});

interface IPlansComponentProps {
  loading?: boolean;
  loadDataIfNeeded?: () => void;
  setTutorialVisibility?: (visibility: boolean) => void;
  company?: ICompanyModel;
  plans?: IPlanModel[];
  tutorialActions?: ITutorialActionModel[];
  errorMessage?: string;
  showTutorial?: boolean;
  deletePlanWizardOpened?: boolean;
  deletePlanWizardplanId?: number;
  deletePlanWizardplanName?: string;
}

class PlansComponent extends React.Component<IPlansComponentProps> {

  componentWillMount() {
    this.props.loadDataIfNeeded();
  }

  componentWillReceiveProps() {
    this.props.loadDataIfNeeded();
  }

  onTutorialsClose = () => {
    this.props.setTutorialVisibility(false);
  }

  render() {

    if (this.props.loading) {
      return <RefreshIndicator left={0} top={100} status="loading" />;
    }

    return (
      <div className={plansFullheightStyle}>
        <div>
          <PlanList company={this.props.company} plans={this.props.plans}/>
          {
            this.props.showTutorial &&
            <Tutorial tutorialActions={this.props.tutorialActions} onClose={this.onTutorialsClose}/>
          }
          <Tooltip effect="float"/>
        </div>
        {
          this.props.deletePlanWizardOpened && <DeletePlanWizard
            planId={this.props.deletePlanWizardplanId}/>
        }
        {
          this.props.errorMessage &&
          <UiBlocker wholePage>
            <NotificationBar message={this.props.errorMessage} />
          </UiBlocker>
        }
      </div>
    );

  }

}

const DragAndDropPlans = withDragDropContext(PlansComponent);

const mapStateToProps = (state: IState): IPlansComponentProps => {
  return {
    company: state.backend.company.company,
    plans: state.backend.allPlans.plans,
    tutorialActions: state.backend.tutorial.actions,
    deletePlanWizardOpened: state.ui.modals.deletePlan.open,
    deletePlanWizardplanId: state.ui.modals.deletePlan.planId,
    deletePlanWizardplanName: state.ui.modals.deletePlan.planName,
    errorMessage: state.errors.length ? state.errors[0].message : undefined,
    loading: (state.backend.allPlans.state !== AsyncState.Loaded)
    || (state.backend.company.state !== AsyncState.Loaded)
    || (state.backend.tutorial.state !== AsyncState.Loaded)
    || (state.backend.allPlans.operationPending)
    || (state.backend.users.state !== AsyncState.Loaded),
    showTutorial: state.backend.currentUser.user ? state.backend.currentUser.user.settings.tutorialVisible : true
  };
};

const mapDispatchToProps = (dispatch): IPlansComponentProps => {
  return {
    loadDataIfNeeded: () => {
      dispatch(loadPlansIfNeeded());
      dispatch(loadCompanyIfNeeded());
      dispatch(loadTutorialActionsIfNeeded());
      dispatch(loadCurrentUserIfNeeded());
      dispatch(loadUsersIfNeeded());
    },
    setTutorialVisibility: (visibility: boolean) => {
      dispatch(updateCurrentUser({
        settings: {
          tutorialVisible: visibility
        }
      }));
    }
  };
};

export const Plans = connect(mapStateToProps, mapDispatchToProps)(DragAndDropPlans);
