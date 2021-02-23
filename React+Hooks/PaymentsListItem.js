import React from 'react';


const PaymentsListItem = props => {

	const { title, insider, date, name, color, payment, netValueFormatted } = props.payment;
	const clickOnPaymentItemHandle = props.clickOnPaymentItemHandle;

	return (
		<div className='holders-market-widget__payment-data-line' title={title}
			onClick={() => clickOnPaymentItemHandle({target: {value: insider}})}>
			<div className='holders-market-widget__payment-data-line__payment-date'>{date}</div>
			<div className='holders-market-widget__payment-data-line__payment-name'>{name}</div>
			<div className='holders-market-widget__payment-data-line__payment-action' style={{color}}>{payment}</div>
			<div className='holders-market-widget__payment-data-line__payment-sum' style={{color}}>{netValueFormatted}</div>
		</div>
	);

};

export default PaymentsListItem;