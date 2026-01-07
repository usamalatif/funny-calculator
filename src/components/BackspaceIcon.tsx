import React from 'react';
import Svg, { Path, Line } from 'react-native-svg';

interface BackspaceIconProps {
  color?: string;
  size?: number;
}

export const BackspaceIcon: React.FC<BackspaceIconProps> = ({
  color = '#888888',
  size = 22,
}) => {
  return (
    <Svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth={1.5}
    >
      <Path d="M21 4H8l-7 8 7 8h13a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2z" />
      <Line x1="18" y1="9" x2="12" y2="15" />
      <Line x1="12" y1="9" x2="18" y2="15" />
    </Svg>
  );
};
