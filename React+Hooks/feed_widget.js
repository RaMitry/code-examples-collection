import React, { useEffect, useReducer } from 'react';

import { connectToModel, ngService } from '../../angular_to_react';
import { humanizeRecord } from './feed_service';
import Spinner from './LoadingSpinner';

import './feed_widget.scss';

const ErrorMessages = ngService('ErrorMessages');

const initialState = {
	feedData: null,
	loading: true,
	marketId: '',
	humanizedError: null
};

function reducer(state, action) {
	switch (action.type) {

		case 'updated': {
			const humanizedFeedData = action.payload.data.map(humanizeRecord);
			return {
				feedData: humanizedFeedData,
				humanizedError: null,
				loading: false,
				marketId: ` for ${action.payload.ticker} (Benzinga)`
			};
		}

		case 'loading': {
			return {
				feedData: null,
				humanizedError: null,
				loading: true,
				marketId: ''
			};
		}

		case 'error': {
			const humanizedErrorMessage =
				ErrorMessages.humanizeErrorMessage(`feed__${action.payload.error}`) ||
				ErrorMessages.humanizeErrorMessage('feed__no_data');
			return {
				feedData: null,
				humanizedError: humanizedErrorMessage,
				loading: false,
				marketId: ''
			};
		}

		default:
			return state;
	}
}


export const FeedComponent = ({props}) => {

	const [state, dispatch] = useReducer(reducer, initialState);

	const { model } = props;

	const toggleFullScreenHandle = () => model.toggleFullScreenMode();

	useEffect(() => {
		const removeEventListeners = connectToModel(model, 'lastData', ['updated', 'error', 'loading'], dispatch);

		const lastData = model.lastData();
		if (lastData) {
			if (lastData.data) {
				dispatch({
					type: 'updated',
					payload: lastData
				});
			}
			else if (lastData.error) {
				dispatch({
					type: 'error',
					payload: lastData
				});
			}
		}

		return removeEventListeners;

	}, []);

	return (
		<div className='right-panel-widget feed-widget'>

			<div className='right-panel-widget__header'>
				<h3>Feed{ state.marketId }</h3>

				<button className='mini-button mini-button--noborder md-icon-button md-button'
					title='Toggle maximize this panel'
					onClick={toggleFullScreenHandle}>
					<i className='icon icon-fullscreen'></i>
				</button>
			</div>

			<div className="right-panel-widget__list feed-widget__content">
				{
					state.loading && <Spinner></Spinner>
				}

				{
					state.humanizedError &&
					<div className='right-panel-widget__list-placeholder'>
						<p className='hint'>{state.humanizedError}</p>
					</div>
				}

				{
					state.feedData && !state.loading &&
					(
						state.feedData.length > 0
						? (
							<div>
							{
								state.feedData.map((article, index) => {
									return <a className='feed-widget__record' key={index} href={article.url} target="_blank" rel="noreferrer">
										<span className='feed-widget__record__time'>{article.timestampHumanized}</span>&nbsp;<span className='feed-widget__record__headline'>{article.author} — {article.title}</span>
										<span className='feed-widget__record__teaser'>{article.teaser}</span>
									</a>;
								})
							}
							</div>
						)
						: (
							!state.humanizedError &&
							<div className='right-panel-widget__list-placeholder'>
								<p className='hint'>Sorry, no feed for now</p>
							</div>
						)
					)
				}

			</div>
		</div>
	);
};