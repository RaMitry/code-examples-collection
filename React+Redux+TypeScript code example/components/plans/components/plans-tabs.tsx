import * as React from 'react';
import { Tabs } from 'material-ui';
import { IPlanModel } from 'lib/client-models';
import { DataList, Scrollbars, Tab } from 'components/common';
import { style } from 'typestyle';
import { primary1Color, thinBordersGreyColor } from 'src/styles';
import { PlanRow } from './plan-row';
import { PlanTabLabel } from './plan-tab-label';
import { calc, important, percent, px } from 'csx';

const plansListStyle = style({
  flexGrow: 1,
  display: 'flex',
  flexDirection: 'column',
  width: '100% !important',
  height: '100% !important',
  $nest: {
    '&:active': {
      animation: 'draft-cursor 100ms 1'
    }
  }
});

const tabsWidth = important(calc(`${percent(100)} - ${px(14)}`));

const planTabsRootStyle = style({
  marginTop: '66px',
  height: '100% !important',
  display: 'flex',
  flexDirection: 'column',
  flexGrow: 1,
  marginBottom: '5px',
  marginLeft: '11px',
  marginRight: '5px',
  $nest: {
    '&>div:first-child': {
      minHeight: '47px !important',
      borderBottom: '0px solid #fff',
      backgroundColor: '#fff !important',
      width: `${tabsWidth}`
    },
    '&>div:nth-child(2)': {
      width: `${tabsWidth}`,
      borderBottom: `1px solid ${thinBordersGreyColor}`
    },
    '&>div:nth-child(2)>div': {
      marginTop: '0 !important',
      height: '4px !important',
      backgroundColor: `${primary1Color} !important`
    },
    '&>div:last-child': {
      height: 'inherit',
      '&>div': {
        height: 'inherit'

      }
    }
  }
});

const planTabRootStyle = style({
  backgroundColor: '#fff !important',
  color: '#006BF7 !important'
});

const planSelectedTabRootStyle = style({
  $nest: {
    '&>div': {
      color: '#000 !important',
      fontWeight: 500
    }
  }
});

const bottomPlansListBorder = style({
  height: px(1),
  width: `${tabsWidth}`,
  borderTop: `1px solid ${thinBordersGreyColor}`,
});

export interface IPlansTabModel {
  onDropPatch: Partial<IPlanModel>;
  label: string;
  plans: IPlanModel[];
}

interface IPlansTabsComponentProps {
  tabs: IPlansTabModel[];
}

export class PlansTabs extends React.Component<IPlansTabsComponentProps, {}> {


  render() {

    const tabElements = this.props.tabs.map((tab) => {

      const statusLabel = tab.label + ' (' + tab.plans.length + ')';
      const tabPlansOverallCost = tab.plans.reduce((total, plan) => total + plan.costs.total, 0);
      const planRowsData = tab.plans.map((plan) => ({
        key: plan.id,
        planId: plan.id
      }));

      const labelElement = (
        <PlanTabLabel onDropPatch={tab.onDropPatch} statusLabel={statusLabel} tabPlansOverallCost={tabPlansOverallCost} />
      );

      return (
        <Tab key={tab.label.toLowerCase()} backgroundColor="#E5F1FF"
          className={planTabRootStyle} label={labelElement}
          selectedClass={planSelectedTabRootStyle}>

          <div className={plansListStyle}>
            <Scrollbars style={{ flexGrow: 1 }}>
              <DataList
                data={planRowsData}
                rowTemplate={PlanRow}
              />
            </Scrollbars>
          </div>
          <div className={bottomPlansListBorder} />
        </Tab>
      );

    });

    return (
      <Tabs className={planTabsRootStyle}>
        {tabElements}
      </Tabs>
    );

  }

}
