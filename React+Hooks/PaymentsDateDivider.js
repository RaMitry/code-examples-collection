import React from 'react';


const PaymentsDateDivider = props => {

	const { date } = props;

	return (
		<div className="holders-market-widget__payments-months-divider">
			<div className='holders-market-widget__payments-months-divider__dotted-line'>
				<div className='holders-market-widget__payments-months-divider__month-ago-text'>{date}</div>
			</div>
		</div>
	);

};

export default PaymentsDateDivider;