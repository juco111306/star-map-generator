import React, { useMemo } from 'react';

interface MysticalMilkyWayProps {
  cx: number;
  cy: number;
  radius: number;
  rotation?: number;
  opacity?: number;
  idPrefix?: string;
  isWatercolor?: boolean;
}

// Deterministic pseudo-random seed to generate organic stardust clusters
function pseudoRandom(seed: number) {
  const x = Math.sin(seed++) * 10000;
  return x - Math.floor(x);
}

export const MysticalMilkyWay: React.FC<MysticalMilkyWayProps> = ({
  cx,
  cy,
  radius,
  rotation = -28,
  opacity = 0.95,
  idPrefix = 'mmw',
  isWatercolor = false,
}) => {
  // Generate authentic micro-stardust particles along the galactic spine
  const stardust = useMemo(() => {
    const dots: { x: number; y: number; r: number; opacity: number }[] = [];
    const count = 90;

    for (let i = 0; i < count; i++) {
      const t = (i / count) * 2 - 1; // -1 to 1 along spine
      const perpOffset = (pseudoRandom(i * 13 + 7) - 0.5) * radius * 0.38;
      const spineSpread = (1 - Math.abs(t) * 0.4);

      // Curved spine function
      const spineX = t * radius * 0.88;
      const spineY = Math.sin(t * Math.PI * 0.8) * radius * 0.12 + perpOffset * spineSpread;

      // Rotate by angle
      const rad = (rotation * Math.PI) / 180;
      const rotX = spineX * Math.cos(rad) - spineY * Math.sin(rad);
      const rotY = spineX * Math.sin(rad) + spineY * Math.cos(rad);

      const dist = Math.hypot(rotX, rotY);
      if (dist < radius * 0.92) {
        dots.push({
          x: cx + rotX,
          y: cy + rotY,
          r: 0.5 + pseudoRandom(i * 31 + 3) * 0.9,
          opacity: 0.15 + pseudoRandom(i * 17 + 11) * 0.55,
        });
      }
    }
    return dots;
  }, [cx, cy, radius, rotation]);

  const blurWideId = `${idPrefix}-blur-wide`;
  const blurMidId = `${idPrefix}-blur-mid`;
  const blurSoftId = `${idPrefix}-blur-soft`;
  const coreGradId = `${idPrefix}-core-grad`;
  const diffuseGradId = `${idPrefix}-diffuse-grad`;
  const hotspotGradId = `${idPrefix}-hotspot-grad`;

  return (
    <g className="mystical-milky-way select-none pointer-events-none" opacity={opacity}>
      <defs>
        {/* Soft feathery galactic blur filters */}
        <filter id={blurWideId} x="-60%" y="-60%" width="220%" height="220%">
          <feGaussianBlur stdDeviation={radius * 0.08} />
        </filter>
        <filter id={blurMidId} x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation={radius * 0.045} />
        </filter>
        <filter id={blurSoftId} x="-40%" y="-40%" width="180%" height="180%">
          <feGaussianBlur stdDeviation={radius * 0.025} />
        </filter>

        {/* Luminous galactic core linear gradient */}
        <linearGradient id={coreGradId} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0" />
          <stop offset="25%" stopColor="#E0EEFF" stopOpacity={isWatercolor ? "0.08" : "0.14"} />
          <stop offset="48%" stopColor="#FFF8EB" stopOpacity={isWatercolor ? "0.15" : "0.26"} />
          <stop offset="55%" stopColor="#D4E6FF" stopOpacity={isWatercolor ? "0.14" : "0.24"} />
          <stop offset="78%" stopColor="#B8D5FA" stopOpacity={isWatercolor ? "0.06" : "0.10"} />
          <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0" />
        </linearGradient>

        {/* Diffuse background stardust veil */}
        <linearGradient id={diffuseGradId} x1="10%" y1="0%" x2="90%" y2="100%">
          <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0" />
          <stop offset="35%" stopColor="#C8DEFF" stopOpacity={isWatercolor ? "0.05" : "0.09"} />
          <stop offset="50%" stopColor="#EBF3FF" stopOpacity={isWatercolor ? "0.09" : "0.16"} />
          <stop offset="68%" stopColor="#B4D2F7" stopOpacity={isWatercolor ? "0.05" : "0.09"} />
          <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0" />
        </linearGradient>

        {/* Intense Sagittarius galactic core hotspot */}
        <radialGradient id={hotspotGradId} cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#FFFBF2" stopOpacity={isWatercolor ? "0.18" : "0.32"} />
          <stop offset="35%" stopColor="#EAF2FF" stopOpacity={isWatercolor ? "0.12" : "0.22"} />
          <stop offset="70%" stopColor="#C4DDFF" stopOpacity={isWatercolor ? "0.05" : "0.09"} />
          <stop offset="100%" stopColor="#0B132B" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* Layer 1: Broad Diffuse Galactic Cloud (Soft outer atmosphere) */}
      <g transform={`rotate(${rotation} ${cx} ${cy})`}>
        <ellipse
          cx={cx - radius * 0.04}
          cy={cy}
          rx={radius * 0.88}
          ry={radius * 0.32}
          fill={`url(#${diffuseGradId})`}
          filter={`url(#${blurWideId})`}
        />
        <ellipse
          cx={cx + radius * 0.08}
          cy={cy + radius * 0.03}
          rx={radius * 0.72}
          ry={radius * 0.22}
          fill={`url(#${diffuseGradId})`}
          filter={`url(#${blurMidId})`}
          transform={`rotate(-6 ${cx} ${cy})`}
        />

        {/* Layer 2: Main Arched Galactic Luminous Spine */}
        <path
          d={`M ${cx - radius * 0.86} ${cy + radius * 0.08}
              Q ${cx - radius * 0.4} ${cy - radius * 0.14}, ${cx} ${cy - radius * 0.03}
              T ${cx + radius * 0.86} ${cy - radius * 0.08}
              Q ${cx + radius * 0.4} ${cy + radius * 0.16}, ${cx} ${cy + radius * 0.06}
              Z`}
          fill={`url(#${coreGradId})`}
          filter={`url(#${blurMidId})`}
        />

        {/* Secondary Tendril / Outer Galactic Arm */}
        <path
          d={`M ${cx - radius * 0.72} ${cy - radius * 0.06}
              Q ${cx - radius * 0.25} ${cy + radius * 0.15}, ${cx + radius * 0.22} ${cy + radius * 0.04}
              T ${cx + radius * 0.78} ${cy + radius * 0.14}
              Q ${cx + radius * 0.3} ${cy - radius * 0.06}, ${cx - radius * 0.15} ${cy - radius * 0.02}
              Z`}
          fill={`url(#${coreGradId})`}
          filter={`url(#${blurSoftId})`}
          opacity="0.85"
        />

        {/* Layer 3: Galactic Core Hotspot (The Central Bulge) */}
        <ellipse
          cx={cx - radius * 0.08}
          cy={cy - radius * 0.02}
          rx={radius * 0.38}
          ry={radius * 0.20}
          fill={`url(#${hotspotGradId})`}
          filter={`url(#${blurMidId})`}
          transform={`rotate(8 ${cx} ${cy})`}
        />
        <circle
          cx={cx - radius * 0.06}
          cy={cy - radius * 0.02}
          r={radius * 0.16}
          fill={`url(#${hotspotGradId})`}
          filter={`url(#${blurSoftId})`}
        />

        {/* Layer 4: The Great Rift (Dark Absorption Dust Lanes splitting the core) */}
        {!isWatercolor && (
          <path
            d={`M ${cx - radius * 0.55} ${cy - radius * 0.01}
                C ${cx - radius * 0.2} ${cy - radius * 0.08}, ${cx - radius * 0.05} ${cy + radius * 0.04}, ${cx + radius * 0.18} ${cy - radius * 0.03}
                C ${cx + radius * 0.45} ${cy - radius * 0.08}, ${cx + radius * 0.65} ${cy + radius * 0.06}, ${cx + radius * 0.75} ${cy + radius * 0.02}
                C ${cx + radius * 0.55} ${cy + radius * 0.02}, ${cx + radius * 0.28} ${cy + radius * 0.01}, ${cx + radius * 0.08} ${cy + radius * 0.07}
                C ${cx - radius * 0.15} ${cy + radius * 0.09}, ${cx - radius * 0.35} ${cy + radius * 0.04}, ${cx - radius * 0.55} ${cy - radius * 0.01}
                Z`}
            fill="#050C1F"
            opacity="0.28"
            filter={`url(#${blurSoftId})`}
          />
        )}
      </g>

      {/* Layer 5: Luminous Stardust Grain (Thousands of unresolved stars along galactic plane) */}
      <g className="stardust-grain">
        {stardust.map((dot, idx) => (
          <circle
            key={idx}
            cx={dot.x}
            cy={dot.y}
            r={dot.r}
            fill="#FFFFFF"
            opacity={dot.opacity}
          />
        ))}
      </g>
    </g>
  );
};
