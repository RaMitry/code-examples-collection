import * as React from 'react';
import {classes, style} from 'typestyle';
import { connect } from 'react-redux';
import { numberToUsLocaleString } from 'src/evaluation/lib/transformations';
import { LayerModel } from 'lib/api';
import { IState } from 'lib/state';
import { important } from 'csx/lib';
import { makeAssemblyTotalSalesSelector, makeAssemblyQuantitySelector, makeLayerByLayerIdSelector, makeAssemblySalesPriceSelector } from 'lib/selectors/selectors-evaluation';


const offerTableValueTdStyle = style({
  verticalAlign: 'top'
});

const offerAlignLeftStyle = style({
  textAlign: important('left')
});

const offerManufacturerCellStyle = style({
  paddingLeft: '0px !important'
});

interface IOfferAssemblyValuesRowStoreProps {
  layer: LayerModel;
  totalSales: number;
  quantity: number;
  salesPrice: number;
}


interface IOfferAssemblyValuesRowOwnProps {
  layerId: number;
  description?: string;
}

type IOfferAssemblyValuesRowProps = IOfferAssemblyValuesRowStoreProps & IOfferAssemblyValuesRowOwnProps;

export class OfferAssemblyValuesRowPure extends React.Component<IOfferAssemblyValuesRowProps, {}> {


  render() {
    const { layer, totalSales, quantity, salesPrice} = this.props;
    return (
      <tr className="aid-offerGroupTableEntry" style={{ paddingBottom: '5px' }}>
        <td className={classes('aid-offerGroupTableEntryName', offerTableValueTdStyle, offerAlignLeftStyle, offerManufacturerCellStyle)}>
          {this.props.description}
        </td>
        <td style={{ width: '15px' }}/>
        <td className={classes('aid-offerGroupTableEntryQuantity', offerTableValueTdStyle)}>
          {numberToUsLocaleString(quantity, 0) + ' ' + layer.assembly.measurementUnit}
        </td>
        <td style={{ width: '15px' }}/>
        <td className={classes('aid-offerGroupTableEntryUnitCost', offerTableValueTdStyle)}>
          {'$ ' + numberToUsLocaleString(salesPrice)}
        </td>
        <td style={{ width: '15px' }}/>
        <td className={classes('aid-offerGroupTableEntryTotalCost', offerTableValueTdStyle)}>
          {'$ ' + numberToUsLocaleString(totalSales)}
        </td>
      </tr>
    );
  }
}

const mapStateToProps = (state: IState, props: IOfferAssemblyValuesRowOwnProps) => {
  const totalSalesSelector = makeAssemblyTotalSalesSelector();
  const quantitySelector = makeAssemblyQuantitySelector();
  const layerByLayerIdSelector = makeLayerByLayerIdSelector();
  const salesPriceSelector = makeAssemblySalesPriceSelector();
  return {
    layer: layerByLayerIdSelector(state, props),
    totalSales: totalSalesSelector(state, props),
    quantity: quantitySelector(state, props),
    salesPrice: salesPriceSelector(state, props)
  };
};

export const OfferAssemblyValuesRow = connect<IOfferAssemblyValuesRowStoreProps, any, IOfferAssemblyValuesRowOwnProps>(mapStateToProps, null)(OfferAssemblyValuesRowPure);
