import React from "react";
import T from "prop-types";
import { StyledComponent } from "fela-components";
import { Link } from "react-router-dom";
import roundTo from "round-precision";

import { commaSeparatedList } from "./comma-separated-list";
import { Ellipsis } from "./ellipsis";
import { FlexContainer } from "./flex-container";
import { FlexItem } from "./flex-item";
import { Float } from "./float";
import { Margin } from "./margin";
import { Row } from "./row";
import { TinyIcon } from "./tiny-icon";

const TacticDetails = ({ children }) => (
  <StyledComponent
    visual={{
      height: "243px",
      position: "relative",
      padding: "1.75rem 1.875rem 0.4rem 1.875rem",
      overflow: "auto",
    }}>
    {children}
  </StyledComponent>
);

export const CardTitle = ({ children }) => (
  <StyledComponent
    visual={({ theme }) => ({
      fontSize: "1rem",
      color: theme.darkGrey,
      fontWeight: 500,
    })}>
    {children}
  </StyledComponent>
);

export const Image = props => (
  <StyledComponent
    use="img"
    visual={{
      maxHeight: "1.25rem",
      maxWidth: "1.25rem",
      marginRight: "0.5rem",
      boxShadow: "0 1px 3px 0 rgba(0,0,0,0.10)",
      borderRadius: "50%",
    }}
    {...props}
  />
);

const CardMetric = ({ label, value, color, icon }) => (
  <FlexItem>
    <StyledComponent
      visual={{
        fontSize: "0.625rem",
        marginBottom: "0.25rem",
      }}>
      {label}
    </StyledComponent>
    <StyledComponent
      use="span"
      visual={({ theme }) => ({
        fontSize: "1rem",
        color: color || theme.darkGrey,
        marginRight: icon ? "5px" : "0px",
      })}>
      {value}
    </StyledComponent>
    {icon && <TinyIcon color={color} icon={icon} />}
  </FlexItem>
);

const CardMetrics = ({ assets, sources, type, profit6M }) => {
  const assetsValue = assets.length === 1 ? assets[0] : "Multiple";
  const sourcesValue = sources.length === 1 ? sources[0] : "Multiple";
  return (
    <FlexContainer justifyContent="space-between">
      <CardMetric label="Assets" value={assetsValue} />
      <CardMetric label="Sources" value={sourcesValue} />
      {type === "notifications"
        ?
        <CardMetric label="Type" value="Telegram Bot" icon="telegram"/>
        :
        <CardMetric
          label="Profit last 6 m"
          value={`${roundTo(profit6M || 0, 2)}%`}
          icon="arrowUp"
          color="#74CF0F"
        />
      }
    </FlexContainer>
  );
};

const DetailsWrapper = ({ children }) => (
  <StyledComponent
    visual={{
      background: "#fbfbfb",
      borderRadius: "0 0 5px 5px",
      borderTop: "1px solid rgba(134, 147, 154, 0.1)",
      width: "100%",
      boxSizing: "border-box",
      padding: "1.25rem 1.875rem",
    }}>
    {children}
  </StyledComponent>
);

const Card = ({ tactic }) => {
  return (
  <StyledComponent
    visual={({ theme }) => ({
      position: "relative",
      zIndex: 1,
      display: "block",
      cursor: "pointer",
      background: "white",
      borderRadius: "4px",
      boxShadow: "0px 1px 3px rgba(0,0,0,0.10)",
      color: theme.lightGrey,
      fontFamily: theme.roboto,
      fontSize: "0.75rem",
      width: "100%",
    })}>
    <TacticDetails>
      <Margin bottom="0.25rem">
        <CardTitle>{tactic.name}</CardTitle>
      </Margin>
      { tactic.author &&
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
      }
      <StyledComponent
        visual={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          height: "calc(243px - 3.55rem)",
        }}>
        <Ellipsis margin maxLine={tactic.type === "notifications" ? 30 : 6} html>
          {tactic.shortDescription}
        </Ellipsis>
        {tactic.indicators && tactic.indicators.length > 0 &&
          <Margin bottom="0.3rem">
            <Margin bottom="0.25rem">
              <StyledComponent
                visual={{
                  fontSize: "0.625rem",
                }}>
                Indicators
              </StyledComponent>
            </Margin>
            <Ellipsis margin maxLine={2}>
              {commaSeparatedList(tactic.indicators, ",")}
            </Ellipsis>
          </Margin>
        }
      </StyledComponent>
    </TacticDetails>
    <DetailsWrapper>
      <CardMetrics
        assets={tactic.assets}
        sources={tactic.sources}
        profit6M={tactic.profit6M}
        type={tactic.type}
      />
    </DetailsWrapper>
  </StyledComponent>
)};

