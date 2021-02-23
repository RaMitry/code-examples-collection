import * as React from 'react';
import { FontIcon, RaisedButton } from 'components/common';
import { SearchBox } from 'components/common/search-box';
import { ICompanyModel, IPlanModel } from 'lib/client-models';
import * as api from 'lib/api';
import { style } from 'typestyle';
import { IPlansTabModel, PlansTabs } from './plans-tabs';
import * as _ from 'lodash';

const plansMainPanelStyle = style({
  padding: '10px',
  boxShadow: '1px 0 5px 0 rgba(51,51,51,0.3)',
  zIndex: 10,
  display: 'flex',
  flexDirection: 'column',
  width: '100%'
});

const plansAddPlansBlockStyle = style({
  display: 'flex',
  flexDirection: 'column',
  width: '100%',
  height: '85%',
  alignItems: 'center',
  justifyContent: 'center'
});

const plansTopDivStyle = style({
  position: 'relative'
});

const plansAddBtnDivStyle = style({
  position: 'absolute',
  top: '10px',
  left: '10px',
  boxShadow: '0 2px 2px 0 rgba(51,51,51,0.3)'
});

const plansEmptyAddBtnDivStyle = style({
  boxShadow: '0 2px 2px 0 rgba(51,51,51,0.3)'
});

const plansEmptyListStyle = style({
  textAlign: 'center'
});

const plansSearchBoxStyle = style({
  position: 'absolute',
  top: '6px',
  right: '0',
  display: 'inline-block',
  $nest: {
    '&>div>span:first-child': {
      marginLeft: '10px'
    },
    '&>div>div>input': {
      paddingRight: '0 !important'
    }
  }
});

interface IPlanListComponentProps {
  company: ICompanyModel;
  plans: IPlanModel[];
}

interface IPlanListComponentState {
  searchString: string;
}

export class PlanList extends React.Component<IPlanListComponentProps, IPlanListComponentState> {

  constructor(props) {
    super(props);
    this.state = {
      searchString: ''
    };
  }

  onSearchChange = (value) => {
    this.setState({
      searchString: value
    });
  }

  filteredPlansBySearchString = () => {
    if (this.state.searchString.length < 1) return this.props.plans;

    let value = this.state.searchString;

    value = _.escapeRegExp(value);

    return this.props.plans.filter(item => (
      item.name.toLowerCase().search(
        value.toLowerCase()) !== -1
    ));

  }

  splitPlansToTabs = (plans: IPlanModel[]): IPlansTabModel[] => {
    let tabs = [{
      label: 'All',
      plans: [],
      onDropPatch: { archived: false }
    }];

    _.forEach(api.PlanModelStatus, (status) => {
      tabs.push({
        label: api.Mapping.planStatusToString(status),
        plans: [],
        onDropPatch: { status: status, archived: false } as any
      });
    });

    tabs.push({
      label: 'Archived',
      plans: [],
      onDropPatch: { archived: true }
    });

    _.forEach(plans, plan => {
      if (plan.archived) {
        _.find(tabs, { label: 'Archived' }).plans.push(plan);
      } else {
        _.find(tabs, { label: 'All' }).plans.push(plan);
        if (plan.status) {
          const tab = _.find(tabs, { label: api.Mapping.planStatusToString(plan.status) });

          if (tab) {
            tab.plans.push(plan);
          } else {
            console.warn(`Plan "${plan.name}" has unsupported status "${plan.status}"`);
          }
        }
      }
    });
    return tabs;
  }

  render() {
    if (this.props.plans.length === 0) {
      return (
        <div className={plansMainPanelStyle}>
          <div className={plansAddPlansBlockStyle}>
            <div className={plansEmptyListStyle}>
              <h1>Let's Add Some Plans!</h1>
            </div>
            <div className={plansEmptyAddBtnDivStyle}>
              <RaisedButton
                label="Add new plan"
                style={{ alignSelf: 'flex-start' }}
                icon={<FontIcon icon="add" />}
                key="addNewPlanButton"
                href="/Summary/CreateNewPlan"
                primary
              />
            </div>
          </div>
        </div>
      );
    } else {
      return (
        <div className={plansMainPanelStyle}>
          <div className={plansTopDivStyle}>
            <div className={plansAddBtnDivStyle}>
              <RaisedButton
                label="Add new plan"
                style={{ alignSelf: 'flex-start' }}
                icon={<FontIcon icon="add" />}
                key="addNewPlanButton"
                href="/Summary/CreateNewPlan"
                primary
              />
            </div>
            <div className={plansSearchBoxStyle}>
              <SearchBox value={this.state.searchString} onChange={this.onSearchChange} />
            </div>
          </div>
          <PlansTabs tabs={this.splitPlansToTabs(this.filteredPlansBySearchString())} />
        </div>
      );

    }

  }

}
