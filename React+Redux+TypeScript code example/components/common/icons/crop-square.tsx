import * as React from 'react';
import { SvgIcon } from 'components/common';

export interface ICropSquareIconProps {
  height?: string;
  width?: string;
  color?: string;
}

export const CropSquareIcon = (props : ICropSquareIconProps) => {
  const height = props.height || 24;
  const width = props.width || 24;
  const color = props.color || '#000000';
  const viewBox = `0 0 ${width} ${height}`;

  return (
    <SvgIcon width={width} height={height} viewBox={viewBox}>
      <path d="M0 0h24v24H0z" fill="none"/>
      <path d="M18 4H6c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 14H6V6h12v12z" fill={color}/>
    </SvgIcon>
  );
};
