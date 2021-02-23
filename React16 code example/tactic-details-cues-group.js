import React from "react";
import T from "prop-types";
import { StyledComponent } from "fela-components";

import { Card } from "./card";
import { Margin } from "./margin";
import { CuesDay } from "./cues-day";
import { TitleSmall } from "./title-small";

const TacticCuesBlock = ({ children }) => (
  <StyledComponent
    use="table"
    visual={{
      position: "relative",
    }}>
    {children}
  </StyledComponent>
);

export class TacticDetailsCuesGroup extends React.Component {
  static propTypes = {
    cues: T.array.isRequired,
  };

  render() {
    const { cues } = this.props;


    return (
      <Margin bottom="0.625rem">
        <Card>
          <table>
            <tbody>
              <tr>
                <td style={{ width: "6.9375rem" }}>
                  <TitleSmall>Action</TitleSmall>
                </td>
                <td style={{ width: "11.5rem" }}>
                  <TitleSmall>Timestamp</TitleSmall>
                </td>
                <td style={{ width: "8.75rem" }}>
                  <TitleSmall>Order type</TitleSmall>
                </td>
                <td style={{ width: "6.5rem" }}>
                  <TitleSmall>Type</TitleSmall>
                </td>
                <td style={{ width: "9.5rem" }}>
                  <TitleSmall>Price ETH in BTC:</TitleSmall>
                </td>
                <td style={{ width: "8rem" }}>
                  <TitleSmall>Profit</TitleSmall>
                </td>
                <td style={{ width: "9rem" }}>
                  <TitleSmall>Asset</TitleSmall>
                </td>
              </tr>
              {[
                cues.map((cue) => (
                  <CuesDay key={cue.created} cue={cue} />
                )),
              ]}
            </tbody>
          </table>
        </Card>
      </Margin>
    );
  }
}
