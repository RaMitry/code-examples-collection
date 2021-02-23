import React from "react";
import T from "prop-types";
import compose from "recompose/compose";
import { connect } from "react-redux";
import { StyledComponent } from "fela-components";

import { Button } from "./button";
import { Card } from "./card";
import { FetchError } from "./fetch-error";
import { FlexContainer } from "./flex-container";
import { Heading } from "./heading";
import { Link } from "./link";
import { Margin } from "./margin";
import { NotificationsSwitch } from "./notifications-switch";
import { Paragraph } from "./paragraph";
import { RejectedSlate } from "./rejected-slate";
import { SectionHeading } from "./section-heading";
import { TacticDetailsDescription } from "./tactic-details-description";
import { TacticDetailsCues } from "./tactic-details-cues";
import { TacticDetailsStats } from "./tactic-details-stats";
import { Strong } from "./strong";

import { getTactic, toggleNotifications } from "../services/api";
import { openDialog, showToast, replaceTactic } from "../store/actions";
import { selectTactic } from "../store/selectors";

import { withFetch } from "./with-fetch";
import { withRequest } from "./with-request";

const TacticNotFound = () => (
  <RejectedSlate>
    <Heading level={2} center margin>
      Not found
    </Heading>
    <Paragraph center margin>
      That tactic does not exist.<br />
      Explore Tactics in{" "}
      <Link to="/auth/tactics" color="lightPink">
        Tactics Marketplace
      </Link>
    </Paragraph>
  </RejectedSlate>
);

const DetailsCardWrap = ({ children }) => (
  <StyledComponent
    visual={({ theme }) => ({
      padding: "0 0.9375rem 0.9375rem",
      boxSizing: "border-box",
      width: "100%",
      [theme.lg]: {
        width: "50%",
      },
    })}>
    {children}
  </StyledComponent>
);

const actionCreators = { openDialog, replaceTactic };
const mapStateToProps = (state, props) => {
  const tacticId = props.match.params.tacticId;
  return {
    tacticId,
    tactic: selectTactic(tacticId, state.entities),
    currentUser: state.currentUser,
  };
};

const mapFetchToProps = (_, props) => ({
  fetch: () =>
    getTactic({
      userId: props.currentUser.id,
      tacticId: props.tacticId,
    }),
  shouldRefetch: (prevProps, props) =>
    prevProps.tacticId !== props.tacticId,
  onFulfilled: ({ response }) => {
    props.replaceTactic(response.data.body);
  },
});

const mapRequestToProps = (state, props) => ({
  request: enable =>
    toggleNotifications(state.currentUser.id, props.tactic.id, enable),
  onFulfilled: ({ fetch, response, ...props }) => {
    const { dispatch } = props;
    dispatch(showToast("notifications-turned-off"));
    dispatch(replaceTactic(response.data.body));
  },
  onRejected: ({ fetch, response, ...props }) => {
    const { dispatch } = props;
    dispatch(showToast("notifications-error-off"));
  },
});

@compose(
  connect(mapStateToProps, actionCreators),
  withFetch(mapFetchToProps, {
    Rejected404: TacticNotFound,
  }),
  withRequest(mapRequestToProps),
)
class TacticDetails extends React.Component {
  static propTypes = {
    tacticId: T.string.isRequired,
    tactic: T.object.isRequired,
    openDialog: T.func.isRequired,
    currentUser: T.object.isRequired,
  };

  openCopyTradeDialog = () => {
    const { tactic, openDialog } = this.props;
    const data = {
      id: tactic.id,
      name: tactic.name,
      startDate: new Date(tactic.startDate),
    };
    openDialog("copy-trade-dialog", data);
  };

  onNotificationsSwitch = () => {
    const { tactic, openDialog, request, currentUser } = this.props;

    if (!tactic.notificationsEnabled) {
      openDialog("notifications-dialog", { tactic, currentUser });
    } else {
      request.action(false);
    }
  };

  render() {
    const { tactic, tacticId, request } = this.props;

    return [
      <SectionHeading
        key="section-heading"
        heading={<Strong>Tactic Detail</Strong>}
        subheading="Detailed information with performance overview.">
        <Margin right="1.25rem">
          <NotificationsSwitch
            on={tactic.notificationsEnabled}
            onClick={this.onNotificationsSwitch}
            disabled={request.status === "pending"}
          />
        </Margin>
        <Button onClick={this.openCopyTradeDialog}>Copy Trade</Button>
      </SectionHeading>,
      <StyledComponent
        key="2"
        visual={{
          margin: "0.9375rem -0.9375rem 0",
          display: "flex",
        }}>
        <FlexContainer wrap>
          <DetailsCardWrap>
            <Card>
              <TacticDetailsDescription tactic={tactic} />
            </Card>
          </DetailsCardWrap>
          <DetailsCardWrap>
            <Card>
              <TacticDetailsStats tactic={tactic} />
            </Card>
          </DetailsCardWrap>
        </FlexContainer>
      </StyledComponent>,
      <TacticDetailsCues key="3" tacticId={tacticId} />,
    ];
  }
}

export { TacticDetails };
