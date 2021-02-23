import * as React from 'react';
import { classes, style } from 'typestyle';
import { dragPlanItem } from './plan-row';
import { IPlanModel } from 'lib/client-models';
import { DropTarget } from 'react-dnd';
import { primary1Color } from 'src/styles';
import { important } from 'csx';


const planTabDivStyle = style({
  height: '100%',
  width: '100%',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center'
});

const planTabOverallCostStyle = style({
  opacity: 0.5,
  color: '#000000',
  fontSize: '11px',
  marginTop: '3px',
  fontWeight: 500
});

const tabLabelIsDraggedOverStyle = (color) => style({
  border: important('1px solid #fff'),
  outline: `2px solid ${color}`,
  outlineOffset: '-3px'
});

export interface IPlansTabLabelProps {
  onDropPatch: Partial<IPlanModel>;
  statusLabel: string;
  tabPlansOverallCost: number;
  connectDropTarget?: (jsx) => any;
  isOver?: boolean;
}

class PlanTabLabelPure extends React.Component<IPlansTabLabelProps, {}> {

  render() {

    const { statusLabel, tabPlansOverallCost, connectDropTarget, isOver } = this.props;
    return connectDropTarget(
      <div className={classes(planTabDivStyle, isOver && tabLabelIsDraggedOverStyle(primary1Color))}>
        <div>{statusLabel}</div>
        {
          <div className={planTabOverallCostStyle}>
            {'$ ' + Math.round(tabPlansOverallCost).toLocaleString('en-US')}
          </div>
        }
      </div>
    );
  }

}

/****************************************************************************
 * DRAG'N'DROP
 ****************************************************************************/

const dropTarget = {
  drop(props: IPlansTabLabelProps, monitor) {
    return {
      onDropPatch: props.onDropPatch
    };
  }
};

const dropTargetCollect = (connect, monitor) => {
  return {
    connectDropTarget: connect.dropTarget(),
    isOver: monitor.isOver()
  };
};

export const PlanTabLabel = DropTarget(dragPlanItem, dropTarget, dropTargetCollect)(PlanTabLabelPure);

/****************************************************************************
 * End of DRAG'N'DROP
 ****************************************************************************/
