import * as React from 'react';
import { classes, style } from 'typestyle';
import { fontSizeSmall, halfBlackColor, secondaryTextColor } from 'src/styles';
import { IEvaluationSummary } from 'lib/interfaces';
import { numberToUsLocaleString } from 'src/evaluation/lib/transformations';
import { connect } from 'react-redux';
import { IState } from 'lib/state';
import { important } from 'csx/lib';
import { offerTableTitleCellStyle } from './offer-group-table';
import { laborAndMaterialsSelector, summaryAdjustmentsSelector, taxesSelector, summarySelector, summaryTotalSelector } from 'lib/selectors/selectors-evaluation';


const summaryTableStyle = style({
  width: '100%',
  height: '100%',
  marginBottom: '25px'
});

const summaryTotalTableStyle = style({
  width: '100%',
  height: '100%'
});

const summaryClearBothStyle = style({
  clear: 'both'
});

const summaryBoldStyle = style({
  fontWeight: 'bold'
});

const summaryHrTdStyle = style({
  padding: 0
});

const summaryTableHrStyle = style({
  borderTop: '2px dotted #8c8b8b',
  backgroundColor: '#fff',
  flexShrink: 0,
  margin: 0
});

const summaryTableLastHrStyle = style({
  borderTop: '2px dotted #000',
  backgroundColor: '#fff',
  flexShrink: 0,
  margin: 0
});


const summaryAlignRightStyle = style({
  textAlign: important('right')
});

const summaryTableThStyle = style({
  color: secondaryTextColor,
  textAlign: 'left',
  fontWeight: 'normal',
  fontSize: fontSizeSmall
});

const summaryTotalCellStyle = style({
  fontSize: '2em',
  textAlign: 'center',
  border: '2px solid #000',
  padding: '15px 0',
  whiteSpace: 'nowrap',
  fontWeight: 600
});

const summaryAcceptedTdStyle = style({
  fontSize: fontSizeSmall,
  color: halfBlackColor,
  borderBottom: '2px dotted #000',
  verticalAlign: 'top'
});

interface IOfferTaxesTableOwnProps {
  onSummaryChange?: (summary: IEvaluationSummary) => void;
}

interface IOfferTaxesTableStoreProps {
  summary: IevaluationSummary;
  laborTotalSales: number;
  materialsTotalSales: number;
  laborAndMaterialsTotalSales: number;
  totalAdjustments: number;
  labor: number;
  materials: number;
  total: number;
  totalSummary: number;
}

type IOfferTaxesTableProps = IOfferTaxesTableOwnProps & IOfferTaxesTableStoreProps;

export class OfferSummaryTablePure extends React.Component<IOfferTaxesTableProps, any> {

  render() {

    const { labor, materials, laborAndMaterialsTotalSales, laborTotalSales, materialsTotalSales, totalAdjustments,
      total, totalSummary } = this.props;
    const laborTotalSalesAndAdjustmentsTotal = laborTotalSales + totalAdjustments;
    const laborMaterialsTotalSalesAndAdjustmentsTotal = laborAndMaterialsTotalSales + totalAdjustments;

    return (
      <div>

        <table className={summaryTableStyle}>
          <thead>
          <tr>
            <th className={offerTableTitleCellStyle} colSpan={5}>Summary</th>
          </tr>
          <tr>
            <th className={summaryTableThStyle} colSpan={2} style={{width: '48%'}}>Price</th>
            <th style={{width: '4%'}} />
            <th className={summaryTableThStyle} colSpan={2}>
              Taxes
            </th>
          </tr>
          </thead>

          <tbody>

          <tr>
            <td className={summaryHrTdStyle} colSpan={2}>
              <hr className={summaryTableHrStyle}/>
            </td>
            <td style={{width: '25px'}} />
            <td className={summaryHrTdStyle} colSpan={2}>
              <hr className={summaryTableHrStyle}/>
            </td>
          </tr>

          <tr>
            <td>
              Materials
            </td>
            <td className={summaryAlignRightStyle}>
              {'$' + numberToUsLocaleString(materialsTotalSales)}
            </td>
            <td style={{width: '25px'}} />
            <td>
              Materials Tax
            </td>
            <td className={summaryAlignRightStyle}>
              {'$ ' + numberToUsLocaleString(materials)}
            </td>
          </tr>

          <tr>
            <td className={summaryHrTdStyle} colSpan={2}>
              <hr className={summaryTableHrStyle}/>
            </td>
            <td style={{width: '25px'}} />
            <td className={summaryHrTdStyle} colSpan={2}>
              <hr className={summaryTableHrStyle}/>
            </td>
          </tr>

          <tr>
            <td>
              Labor and Adjustments
            </td>
            <td className={summaryAlignRightStyle}>
              {'$' + numberToUsLocaleString(laborTotalSalesAndAdjustmentsTotal)}
            </td>
            <td style={{width: '25px'}} />
            <td>
              Labor and Adjustments Tax
            </td>
            <td className={summaryAlignRightStyle}>
              {'$ ' + numberToUsLocaleString(labor)}
            </td>
          </tr>

          <tr>
            <td className={summaryHrTdStyle} colSpan={2}>
              <hr className={summaryTableLastHrStyle}/>
            </td>
            <td style={{width: '25px'}} />
            <td className={summaryHrTdStyle} colSpan={2}>
              <hr className={summaryTableLastHrStyle}/>
            </td>
          </tr>

          <tr className={summaryBoldStyle}>
            <td>
              Subtotal
            </td>
            <td className={summaryAlignRightStyle}>
              {'$' + numberToUsLocaleString(laborMaterialsTotalSalesAndAdjustmentsTotal)}
            </td>
            <td style={{width: '25px'}} />
            <td>
              Total taxes
            </td>
            <td className={summaryAlignRightStyle}>
              {'$ ' + numberToUsLocaleString(total)}
            </td>
          </tr>
          </tbody>
        </table>

        <table className={classes(summaryTotalTableStyle, summaryClearBothStyle)}>
          <thead>
          <tr>
            <th className={summaryTableThStyle} colSpan={2}>Total</th>
            <th style={{width: '4%'}} />
            <th className={summaryTableThStyle} colSpan={2}/>
          </tr>
          </thead>
          <tbody>
          <tr>
            <td className={summaryTotalCellStyle} style={{width: '48%'}}>
              {'$' + numberToUsLocaleString(totalSummary)}
            </td>
            <td style={{width: '4%'}}/>
            <td className={summaryAcceptedTdStyle} style={{width: '28%'}}>
              Accepted By
            </td>
            <td style={{width: '3%'}}/>
            <td className={summaryAcceptedTdStyle} style={{width: '17%'}}>
              Date
            </td>
          </tr>
          </tbody>
        </table>

      </div>
    );
  }
}

const mapStateToProps = (state: IState) => {
  return {
    ...laborAndMaterialsSelector(state),
    ...summaryAdjustmentsSelector(state),
    ...taxesSelector(state),
    summary: summarySelector(state),
    totalSummary: summaryTotalSelector(state)
  };
};

export const OfferSummaryTable = connect<IOfferTaxesTableStoreProps, any, IOfferTaxesTableOwnProps>(mapStateToProps, null)(OfferSummaryTablePure);
