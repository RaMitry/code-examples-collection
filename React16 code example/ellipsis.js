import React from "react";
import T from "prop-types";
import { StyledComponent } from "fela-components";
import LinesEllipsis from "react-lines-ellipsis";
import HtmlEllipsis from "react-lines-ellipsis/lib/html";

class Ellipsis extends React.Component {
  static propTypes = {
    center: T.bool,
    themeColor: T.string,
    maxLine: T.number,
    margin: T.bool,
    paragraph: T.bool,
    children: T.node,
    html: T.bool,
  };

  render() {
    const {
      center,
      themeColor,
      maxLine,
      margin,
      children,
      paragraph,
      html,
      ...props
    } = this.props;

    return (
      <StyledComponent
        {...props}
        visual={({ theme }) => ({
          color: themeColor ? theme[themeColor] : theme.lightGrey,
          fontFamily: theme.roboto,
          textAlign: center && "center",
          fontSize: "0.75rem",
          lineHeight: "1.125rem",
          margin: margin ? "0 0 0.75rem 0" : "0",
        })}>
        {html
          ?
          <HtmlEllipsis
            unsafeHTML={children}
            maxLine={maxLine}
            ellipsis="..."
            trimRight
            basedOn="words"
            component={paragraph ? "p" : "div"}
          />
          :
          <LinesEllipsis
            text={children}
            maxLine={maxLine}
            ellipsis="..."
            trimRight
            basedOn="words"
            component={paragraph ? "p" : "div"}
          />
        }
      </StyledComponent>
    );
  }
}

export { Ellipsis };
