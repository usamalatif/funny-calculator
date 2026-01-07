import React from 'react';
import Svg, { Path, Circle, Polyline } from 'react-native-svg';

interface HistoryIconProps {
  color?: string;
  size?: number;
}

export const HistoryIcon: React.FC<HistoryIconProps> = ({
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
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {/* Counter-clockwise arrow */}
      <Path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
      <Path d="M3 3v5h5" />
      {/* Clock hands */}
      <Polyline points="12 7 12 12 16 14" />
    </Svg>
  );
};
