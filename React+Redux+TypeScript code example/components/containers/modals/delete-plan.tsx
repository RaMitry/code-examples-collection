import * as React from 'react';
import { connect } from 'react-redux';
import { Dialog } from 'components/common';
import { deletePlans } from 'src/lib/actions/backend/plans-backend-actions';
import { closeDeletePlanWizard } from 'lib/actions';
import {IState} from 'lib/state';


export interface IDeletePlanWizardOwnProps {
  planId: number;
}

export interface IDeletePlanWizardStoreProps {
  planName: string;
}

export interface IDeletePlanWizardDispatchProps {
  onClose: () => void;
  onDeletePlan: (planId: number) => void;
}


export type IDeletePlanWizardProps = IDeletePlanWizardOwnProps & IDeletePlanWizardDispatchProps & IDeletePlanWizardStoreProps;



class DeletePlanWizardPure extends React.Component<IDeletePlanWizardProps> {

  constructor(props) {
    super(props);
  }

  onCancel = () => {
    this.props.onClose();
  }

  onDelete = () => {
    this.props.onDeletePlan(this.props.planId);
    this.props.onClose();
  }

  render() {

    const dialogTitle = 'Do you really want to delete "' + this.props.planName + '" plan?';

    return (
      <div>
        <Dialog
          open
          onRequestClose={this.onCancel}
          title={dialogTitle}
          actions={[
            <Dialog.CancelButton onClick={this.onCancel} />,
            <Dialog.ConfirmButton onClick={this.onDelete} label="Delete plan" />
          ]} />
      </div>
    );
  }
}

const mapStateToProps = (state: IState): IDeletePlanWizardStoreProps => {
  let planId = state.ui.modals.deletePlan.planId;
  return {
    planName: planId ? state.backend.allPlans.plans.find(p => p.id == planId).name : null
  };
};

const mapDispatchToProps = dispatch => {
  return {
    onClose: () => { dispatch(closeDeletePlanWizard()); },
    onDeletePlan: (planId: number) => { dispatch(deletePlans (planId)); }
  };
};

export const DeletePlanWizard = connect<any, IDeletePlanWizardDispatchProps, IDeletePlanWizardOwnProps>(mapStateToProps, mapDispatchToProps)(DeletePlanWizardPure);
