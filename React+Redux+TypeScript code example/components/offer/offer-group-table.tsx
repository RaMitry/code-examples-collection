import * as React from 'react';
import { OfferGroupTableSection } from './offer-group-table-section';
import { classes, style } from 'typestyle';
import { fontSizeSmall, halfBlackColor } from 'src/styles';
import { important } from 'csx';
import { connect } from 'react-redux';
import { IEvaluationGroup } from 'lib/interfaces';
import { IState } from 'lib/state';
import { makeGroupTotalCostSelector, makeGroupTotalSalesSelector, makeGroupTotalLaborSelector, makeGroupByNameSelector } from 'lib/selectors/selectors-evaluation';

const offerGroupTableWrapperStyle = style({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'stretch'
});

const offerTableStyle = style({
  width: '100%',
  marginBottom: '25px',
  borderCollapse: 'collapse',
  tableLayout: 'fixed',
  $nest: {
    'td, th': {
      textAlign: 'right'
    },
    'td > div > div': {
      display: 'flex',
      justifyContent: 'flex-end'
    }
  }
});

const offerTheadStyle = style({
  color: halfBlackColor
});

const offerThStyle = style({
  fontWeight: 'normal',
  fontSize: fontSizeSmall,
  paddingBottom: '3px'
});

const offerAlignLeftStyle = style({
  textAlign: important('left')
});

export const offerTableTitleCellStyle = style({
  textAlign: important('left'),
  fontWeight: 'bold',
  color: 'rgb(0,0,0)'
});


interface IOfferGroupTableOwnProps {
  isLast?: boolean;
  groupName: string;
}


interface IOfferGroupTableStoreProps {
  group: IEvaluationGroup;
}

export type IOfferGroupTableProps = IOfferGroupTableOwnProps & IOfferGroupTableStoreProps;


export class OfferGroupTablePure extends React.Component<IOfferGroupTableProps> {

  render () {
    const numberOfColumns = 7;
    const columnWidth = 'calc((60% - 20px) / 3)';
    const { group } = this.props;

    return <div className={classes('aid-offerGroupTable', offerGroupTableWrapperStyle)}>
          <div>
            <table className={offerTableStyle}>
              <thead className={offerTheadStyle}>
                <tr>
                  <th style={{ width: '50%' }} className={classes('aid-offerGroupTableTitle', offerTableTitleCellStyle)}>{group.name}</th>
                  <th style={{ width: '15px' }}/>
                  <th style={{ width: columnWidth }} />
                  <th style={{ width: '15px' }}/>
                  <th style={{ width: columnWidth }} />
                  <th style={{ width: '15px' }}/>
                  <th style={{ width: columnWidth }} />
                </tr>
                <tr>
                  <th className={classes(offerThStyle, offerAlignLeftStyle)}>Part</th>
                  <th/>
                  <th className={offerThStyle}>Quantity</th>
                  <th/>
                  <th className={offerThStyle}>Unit cost</th>
                  <th/>
                  <th className={offerThStyle}>Total cost</th>
                </tr>
              </thead>

              {group.layers.map(layer => (
                <OfferGroupTableSection
                  key={layer.id}
                  numberOfColumns={numberOfColumns}
                  layer={layer} />
              ))}
            </table>
          </div>
      </div>;
  }
}

const mapStateToProps = (state: IState, props: IOfferGroupTableOwnProps) => {
  const totalCostSelector = makeGroupTotalCostSelector();
  const totalSalesSelector = makeGroupTotalSalesSelector();
  const totalLaborSelector = makeGroupTotalLaborSelector();
  const groupByNameSelector = makeGroupByNameSelector();
  return {
    group: groupByNameSelector(state, props),
    totalCost: totalCostSelector(state, props),
    totalSales: totalSalesSelector(state, props),
    totalLabor: totalLaborSelector(state, props)
  };
};

export const OfferGroupTable = connect<IOfferGroupTableStoreProps,any,IOfferGroupTableOwnProps>(mapStateToProps, null)(OfferGroupTablePure);
