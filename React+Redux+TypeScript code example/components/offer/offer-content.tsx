import * as React from 'react';
import { OfferGroupTable } from './offer-group-table';
import { OfferSummaryTable } from './offer-summary-table';
import { OfferAddresses } from './offer-addresses';
import { classes, style } from 'typestyle';
import { IAddressModel, ICompanyModel, IUserModel, ICustomerModel, IOfferModel } from 'lib/client-models';
import { IEvaluationGroup } from 'lib/interfaces';
import { typography } from 'src/styles/typography';
import { OfferGroupTotalOnlyTable } from 'src/evaluation/offer-group-table-total-only';

const offerDataBlockStyle = style({
  clear: 'both'
});

const offerBlockStyle = style({
  marginBottom: '25px'
});

const offerBlockHeaderStyle = style({
  fontWeight: 'bold',
  marginBottom: '2px'
});

const offerInclusConclusDivStyle = style({
  margin: '3px 0'
});

const offerDataInnerWrapperStyle = style({
  paddingTop: '25px',
  borderTop: '2px solid #000'
});

const offerDataHtmlDiv = style({
  fontFamily: 'Roboto, sans-serif',
  fontSize: '11pt',
  clear: 'both'
});

const offerBottomTextStyle = style({
  marginTop: '25px'
});

interface IOfferContentOwnProps {
  groups: IEvaluationGroup[];
  company: ICompanyModel;
  evaluator: IUserModel;
  customer: ICustomerModel;
  customerAddress: IAddressModel;
  offer: IOfferModel;
}

export class OfferContent extends React.Component<IOfferContentOwnProps> {

  render() {
    const { customer, evaluator, company, customerAddress, offer, groups } = this.props;
    const { inclusionsText = '', exclusionsText = '' } = offer.texts || {};
    const evaluatorEmail = (evaluator && evaluator.email) || null;

    return (
      <div className={offerDataHtmlDiv}>
        <OfferAddresses company={company} evaluatorEmail={evaluatorEmail} customer={customer}
          customerAddress={customerAddress} />
        <div className={offerDataBlockStyle}>
          {groups && [
            groups.map((group, i, groups) => (
              offer.exportGroupsOnly ?
                <OfferGroupTotalOnlyTable
                  key={group.name}
                  groupName={group.name} />
                :
                <OfferGroupTable
                  key={group.name}
                  groupName={group.name}
                  isLast={groups.length - 1 === i} />
            ))
          ]}

          {(inclusionsText.length > 0) && (
            <div className={offerBlockStyle}>
              <div className={offerBlockHeaderStyle}>
                Included(+)
              </div>
              <div className={offerInclusConclusDivStyle}>
                {inclusionsText}
              </div>              
            </div>
          )}

          {(exclusionsText.length > 0) && (
            <div className={offerBlockStyle}>
              <div className={offerBlockHeaderStyle}>
                Excluded(-)
              </div>
              <div className={offerInclusConclusDivStyle}>
                {exclusionsText}
              </div>
            </div>
          )}
        </div>

        <div className={offerDataBlockStyle}>
          <div className={offerDataInnerWrapperStyle}>
            <OfferSummaryTable />
            {
              (company && company.companyName)
                ? <div className={classes(offerBottomTextStyle, typography.descriptionText)}>
                  Thank you for choosing {company.companyName} for your business. We look forward to working
                  with you and having you as a satisfied customer.
                </div>
                : <div className={classes(offerBottomTextStyle, typography.descriptionText)}>
                  Thank you for choosing us for your business. We look forward to working with you and having you as a
                  satisfied customer.
                </div>
            }
          </div>
        </div>
      </div>
    );
  }
}
