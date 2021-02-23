import * as React from 'react';
import { AsyncState } from 'lib/state';
import { OfferContent } from './offer-content';
import { Checkbox, IconButton, RaisedButton, RefreshIndicator } from 'components/common';
import { getStyles, style, classes } from 'typestyle';
import {
  generateAndDownloadPdfOffer,
  loadCompanyIfNeeded,
  loadPlansIfNeeded,
  loadUsersIfNeeded,
  reloadCustomerAddresses,
  reloadCustomersIfNeeded
} from 'lib/actions';
import { IAddressModel, IOfferModel, ICompanyModel, ICustomerModel, IPlanModel, IUserModel } from 'lib/client-models';
import { halfBlackColor, selectedBg } from 'src/styles';
import { IEvaluationGroup, IState } from 'lib/interfaces';
import { renderToStaticMarkup } from 'react-dom/server';
import { connect, Provider } from 'react-redux';
import { getGlobalStore } from '../../../index';
import * as moment from 'moment';
import { reloadOfferIfNeeded } from '../../store/actions';
import { updateOffer } from 'src/evaluation/store/actions/legacy-offer-actions';
import { currentPlanSelector, evaluatorFromCurrentPlanSelector, customerFromCurrentPlanSelector, currentPlanAddressSelector } from 'lib/selectors/selectors-plan';
import { companySelector } from 'lib/selectors/selectors-company';
import { offerSelector, offerLoadStatusSelector } from 'lib/selectors/selectors-offer';
import { customerLoadStatusSelector } from 'lib/selectors/selectors-customer';
import { customerAddressesLoadStatusSelector } from 'lib/selectors/selectors-customer-address';

const offerPreviewBlockStyle = style({
  zIndex: 2030,
  position: 'fixed',
  top: 0,
  right: 0,
  bottom: 0,
  left: 0,
  overflowX: 'hidden',
  overflowY: 'auto'
});

const offerPreviewStyle = style({
  width: '700px',
  zIndex: 2500,
  margin: '30px auto',
  position: 'relative',
  backgroundColor: '#fff',
  padding: '60px 70px'
});

const offerPreviewBackFillStyle = style({
  zIndex: 2020,
  position: 'fixed',
  top: 0,
  right: 0,
  bottom: 0,
  left: 0,
  backgroundColor: halfBlackColor
});

const closeOfferPreviewButtonStyle = style({
  position: 'absolute',
  top: '2px',
  right: 0
});

const offerPreviewTopHeaderStyle = style({
  overflow: 'auto',
  marginBottom: '11px'
});

const offerPreviewFooterWrapperStyle = style({
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  padding: '40px 0',
  marginTop: '20px',
  backgroundColor: selectedBg
});


interface IOfferPreviewOwnProps {
  groups: IEvaluationGroup[];
  onHideOfferPreview?: () => void;
}

interface IOfferPreviewDispatchProps {
  loadDataIfNeeded?: () => void;
  loadAddressesForCustomerIfNeeded?: (customerId: number) => void;
  onExportGroupsOnly: (exportGroupsOnly: boolean) => void;
  onDownload: (html: string, headerHtml: string, planId: number) => void;
}

interface IOfferPreviewStoreProps {
  isLoading?: boolean;
  plan: IPlanModel;
  company: ICompanyModel;
  evaluator: IUserModel;
  customer: ICustomerModel;
  customerAddress: IAddressModel;
  offer: IOfferModel;
}

type IOfferPreviewProps = IOfferPreviewOwnProps & IOfferPreviewStoreProps & IOfferPreviewDispatchProps;

export class OfferPreviewPure extends React.Component<IOfferPreviewProps> {

  componentWillMount() {
    this.props.loadDataIfNeeded();
  }

  componentWillReceiveProps(nextProps: IOfferPreviewProps) {
    this.props.loadDataIfNeeded();

    if (nextProps.plan) {
      this.props.loadAddressesForCustomerIfNeeded(nextProps.plan.customerId);
    }
  }

  divElement: HTMLElement;

  checkClickOutsideOfferPreview = (event) => {
    if (this.divElement && !this.divElement.contains(event.target)) {
      this.props.onHideOfferPreview();
    }
  }

