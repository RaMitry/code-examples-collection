import React from "react";
import T from "prop-types";
import R from "ramda";
import compose from "recompose/compose";
import { connect } from "react-redux";

import { SectionHeading } from "./section-heading";
import { TacticDetailsCuesGroup } from "./tactic-details-cues-group";
import { Strong } from "./strong";

import { getCues } from "../services/api";
import { replaceCues } from "../store/actions";
import { selectCues } from "../store/selectors";

import { withFetch } from "./with-fetch";

const isEven = n => {
  return n % 2 === 0;
}

const groupCues = cues => {
  if (isEven(cues.length)) return R.splitEvery(2, cues);

  const grouped = R.splitEvery(2, R.takeLast(cues.length - 1, cues));
  return R.prepend(R.take(1, cues), grouped)
};

const actionCreators = { replaceCues };
const mapStateToProps = (state, props) => {
  const cues = selectCues(props.tacticId, state.entities);
  const groupedCues = groupCues(cues);
  return {
    userId: state.currentUser.id,
    cues: groupedCues,
  }
};

const mapFetchToProps = (_, props) => ({
  fetch: () => getCues({
    userId: props.userId,
    tacticId: props.tacticId,
  }),
  onFulfilled: ({ response }) => {
    props.replaceCues(props.tacticId, response.data.body);
  },
});

@compose(connect(mapStateToProps, actionCreators), withFetch(mapFetchToProps))
export class TacticDetailsCues extends React.Component {
  static propTypes = {
    cues: T.array.isRequired,
  };

  render() {
    const { cues } = this.props;
    return [
      <SectionHeading
        key="section-heading"
        heading={<Strong>Cues History</Strong>}
        subheading="Chronological list of tactic cues."
      />,
      <div key="2">
        {cues.map((group, i) =>
          <TacticDetailsCuesGroup key={i} cues={group} />,
        )}
      </div>,
    ];
  }
}
