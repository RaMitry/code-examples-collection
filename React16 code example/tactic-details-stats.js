import React from "react";
import T from "prop-types";
import { StyledComponent } from "fela-components";
import _ from "lodash";
import moment from "moment";
import roundTo from "round-precision";
import Measure from "react-measure";

import { Chart } from "./chart";
import { FlexContainer } from "./flex-container";
import { ItemLabel } from "./item-label";
import { Margin } from "./margin";
import { PerformanceLabel } from "./performance-label";
import { Row } from "./row";

const STAT_TABS = {
  visualisation: "Cues visualisation",
  stats: "Tactic stats",
};

const TacticStatisticBlock = ({ children }) => (
  <StyledComponent
    visual={{
      height: "310px",
      margin: "0 -1.875rem",
      display: "flex",
      flexDirection: "column",
    }}>
    {children}
  </StyledComponent>
);

const ItemValue = ({ children }) => (
  <StyledComponent
    visual={({ theme }) => ({
      color: theme.lightGrey,
      fontFamily: theme.roboto,
      fontSize: "0.75rem",
      lineHeight: "1.5",
    })}>
    {children}
  </StyledComponent>
);

export class TacticDetailsStats extends React.Component {
  static propTypes = {
    tactic: T.object.isRequired,
  };

  state = {
    visualization: true,
    width: 0,
    height: 0,
  };

  handleStatTabsClick = tab => {
    switch (tab) {
      case "stats":
        this.setState({
          visualization: false,
        });
        break;
      default:
        this.setState({
          visualization: true,
        });
    }
  };

  computeDimensions= (contentRect) => {
    this.setState({
      width: contentRect.bounds.width,
      height: contentRect.bounds.height,
    });
  }

