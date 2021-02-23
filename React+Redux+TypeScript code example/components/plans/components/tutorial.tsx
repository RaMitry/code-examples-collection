import * as React from 'react';
import { ITutorialActionModel } from 'lib/client-models';
import { CircularProgress, FontIcon } from 'components/common';
import { DoneIcon } from 'components/common/icons/done';
import { CropSquareIcon } from 'components/common/icons/crop-square';
import { style } from 'typestyle';
import { selectedBg } from 'src/styles';

const tutorialItemDivStyle = style({
  margin: '5px 15px',
  $nest: {

    '&>span>svg': {
      verticalAlign: 'bottom'
    },

    '&>a':{
      verticalAlign: '2px',
      fontSize: '0.9em',
      color: '#4192fc'
    }

  }

});

const tutorialsCloseButtonStyle = style({
  position: 'absolute',
  top: '28px',
  right: '1%'
});

const tutorialsBlockDivStyle = style({
  backgroundColor: selectedBg,
  width: '23%',
  display: 'flex',
  flexFlow: 'column'
});

const tutorialsWelcomeDivStyle = style({
  marginTop: '30px',
  marginLeft: '15px'
});

const tutorialsWelcomeTextStyle = style({
  color: '#000000',
  fontFamily: 'Roboto',
  fontSize: '14px',
  lineHeight: '16px'
});

const tutorialsListHeaderStyle = style({
  opacity: 0.5,
  color: '#000000',
  fontFamily: 'Roboto',
  fontSize: '14px',
  lineHeight: '16px',
  marginTop: '24px',
  marginLeft: '15px',
  marginBottom: '7px'
});

const tutorialsWrapperStyle = style({
  display: 'flex',
  alignItems: 'flex-end',
  justifyContent: 'center',
  flex: 1
});

const tutorialsProgressBlockStyle = style({
  position: 'relative'
});

const tutorialsCompletedValueWrapperStyle = style({
  position: 'relative',
  bottom: '88px'
  });

const tutorialsCompletedValueDivStyle = style({
  display: 'flex',
  alignItems: 'center',
  flexDirection: 'column'
});

const tutorialsCompletedPercentagesStyle = style({
  fontWeight: 'lighter',
  fontSize: '35px'
});

const tutorialsCompletedStyle = style({
  fontWeight: 'normal',
  fontSize: '11px',
  opacity: 0.5,
  marginTop: '-5px'
});

interface ITutorialProps {
  tutorialActions: ITutorialActionModel[];
  onClose?: () => void;
}

export class Tutorial extends React.Component<ITutorialProps> {

  constructor(props) {
    super(props);
  }

  render(){

    const actionStyle = (action) => action.completed
      ? {textDecoration: 'line-through'}
      : {textDecoration: 'none'};

    const completedPercentage = Math.round(this.props.tutorialActions.filter((obj) => (obj.completed)).length /
      this.props.tutorialActions.length * 100);

    return (

      <div className={tutorialsBlockDivStyle}>

        <div className={tutorialsCloseButtonStyle}>
            <FontIcon icon="clear" color="#000" style={{cursor: 'pointer'}} onClick={this.props.onClose}/>
        </div>
        <div className={tutorialsWelcomeDivStyle}>
          <span className={tutorialsWelcomeTextStyle}>Welcome, friend!</span>
        </div>
        <div className={tutorialsListHeaderStyle}>These steps to gets you started quickly.</div>

        {this.props.tutorialActions.map(action =>
        <div className={tutorialItemDivStyle} key={action.actionId}>
          <span>{action.completed
            ? <DoneIcon color="#00ebb4"/>
            : <CropSquareIcon color="#c3cdda"/>}
          </span>
          <a className="tuts-name" href={action.link} style={actionStyle(action)}>{action.caption}</a>
        </div>)}

        <div className={tutorialsWrapperStyle}>
          <div className={tutorialsProgressBlockStyle}>
            <CircularProgress mode={'determinate'} value={completedPercentage} size={120} color={'#00DB94'}
                              thickness={5} style={{zIndex: 1}}/>
            <CircularProgress mode={'determinate'} value={100} size={120} color={'#FFF'}
                              thickness={5} style={{position: 'absolute', left: '0px'}}/>
            <div className={tutorialsCompletedValueWrapperStyle}>
              <div className={tutorialsCompletedValueDivStyle}>
                <div className={tutorialsCompletedPercentagesStyle}>{completedPercentage+'%'}</div>
                <div className={tutorialsCompletedStyle}>Completed</div>
              </div>
            </div>
          </div>
        </div>

      </div>

    );
  }

}
