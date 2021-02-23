import * as React from 'react';
import { OfferAssemblyValuesRow } from './offer-assembly-values-row';
import { LayerModel } from 'lib/api';
import { important } from 'csx';
import { style } from 'typestyle';

interface IOfferGroupTableSectionOwnProps {
  layer: LayerModel;
  numberOfColumns: number;
}

const offerRowHrStyle = style({
  borderTop: '2px dotted #8c8b8b',
  backgroundColor: '#fff',
  flexShrink: 0,
  margin: important(0)
});

export class OfferGroupTableSection extends React.Component<IOfferGroupTableSectionOwnProps,any> {
  render () {
    const { layer, numberOfColumns } = this.props;

    return <tbody>
        <tr>
          <td colSpan={numberOfColumns} style={{padding: 0}}>
            <hr className={offerRowHrStyle}/>
          </td>
        </tr>
        <OfferAssemblyValuesRow
          layerId={layer.id}
          description={layer.name || layer.assembly.name}/>

      </tbody>;
  }
}


