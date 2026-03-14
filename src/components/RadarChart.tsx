import { motion } from 'motion/react';
import { SalesMetrics } from '../types';

const LABELS = ['RAP', 'LN', 'PV', 'CO', 'FEC'];
const COUNT = 5;
const CX = 120;
const CY = 120;
const MAX_R = 90;
const ANGLE_STEP = (2 * Math.PI) / COUNT;
const START_ANGLE = -Math.PI / 2;

function polarToXY(index: number, radius: number): [number, number] {
  const angle = START_ANGLE + index * ANGLE_STEP;
  return [CX + radius * Math.cos(angle), CY + radius * Math.sin(angle)];
}

export function RadarChart({ metrics }: { metrics: SalesMetrics }) {
  const values = [
    metrics.rapport,
    metrics.needsDiscovery,
    metrics.valueProposition,
    metrics.objectionHandling,
    metrics.closingProbability,
  ];

  const polygon = values
    .map((v, i) => polarToXY(i, (v / 100) * MAX_R))
    .map(([x, y]) => `${x},${y}`)
    .join(' ');

  return (
    <svg width={240} height={240} viewBox="0 0 240 240" className="max-w-full" role="img" aria-label="Gráfico radar de desempenho nas métricas de vendas">
      {/* Grid rings */}
      {[25, 50, 75, 100].map((pct) => (
        <polygon
          key={pct}
          points={Array.from({ length: COUNT }, (_, i) => polarToXY(i, (pct / 100) * MAX_R).join(',')).join(' ')}
          fill="none"
          stroke="currentColor"
          className="text-zinc-800"
          strokeWidth={1}
        />
      ))}
      {/* Axes */}
      {Array.from({ length: COUNT }, (_, i) => {
        const [x, y] = polarToXY(i, MAX_R);
        return <line key={i} x1={CX} y1={CY} x2={x} y2={y} stroke="currentColor" className="text-zinc-800" strokeWidth={1} />;
      })}
      {/* Data polygon */}
      <motion.polygon
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        style={{ transformOrigin: `${CX}px ${CY}px` }}
        points={polygon}
        fill="rgba(16,185,129,0.2)"
        stroke="rgb(16,185,129)"
        strokeWidth={2}
      />
      {/* Labels */}
      {LABELS.map((label, i) => {
        const [x, y] = polarToXY(i, MAX_R + 18);
        return (
          <text key={label} x={x} y={y} textAnchor="middle" dominantBaseline="middle" className="fill-zinc-400 text-[10px] font-semibold">
            {label}
          </text>
        );
      })}
    </svg>
  );
}
