import * as _ from 'lodash';
import * as moment from 'moment';

export const calculateDaysLeft = (item:any) => {

  if (_.isNil(item.dueDate)) {
    return {date: 'No Due Date', color: {color: '#CBCBCB'}};
  }

  const now = new Date();
  const oneDay = 1000 * 60 * 60 * 24;
  const daysLeft = Math.ceil((moment(item.dueDate).valueOf() - now.getTime()) / oneDay);

  if (isNaN(daysLeft)) {
    return {date: 'Wrong Due Date', color: {color: '#CBCBCB'}};
  } else if (daysLeft <= 0) {
    return {date: 'Past Due', color: {color: '#FFCDD5'}};
  } else {
    return {
      date: moment(item.dueDate).toNow(true) + ' left',
      color: (daysLeft < 4) ? {color: '#FFF091'} : {color: '#CBCBCB'}
    };
  }
};
