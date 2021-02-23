import React, { useEffect, useRef } from 'react';

import PaymentsListItem from './PaymentsListItem';
import PaymentsDateDivider from './PaymentsDateDivider';

import { CellMeasurer, CellMeasurerCache } from 'react-virtualized/dist/es/CellMeasurer';
import List from 'react-virtualized/dist/es/List';
import AutoSizer from 'react-virtualized/dist/es/AutoSizer';


const PaymentsList = props => {

	const { formattedPayments, clickOnPaymentItemHandle } = props;

	const paymentsListRefference = useRef();
	const paymentsListCellMeasurerCache = useRef(new CellMeasurerCache({
		fixedWidth: true,
		defaultHeight: 20
	}));

	const renderPaymentListRow = ({ index, key, style, parent }) => {
		const { divider, date } = formattedPayments[index];

		return (
			<CellMeasurer
			key={key}
			cache={paymentsListCellMeasurerCache.current}
			parent={parent}
			columnIndex={0}
			rowIndex={index}>
			{divider
				? <div key={key} style={style}>
					<PaymentsDateDivider
						date={date}/>
				</div>
				: <div key={key} style={style}>
					<PaymentsListItem
						payment={formattedPayments[index]}
						clickOnPaymentItemHandle={clickOnPaymentItemHandle}/>
				</div>
			}
			</CellMeasurer>
		);
	};

	useEffect(() => {
		if (formattedPayments && formattedPayments.length) {
			paymentsListCellMeasurerCache.current.clearAll();
			paymentsListRefference.current.recomputeRowHeights();
		}
	}, [formattedPayments]);

	return (
		<div className='holders-market-widget__payments-list'>
			<AutoSizer>
			{({ width, height }) => {
				return <List
				ref={paymentsListRefference}
				width={width}
				height={height}
				deferredMeasurementCache={paymentsListCellMeasurerCache.current}
				rowHeight={paymentsListCellMeasurerCache.current.rowHeight}
				rowRenderer={renderPaymentListRow}
				rowCount={formattedPayments.length}
				overscanRowCount={3} />;
			}}
			</AutoSizer>
		</div>
	);

};

export default PaymentsList;