import * as React from 'react';
import { Canvas } from 'src/draft/workspace/canvas';
import { IPlan } from 'lib/interfaces';
import { TitleBlock } from './title-block';

export interface IPrintableSvg {
  plan: IPlan;
  widthInch: number;
  heightInch: number;
}

export class PrintableSvg extends React.Component<IPrintableSvg, {}> {
  render() {
    let leftViewBox = 0;
    let topViewBox = 0;
    let rightViewBox = this.props.plan.normalizedWidth;
    let bottomViewBox = this.props.plan.normalizedHeight;

    const legend = this.props.plan.draftData && this.props.plan.draftData.legend;

    if (legend && legend.enabled) {
      leftViewBox = Math.min(leftViewBox, legend.x);
      topViewBox = Math.min(topViewBox, legend.y);
      rightViewBox = Math.max(rightViewBox, legend.x + legend.renderedWidth);
      bottomViewBox = Math.max(bottomViewBox, legend.y + legend.renderedHeight);
    }

    const viewBox = `${leftViewBox} ${topViewBox} ${rightViewBox - leftViewBox} ${bottomViewBox - topViewBox}`;
    const smallMargin = 0.2;

    const bigMargin = 1.5;

    const svgWidth = this.props.widthInch - 2 * smallMargin;
    const svgHeight = this.props.heightInch - (smallMargin + bigMargin);

    const vZoomRatio = svgHeight / this.props.plan.normalizedHeight;
    const hZoomRatio = svgWidth / this.props.plan.normalizedWidth;
    const [planSize, svgSize] = vZoomRatio < hZoomRatio
      ? [this.props.plan.normalizedHeight, svgHeight]
      : [this.props.plan.normalizedWidth, svgWidth];

    const svgStyle: React.CSSProperties = {
      position: 'absolute',
      top: `${smallMargin}in`,
      left: `${smallMargin}in`,
      width: `${svgWidth}in`,
      height: `${svgHeight}in`,
    };

    return (
      <div style={{ display: 'relative', height: '100%', width: '100%', padding: 0, margin: 0 }}>
        <svg ref="svg" style={svgStyle} viewBox={viewBox} preserveAspectRatio="xMidYMid meet">
          <Canvas planId={this.props.plan.id} />
        </svg>
        <TitleBlock planId={this.props.plan.id} />
      </div>
    );
  }
}
