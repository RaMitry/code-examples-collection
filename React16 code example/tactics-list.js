import React from "react";
import T from "prop-types";
import compose from "recompose/compose";
import { connect } from "react-redux";

import { FlexContainer } from "./flex-container";
import { Margin } from "./margin";
import { TacticCard } from "./tactic-card";

import { getTactics } from "../services/api";
import { openDialog } from "./actions";
import { replaceTactics } from "./actions";
import { selectOrderedTactics } from "./selectors";

import { withFetch } from "./with-fetch";

const actionCreators = { replaceTactics, openDialog };
const mapStateToProps = state => ({
  userId: state.currentUser.id,
  tactics: selectOrderedTactics(state),
});

const mapFetchToProps = (_, props) => ({
  fetch: () => getTactics({ userId: props.userId }),
  onFulfilled: ({ response }) => {
    props.replaceTactics(response.data.body);
  },
});

@compose(connect(mapStateToProps, actionCreators), withFetch(mapFetchToProps))
export class TacticsList extends React.Component {
  static propTypes = {
    tactics: T.array.isRequired,
    openDialog: T.func.isRequired,
  };

  render() {
    const { tactics, openDialog } = this.props;

    return (
      <Margin left="-0.9375rem" right="-0.9375rem">
        <FlexContainer wrap>
          {tactics.map(tactic => (
            <TacticCard
              key={tactic.id}
              tactic={tactic}
              openDialog={openDialog}
            />
          ))}
        </FlexContainer>
      </Margin>
    );
  }
}
