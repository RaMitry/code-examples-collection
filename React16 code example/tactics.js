import React from "react";
import T from "prop-types";
import compose from "recompose/compose";
import { connect } from "react-redux";

import { setTacticsOrderType } from "../store/actions";

import { Button } from "./button";
import { Dropdown } from "./dropdown";
import { Margin } from "./margin";
import { TacticsList } from "./tactics-list";
import { SectionHeading } from "./section-heading";
import { Strong } from "./strong";
import { Tooltip } from "./tooltip";
import { Paragraph } from "./paragraph";

const ORDER_TYPES = [
  { value: "name", label: "Name" },
  { value: "profit6M", label: "Performance" },
];

const actionCreators = { onOrderChange: setTacticsOrderType };

@compose(connect(undefined, actionCreators))
export class Tactics extends React.Component {
  static propTypes = {
    onOrderChange: T.func.isRequired,
  };

  state = {
    selectedOrderType: "profit6M",
  };

  handleOrderChange = value => {
    this.setState({ selectedOrderType: value });
    this.props.onOrderChange(value);
  };

  render() {
    const { selectedOrderType, showTooltip } = this.state;
    const label = ORDER_TYPES.find(t => t.value === selectedOrderType).label;

    return [
      <SectionHeading
        key="section-heading"
        heading={<span><Strong>Tactic Marketplace</Strong> Alpha</span>}>
        <Margin right="1.25rem">
          <Dropdown label={`Order by: ${label}`}>
            {ORDER_TYPES.map(({ value, label }) => (
              <Dropdown.Option
                key={value}
                value={value}
                active={value === selectedOrderType}
                select={this.handleOrderChange}>
                {label}
              </Dropdown.Option>
            ))}
          </Dropdown>
        </Margin>
        <Button
          ref={elm => this.btnElm = elm}
          onClick={() => this.setState({ showTooltip: true })}>
          New Tactic
        </Button>
        {showTooltip && (<Tooltip stickTo={this.btnElm} onClose={() => this.setState({ showTooltip: false }) }>
          <Paragraph>You will able you to assemble your custom tactic and offer it to other Cues users for copy trading. This feature will be available later on.</Paragraph>
        </Tooltip>)}
      </SectionHeading>,
      <TacticsList key="tactics-list" />,
    ];
  }
}
