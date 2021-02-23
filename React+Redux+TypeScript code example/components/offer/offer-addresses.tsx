import * as React from 'react';
import { IAddressModel, ICompanyModel, ICustomerModel } from 'lib/client-models';
import {classes, style} from 'typestyle';
import { typography } from 'src/styles/typography';
import { commaSeparated } from 'lib/util';

const offerAddressBlockStyle = style({
  marginBottom: '25px'
});

const offerAddressDivStyle = style({
  paddingBottom: '25px',
  borderBottom: '2px solid #000',
  overflow: 'auto'
});

const offerAddressRightTitleStyle = style({
  width: '100%',
  textAlign: 'right',
  marginBottom: '4px'
});

const offerAddressesLeftStyle = style({
  width: '47%',
  padding: '15px 0',
  float: 'left'
});

const offerLeftPhoneMailStyle = style({
  marginTop: '15px'
});

const offerAddressesRightStyle = style({
  float: 'right',
  width: '47%',
  padding: '15px',
  textAlign: 'right',
  fontWeight: 'bold',
  backgroundColor: 'rgba(0,0,0,0.1)'
});

const offerRightNamePhoneMailStyle = style({
  marginTop: '15px'
});


interface IOfferAddressesProps {
  company: ICompanyModel;
  evaluatorEmail?: string;
  customer: ICustomerModel;
  customerAddress: IAddressModel;
}

export class OfferAddresses extends React.Component<IOfferAddressesProps> {

  render() {

    const { company, evaluatorEmail, customer, customerAddress } = this.props;

    return (
      <div className={offerAddressBlockStyle}>

          <div>
            {
              customer &&
              <div className={classes(offerAddressRightTitleStyle, typography.descriptionText)}>
                Customer
              </div>
            }

            <div className={offerAddressDivStyle}>
              <div className={offerAddressesLeftStyle}>
                {
                  company &&
                  <div>
                    {company.companyName}<br/>
                    {commaSeparated([company.street, company.city])}<br/>
                    {commaSeparated([company.state, company.zip, company.country])}
                  </div>
                }
                {
                  evaluatorEmail &&
                  <div className={offerLeftPhoneMailStyle}>
                    {evaluatorEmail}
                  </div>
                }
              </div>

              {
                customer &&
                <div className={offerAddressesRightStyle}>
                  <div>
                    <div>
                      {customer.displayName && customer.displayName}<br/>
                      {
                        customerAddress &&
                        <div>
                          {commaSeparated([customerAddress.street, customerAddress.city])}<br/>
                          {commaSeparated([customerAddress.state, customerAddress.zip, customerAddress.country])}
                        </div>
                      }
                    </div>
                    <div className={offerRightNamePhoneMailStyle}>
                      {customer.contactName && customer.contactName}<br/>
                      {customer.contactPhone && customer.contactPhone}<br/>
                      {customer.contactEmail && customer.contactEmail}
                    </div>
                  </div>
                </div>
              }
            </div>
          </div>
      </div>

    );
  }

}