  render() {
    const { visualization, height, width } = this.state;
    const {
      assets,
      averageLoss,
      averageWin,
      lossRate,
      profit6M,
      profit6MNet,
      profitTotal,
      profitTotalNet,
      averageTradeSize,
      sources,
      startDate,
      winRate,
    } = this.props.tactic;
    const { tactic } = this.props;
    const [base, quote] = assets[0].split(" / ");

    return (
      <TacticStatisticBlock>
        <StyledComponent
          visual={{
            width: "100%",
            boxSizing: "border-box",
            borderBottom: "solid 1px rgba(134, 147, 154, 0.1)",
            padding: "0 1.875rem",
            marginTop: "-0.625rem",
          }}>
          <Row verticalCenter height="2.875rem">
            <StyledComponent
              onClick={() => this.handleStatTabsClick("visualization")}
              visual={({ theme }) => ({
                color: theme.lightGrey,
                fontFamily: theme.roboto,
                fontSize: "0.85rem",
                float: "left",
                width: "9.25rem",
                borderBottom: visualization
                  ? `solid 0.125rem ${theme.lightPink}`
                  : "none",
                fontWeight: visualization ? 500 : "normal",
                textAlign: "center",
                cursor: "pointer",
              })}>
              {STAT_TABS.visualisation}
            </StyledComponent>
            <StyledComponent
              onClick={() => this.handleStatTabsClick("stats")}
              visual={({ theme }) => ({
                color: theme.lightGrey,
                fontFamily: theme.roboto,
                fontSize: "0.85rem",
                float: "left",
                width: "9.25rem",
                borderBottom: visualization
                  ? "none"
                  : `solid 2px ${theme.lightPink}`,
                fontWeight: visualization ? "normal" : 500,
                textAlign: "center",
                cursor: "pointer",
              })}>
              {STAT_TABS.stats}
            </StyledComponent>
          </Row>
        </StyledComponent>
        {visualization
          ?
          <Measure onResize={this.computeDimensions} bounds>
            {({ measureRef }) =>
              <div
                ref={measureRef}
                style={{
                  width: "100%",
                  height: "100%",
                  display: "flex",
                }}>
                <Chart
                  width={width}
                  height={height}
                  tactic={tactic}
                  exchange={sources}
                  base={base}
                  quote={quote}
                />
              </div>
            }
          </Measure>
          :
          <div>
            <StyledComponent
              visual={{
                clear: "both",
                margin: "1.875rem 1.25rem 0 0.6875rem",
                padding: "0 0 1.875rem 0.5625rem",
                borderBottom: "solid 0.125rem rgba(134, 147, 154, 0.1)",
              }}>
              <FlexContainer>
                <StyledComponent
                  visual={{
                    width: "29%",
                    padding: "0 0.625rem 0 0",
                  }}>
                  <FlexContainer flexDirection="column">
                    <Margin bottom="0.5625rem">
                      <ItemLabel>Assets:</ItemLabel>
                    </Margin>
                    <Margin bottom="0.5625rem">
                      <ItemLabel>Sources:</ItemLabel>
                    </Margin>
                    <Margin bottom="0.5625rem">
                      <ItemLabel>Last 6m performance:</ItemLabel>
                    </Margin>
                    <Margin bottom="0">
                      <ItemLabel>Last 6m perf. (net):</ItemLabel>
                    </Margin>
                  </FlexContainer>
                </StyledComponent>

                <StyledComponent
                  visual={{
                    width: "26%",
                    padding: "0 0.625rem 0 0",
                  }}>
                  <FlexContainer flexDirection="column">
                    <Margin bottom="0.5625rem">
                      <ItemValue>{assets}</ItemValue>
                    </Margin>
                    <Margin bottom="0.5625rem">
                      <ItemValue>{sources}</ItemValue>
                    </Margin>
                    <Margin bottom="0.5625rem">
                      <PerformanceLabel value={profit6M} />
                    </Margin>
                    <Margin bottom="0">
                      <PerformanceLabel value={profit6MNet !== profit6M ? profit6MNet : null} />
                    </Margin>
                  </FlexContainer>
                </StyledComponent>

                <StyledComponent
                  visual={{
                    width: "29%",
                    padding: "0 0.625rem 0 0",
                  }}>
                  <FlexContainer flexDirection="column">
                    <Margin bottom="0.5625rem">
                      <ItemLabel>Start date:</ItemLabel>
                    </Margin>
                    <Margin bottom="0.5625rem">
                      <ItemLabel>End date:</ItemLabel>
                    </Margin>
                    <Margin bottom="0.5625rem">
                      <ItemLabel>Total performance:</ItemLabel>
                    </Margin>
                    <Margin bottom="0">
                      <ItemLabel>Total performance (net):</ItemLabel>
                    </Margin>
                  </FlexContainer>
                </StyledComponent>

                <StyledComponent
                  visual={{
                    width: "16%",
                  }}>
                  <FlexContainer flexDirection="column">
                    <Margin bottom="0.5625rem">
                      <ItemValue>{moment(startDate).calendar()}</ItemValue>
                    </Margin>
                    <Margin bottom="0.5625rem">
                      <ItemValue>—</ItemValue>
                    </Margin>
                    <Margin bottom="0.5625rem">
                      <PerformanceLabel value={profitTotal} />
                    </Margin>
                    <Margin bottom="0">
                      <PerformanceLabel value={profitTotalNet !== profitTotal ? profitTotalNet : null} />
                    </Margin>
                  </FlexContainer>
                </StyledComponent>
              </FlexContainer>
            </StyledComponent>
            <StyledComponent
              visual={{
                margin: "0 1.25rem",
                paddingTop: "1.875rem",
              }}>
              <FlexContainer>
                <StyledComponent
                  visual={{
                    width: "29%",
                    padding: "0 0.625rem 0 0",
                  }}>
                  <FlexContainer flexDirection="column">
                    <Margin bottom="0.5625rem">
                      <ItemLabel>Average profit:</ItemLabel>
                    </Margin>
                    <Margin bottom="0.5625rem">
                      <ItemLabel>Average loss:</ItemLabel>
                    </Margin>
                    <Margin bottom="0">
                      <ItemLabel>Average trade:</ItemLabel>
                    </Margin>
                  </FlexContainer>
                </StyledComponent>

                <StyledComponent
                  visual={{
                    width: "26%",
                    padding: "0 0.625rem 0 0",
                  }}>
                  <FlexContainer flexDirection="column">
                    <Margin bottom="0.5625rem">
                      <ItemValue>
                        {averageWin !== null ? `${roundTo(averageWin, 2)}%` : "—"}
                      </ItemValue>
                    </Margin>
                    <Margin bottom="0.5625rem" >
                      <ItemValue>
                        {averageLoss !== null ? `${roundTo(averageLoss, 2)}%` : "—"}
                      </ItemValue>
                    </Margin>
                    <Margin bottom="0">
                      <ItemValue>
                        {averageTradeSize !== null ? `${roundTo(averageTradeSize, 2)}%` : "—"}
                      </ItemValue>
                    </Margin>
                  </FlexContainer>
                </StyledComponent>

                <StyledComponent
                  visual={{
                    width: "29%",
                    padding: "0 0.625rem 0 0",
                  }}>
                  <FlexContainer flexDirection="column">
                    <Margin bottom="0.5625rem">
                      <ItemLabel>Win rate:</ItemLabel>
                    </Margin>
                    <Margin bottom="0.5625rem">
                      <ItemLabel>Loss rate:</ItemLabel>
                    </Margin>
                    <Margin bottom="0">
                      <ItemLabel>Maximum drawdown:</ItemLabel>
                    </Margin>
                  </FlexContainer>
                </StyledComponent>

                <StyledComponent
                  visual={{
                    width: "16%",
                  }}>
                  <FlexContainer flexDirection="column">
                    <Margin bottom="0.5625rem">
                      <ItemValue>
                        {winRate !== null ? `${roundTo(winRate, 2)}%` : "—"}
                      </ItemValue>
                    </Margin>
                    <Margin bottom="0.5625rem">
                      <ItemValue>
                        {lossRate !== null ? `${roundTo(lossRate, 2)}%` : "—"}
                      </ItemValue>
                    </Margin>
                    <Margin bottom="0">
                      <ItemValue>—</ItemValue>
                    </Margin>
                  </FlexContainer>
                </StyledComponent>
              </FlexContainer>
            </StyledComponent>
          </div>
        }
      </TacticStatisticBlock>
    );
  }
}
