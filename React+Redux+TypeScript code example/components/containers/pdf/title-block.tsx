import * as React from 'react';
import { connect } from 'react-redux';
import { pointToInch } from 'lib/utils';
import { IWithPlanId } from 'lib/interfaces';
import { IPlanModel, ICompanyModel, IUserModel, IPlanModel } from 'lib/client-models';
import { IState } from 'lib/state';
import { planSelector } from 'lib/selectors/selectors-plan';
import { currentPlanSelector, evaluatorFromCurrentPlanSelector } from 'lib/selectors/selectors-plan';

interface ITitleBlockOwnProps extends IWithPlanId {
  planScale?: number;
}

interface ITitleBlockStoreProps {
  planName: string;
  companyLogoUrl: string;
  evaluator: IUserModel;
  plan: IPlanModel;
}

class TitleBlockPure extends React.PureComponent<ITitleBlockOwnProps & ITitleBlockStoreProps, {}> {
  smallMargin: string;
  bigMargin: string;
  smallLimitWidth: string;
  rowGap: string;
  imageHeight: string;
  separatorStyle: any;
  labelBaseStyle: any;
  itemBaseStyle: any;
  itemBaseLeftStyle: any;
  draftNameStyle: any;
  evaluator: any;
  labelBaseLeftStyle: any;
  printedOn: Date;

  constructor(props) {
    const dpi = 96;
    super(props);

    const inToCss = (inches: number): string => {
      return pxToCss(inches * dpi);
    };

    const ptToCss = (pt: number): string => {
      return inToCss(pointToInch(pt));
    };

    function pxToCss(px: number): string {
      return px + 'px';
    }

    this.smallMargin = inToCss(0.2);
    this.bigMargin = inToCss(0.4);
    this.smallLimitWidth = inToCss(1.375);
    this.rowGap = ptToCss(3);
    this.imageHeight = ptToCss(44);

    // Styles needs to be inline so they are properly exported for pdf print
    this.separatorStyle = {
      borderColor: 'black',
      marginTop: this.smallMargin,
      marginBottom: this.smallMargin
    };

    this.labelBaseStyle = {
      fontFamily: 'Roboto',
      textAlign: 'right',
      color: 'black',
      whiteSpace: 'nowrap',
      fontWeight: '300',
      lineHeight: ptToCss(7),
      fontSize: ptToCss(8)
    };

    this.itemBaseStyle = {
      fontFamily: 'Roboto',
      textAlign: 'right',
      color: 'black',
      fontWeight: '700',
      whiteSpace: 'nowrap',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      maxWidth: this.smallLimitWidth,
      fontSize: ptToCss(9)
    };

    this.itemBaseLeftStyle = {
      ...this.itemBaseStyle,
      maxWidth: inToCss(5.5),
      textAlign: 'left'
    };

    this.labelBaseLeftStyle = {
      ...this.labelBaseStyle,
      textAlign: 'left'
    };

    this.draftNameStyle = {
      ...this.itemBaseLeftStyle,
      maxWidth: inToCss(5.5),
      fontSize: ptToCss(12)
    };

    this.evaluator = this.props.evaluator.displayName || '-- None --';
  }

  render() {
    const printedOn = new Date();
    const logoColumn = <td rowSpan={2} style={{ paddingLeft: this.bigMargin }} >
      <img style={{ maxHeight: this.imageHeight, height: 'auto', maxWidth: this.smallLimitWidth }} src={this.props.companyLogoUrl} />
    </td>;
    const planContent = <div><div style={this.labelBaseLeftStyle}>plan</div>
      <div style={this.itemBaseLeftStyle}>{this.props.planName}</div>
    </div>;
    const scale = this.props.planScale ? + this.props.planScale.toFixed(2) : undefined;
    const scaleContent = <div>
      <div style={this.labelBaseStyle}>plan scale</div>
      <div style={this.itemBaseStyle}>1 / {scale}”</div>
    </div>;
    return <div style={{ bottom: 0, position: 'absolute', padding: this.smallMargin }}>
        <hr style={this.separatorStyle} />
        <table style={{ display: 'flex', flexFlow: 'row' }}><tbody>
          <tr>
            <td style={{ width: '99%' }}>
              <div style={this.labelBaseLeftStyle}>take-off</div>
              <div style={this.draftNameStyle}>{this.props.plan.name}</div>
            </td>
            <td style={{ paddingLeft: this.bigMargin, verticalAlign: 'top' }}>
              {scale ? scaleContent : null}
            </td>
            <td style={{ paddingLeft: this.bigMargin, verticalAlign: 'top' }}>
              <div style={this.labelBaseStyle}>evaluated by</div>
              <div style={this.itemBaseStyle}>{this.props.evaluator.displayName}</div>
            </td>
            {this.props.companyLogoUrl ? logoColumn : null}
          </tr>
          <tr>
            <td style={{ paddingTop: this.rowGap }}>
              {this.props.planName ? planContent : null}
            </td>
            <td style={{ paddingLeft: this.bigMargin, paddingTop: this.rowGap }}>
              <div style={this.labelBaseStyle}>page</div>
              <div style={this.itemBaseStyle}>1 of 1</div>
            </td>
            <td style={{ paddingLeft: this.bigMargin, paddingTop: this.rowGap }}>
              <div style={this.labelBaseStyle}>on</div>
              <div style={this.itemBaseStyle}>{printedOn.toLocaleDateString()}</div>
            </td>
          </tr>
        </tbody></table>
      </div>;
  }
}

function mapState(state: IState, props: ITitleBlockOwnProps): ITitleBlockStoreProps {
  return {
    plan: planSelector(state, props),
    planName: currentPlanSelector(state).name,
    companyLogoUrl: state.backend.company.company.logoUrl,
    evaluator: evaluatorFromCurrentPlanSelector(state)
  };
}

export const TitleBlock = connect(mapState)(TitleBlockPure);
