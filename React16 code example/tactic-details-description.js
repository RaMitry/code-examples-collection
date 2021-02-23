import React from "react";
import T from "prop-types";
import { StyledComponent } from "fela-components";

import { TitleSmall } from "./title-small";
import { Float } from "./float";
import { Margin } from "./margin";
import { Row } from "./row";
import { CardTitle, Image } from "./tactic-card";
import { FlexContainer } from "./flex-container";

const TacticDetailsBlock = ({ children }) => (
  <StyledComponent
    visual={{
      height: "309px",
      position: "relative",
      overflow: "auto",
    }}>
    {children}
  </StyledComponent>
);

export class TacticDetailsDescription extends React.Component {
  static propTypes = {
    tactic: T.object.isRequired,
  };

  render() {
    const { tactic } = this.props;

    return (
      <TacticDetailsBlock>
        <FlexContainer>
          <StyledComponent visual={{ width: "42%" }}>
            <FlexContainer flexDirection="column">
              <Margin right="1.5rem">
                <TitleSmall>
                  Name
                </TitleSmall>
                <Margin bottom="0.25rem">
                  <CardTitle>{tactic.name}</CardTitle>
                </Margin>
              </Margin>
            </FlexContainer>
          </StyledComponent>
          <StyledComponent visual={{ width: "40%" }}>
            <FlexContainer flexDirection="column">
              <TitleSmall>
                Tactic author
              </TitleSmall>
              <Margin bottom="0.9rem">
                <Row verticalCenter height="1.25rem">
                  <Float left>
                    <Image src={`/img/${tactic.author}.png`} />
                  </Float>
                  <Float left>
                    <span>{tactic.author}</span>
                  </Float>
                </Row>
              </Margin>
            </FlexContainer>
          </StyledComponent>
        </FlexContainer>

        <StyledComponent
          visual={{
            height: "calc(350px - 7.35rem)",
          }}>
          <StyledComponent>
            <Margin bottom="0.125rem">
              <TitleSmall>
                Short Description
              </TitleSmall>
            </Margin>
            <StyledComponent
              visual={({ theme }) => ({
                color: theme.lightGrey,
                fontFamily: theme.roboto,
                fontSize: "0.75rem",
                lineHeight: "1.125rem",
                margin: "0 0 1rem 0",
              })}>
              {tactic.shortDescription}
            </StyledComponent>
          </StyledComponent>
          {tactic.rules &&
            <React.Fragment>
              <Margin bottom="0.125rem">
                <TitleSmall>
                  Rules
                </TitleSmall>
              </Margin>
              <StyledComponent
                visual={({ theme }) => ({
                  color: theme.lightGrey,
                  fontFamily: theme.roboto,
                  fontSize: "0.75rem",
                  lineHeight: "1.125rem",
                })}>
                {tactic.rules}
              </StyledComponent>
            </React.Fragment>
          }
        </StyledComponent>
      </TacticDetailsBlock>
    );
  }
}