  handleClickExportPdfButton = (content: React.ReactElement<any>, header: React.ReactElement<any>) => {

    const fullPage = (
      <html style={{ height: '100%', width: '100%', margin: 0, padding: 0 }}>
        <head>
          <link href="https://fonts.googleapis.com/css?family=Roboto:300,400,700" rel="stylesheet" />
        </head>
        <body style={{ width: '100%', height: '100%', margin: 0, padding: 0 }}>
          <Provider store={getGlobalStore()}>
            {content}
          </Provider>
        </body>
      </html>
    );

    const fullPageHtml = renderToStaticMarkup(fullPage);
    const headerHtml = renderToStaticMarkup(header);
    const styleTag = `<style>${getStyles()}</style>`;
    const finalHtml = fullPageHtml.replace('</head>', styleTag + '</head>');

    this.props.onDownload(finalHtml, headerHtml, this.props.plan.id);
  }

  render() {
    const groups = this.props.groups || [];

    const headerHtml = this.props.company
      ? <div>
        <div style={{ float: 'left', width: 'auto' }}>
          <img src={this.props.company.logoUrl} style={{ height: '50px', width: 'auto' }} />
        </div>
        <div style={{ marginTop: '15px', float: 'right', width: 'auto' }}>
          Date: <b>{moment().format('l')}</b>
        </div>
      </div>
      : <div />;

    const dataHtml = <OfferContent
      groups={groups}
      company={this.props.company}
      evaluator={this.props.evaluator}
      customer={this.props.customer}
      customerAddress={this.props.customerAddress}
      offer={this.props.offer} />;

    return (
      <div className="aid-offerDialog">
        <div className={offerPreviewBackFillStyle} />

        <div className={offerPreviewBlockStyle} onClick={this.checkClickOutsideOfferPreview}>
          {
            this.props.isLoading
              ? <RefreshIndicator left={0} top={100} status="loading" />
              : (
                <div className={offerPreviewStyle} ref={e => this.divElement = e}>
                  <div className={closeOfferPreviewButtonStyle}>
                    <IconButton className="aid-closeOfferDialog" icon="clear" onClick={this.props.onHideOfferPreview} />
                  </div>

                  <div className={offerPreviewTopHeaderStyle}>
                    {headerHtml}
                  </div>

                  {dataHtml}

                  <div className={classes('aid-showGroupsOnly', offerPreviewFooterWrapperStyle)}>
                    <Checkbox
                      style={{ width: '200px' }}
                      label="Show Groups Only"
                      checked={!!this.props.offer.exportGroupsOnly}
                      onCheck={(unused, isChecked) => this.props.onExportGroupsOnly(isChecked)} />
                    <RaisedButton primary label="Export offer"
                      onClick={() => this.handleClickExportPdfButton(dataHtml, headerHtml)} />
                  </div>
                </div>
              )
          }
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state: IState): IOfferPreviewStoreProps => {
  return {
    plan: currentPlanSelector(state),
    company: companySelector(state),
    evaluator: evaluatorFromCurrentPlanSelector(state),
    customer: customerFromCurrentPlanSelector(state),
    customerAddress: currentPlanAddressSelector(state),
    offer: offerSelector(state),
    isLoading: (
      (state.backend.allPlans.state !== AsyncState.Loaded) ||
      (state.backend.allPlans.operationPending) ||
      (state.backend.company.state !== AsyncState.Loaded) ||
      (customerLoadStatusSelector(state) !== AsyncState.Loaded) ||
      (customerFromCurrentPlanSelector(state) && customerAddressesLoadStatusSelector(state) !== AsyncState.Loaded) ||
      (offerLoadStatusSelector(state) !== AsyncState.Loaded)
    )
  };
};

const mapDispatch = (dispatch): IOfferPreviewDispatchProps => {
  return {
    loadDataIfNeeded: () => {
      dispatch(loadCompanyIfNeeded());
      dispatch(loadPlansIfNeeded());
      dispatch(reloadCustomersIfNeeded());
      dispatch(loadUsersIfNeeded());
      dispatch(reloadOfferIfNeeded());
    },
    loadAddressesForCustomerIfNeeded: (customerId) => {
      dispatch(reloadCustomerAddresses({ id: customerId }, true));
    },
    onExportGroupsOnly: (exportGroupsOnly: boolean) => dispatch(updateOffer({ exportGroupsOnly })),
    onDownload: (html, headerHtml, planId: number) => {
      dispatch((dispatch) => {
        dispatch(generateAndDownloadPdfOffer(html, headerHtml, planId));
      });
    }
  };
};

export const OfferPreview = connect<IOfferPreviewStoreProps, IOfferPreviewDispatchProps, IOfferPreviewOwnProps>(mapStateToProps, mapDispatch)(OfferPreviewPure);
