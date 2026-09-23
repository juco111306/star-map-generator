'use client';

import React from 'react';

interface MoonPhasesDividerProps {
  cx: number;
  cy: number;
  color: string;
  scaleFactor?: number;
  radius?: number;
  spacing?: number;
}

export const MoonPhasesDivider: React.FC<MoonPhasesDividerProps> = ({
  cx,
  cy,
  color,
  scaleFactor = 1.0,
  radius = 15.0,
  spacing = 48,
}) => {
  const r = radius * scaleFactor;
  const rx = r * 0.48;
  const sp = spacing * scaleFactor;

  // 7 Lunar Phases centered around cx:
  // -3: Waxing Crescent
  // -2: First Quarter
  // -1: Waxing Gibbous
  //  0: Full Moon
  //  1: Waning Gibbous
  //  2: Last Quarter
  //  3: Waning Crescent
  const phaseOffsets = [-3, -2, -1, 0, 1, 2, 3];

  const getLitPath = (offset: number, mx: number, my: number) => {
    switch (offset) {
      case -3:
        // Waxing Crescent: right illuminated crescent
        return `M ${mx} ${my - r} A ${r} ${r} 0 0 1 ${mx} ${my + r} A ${rx} ${r} 0 0 0 ${mx} ${my - r} Z`;
      case -2:
        // First Quarter: right semicircle
        return `M ${mx} ${my - r} A ${r} ${r} 0 0 1 ${mx} ${my + r} L ${mx} ${my - r} Z`;
      case -1:
        // Waxing Gibbous: right half + left bulge
        return `M ${mx} ${my - r} A ${r} ${r} 0 0 1 ${mx} ${my + r} A ${rx} ${r} 0 0 1 ${mx} ${my - r} Z`;
      case 0:
        // Full Moon: handled as <circle>
        return '';
      case 1:
        // Waning Gibbous: left half + right bulge
        return `M ${mx} ${my - r} A ${r} ${r} 0 0 0 ${mx} ${my + r} A ${rx} ${r} 0 0 0 ${mx} ${my - r} Z`;
      case 2:
        // Last Quarter: left semicircle
        return `M ${mx} ${my - r} A ${r} ${r} 0 0 0 ${mx} ${my + r} L ${mx} ${my - r} Z`;
      case 3:
        // Waning Crescent: left illuminated crescent
        return `M ${mx} ${my - r} A ${r} ${r} 0 0 0 ${mx} ${my + r} A ${rx} ${r} 0 0 1 ${mx} ${my - r} Z`;
      default:
        return '';
    }
  };

  return (
    <g className="moon-phases-divider">
      {/* Delicate horizontal connector guide line behind moons */}
      <line
        x1={cx - 3.8 * sp}
        y1={cy}
        x2={cx + 3.8 * sp}
        y2={cy}
        stroke={color}
        strokeWidth={0.5 * scaleFactor}
        strokeOpacity={0.2}
      />

      {phaseOffsets.map((offset) => {
        const mx = cx + offset * sp;
        const my = cy;
        const litPath = getLitPath(offset, mx, my);

        return (
          <g key={offset}>
            {/* Outer perimeter rim */}
            <circle
              cx={mx}
              cy={my}
              r={r}
              fill="none"
              stroke={color}
              strokeWidth={0.75 * scaleFactor}
              strokeOpacity={0.35}
            />

            {/* Lit lunar surface */}
            {offset === 0 ? (
              <circle
                cx={mx}
                cy={my}
                r={r}
                fill={color}
                fillOpacity={0.88}
              />
            ) : (
              <path
                d={litPath}
                fill={color}
                fillOpacity={0.88}
              />
            )}
          </g>
        );
      })}
    </g>
  );
};