const CardHover = ({ tactic, openDialog }) => {
  const isCryptofoxBot = tactic.type === "notifications";
  const props = isCryptofoxBot ? {
    use: "button",
    onClick: () => openDialog("cryptofox-get-bot-dialog"),
  } : {
    use: Link,
    to: "/auth/tactics/" + tactic.id,
  };

  return (
    <StyledComponent
      {...props}
      visual={({ theme }) => ({
        position: "absolute",
        top: 0,
        bottom: 0,
        right: 0,
        left: 0,
        zIndex: 2,
        display: "none",
        cursor: "pointer",
        background: "#F8F8F8",
        borderRadius: "4px",
        border: "none",
        boxShadow: "0 1px 5px 0 rgba(0, 0, 0, 0.2)",
        color: theme.lightGrey,
        fontFamily: theme.roboto,
        fontSize: "0.75rem",
        textDecoration: "none",
        textAlign: "left",
        width: "100%",
      })}>
      <StyledComponent
        visual={{
          height: "calc(243px + 4.6rem)",
          position: "relative",
          padding: "1.75rem 1.875rem 0.4rem 1.875rem",
          overflow: "auto",
        }}>
        <Margin bottom="0.25rem">
          <CardTitle>{tactic.name}</CardTitle>
        </Margin>
        <Margin top="0.7rem" />
        <StyledComponent
          visual={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            height: "233px",
            overflow: "auto",
          }}>
          <Ellipsis margin maxLine={30} html>
            {tactic.shortDescription}
          </Ellipsis>
        </StyledComponent>
      </StyledComponent>
      <StyledComponent
        visual={{
          position: "absolute",
          right: "20px",
          bottom: "20px",
          display: "flex",
          alignItems: "center",
        }}>
        <StyledComponent
          visual={{
            fontSize: "12px",
            fontWeight: 500,
            color: "#b875e1",
          }}>
          {isCryptofoxBot
            ? "GET TELEGRAM BOT"
            : "GO TO DETAIL"
          }
        </StyledComponent>
        <Margin left="5px">
          <TinyIcon color="#b875e1" icon="arrowRight" />
        </Margin>
      </StyledComponent>
    </StyledComponent>
  );
};

const CardWrap = ({ children }) => (
  <StyledComponent
    visual={({ theme }) => ({
      padding: "0 0.9375rem 1.875rem",
      boxSizing: "border-box",
      width: "100%",
      [theme.lg]: {
        width: "50%",
      },
      [theme.xl]: {
        width: "33.3%",
      },
    })}>
    <StyledComponent
      visual={({ animations }) => ({
        position: "relative",
        width: "100%",
        height: "100%",
        ":hover" : {
          ">a" : {
            display: "block",
            animationName: animations.fadeIn,
            animationDuration: ".2s",
            animationFillMode: "both",
          },
          ">button" : {
            display: "block",
            animationName: animations.fadeIn,
            animationDuration: ".2s",
            animationFillMode: "both",
          },
        },
      })}
      animations={{
        fadeIn: {
          "0%": { display: "none", opacity: "0" },
          "1%": { display: "block", opacity: "0" },
          "100%": { display: "block", opacity: "1" },
        },
      }}>
      {children}
    </StyledComponent>
  </StyledComponent>
);

class TacticCard extends React.Component {
  static propTypes = {
    tactic: T.object.isRequired,
    openDialog: T.func.isRequired,
  };

  render() {
    const { tactic, openDialog } = this.props;
    return (
      <CardWrap>
        <Card tactic={tactic} />
        <CardHover tactic={tactic} openDialog={openDialog}/>
      </CardWrap>
    );
  }
}

export { TacticCard };
