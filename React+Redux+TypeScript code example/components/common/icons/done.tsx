import * as React from 'react';
import { SvgIcon } from 'components/common';

export interface IDoneIconProps {
  color?: string;
  height?: string;
  width?: string;
}

export const DoneIcon = (props : IDoneIconProps) => {
  const height = props.height || 24;
  const width = props.width || 24;
  const color = props.color || '#000000';
  const viewBox = `0 0 ${width} ${height}`;

  return (
    <SvgIcon width={width} height={height} viewBox={viewBox}>
      <path d="M0 0h24v24H0z" fill="none"/>
      <path d="M9 16.2L4.8 12l-1.4 1.4L9 19 21 7l-1.4-1.4L9 16.2z" fill={color}/>
    </SvgIcon>
  );
};

