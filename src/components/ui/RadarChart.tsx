import React from 'react';

export interface RadarChartData {
  labels: string[];
  datasets: Array<{
    label: string;
    data: number[];
    backgroundColor?: string;
    borderColor?: string;
    pointBackgroundColor?: string;
    pointBorderColor?: string;
  }>;
}

interface RadarChartProps {
  data: RadarChartData;
}

const CENTER = 120;
const RADIUS = 76;
const LEVELS = [0.25, 0.5, 0.75, 1];

function pointAt(index: number, count: number, radius: number): [number, number] {
  const angle = (Math.PI * 2 * index) / count - Math.PI / 2;
  return [CENTER + Math.cos(angle) * radius, CENTER + Math.sin(angle) * radius];
}

function RadarChartComponent({ data }: RadarChartProps) {
  const values = data.datasets[0]?.data ?? [];
  const count = Math.min(data.labels.length, values.length);
  if (count < 3) return null;

  const polygonPoints = values.slice(0, count).map((value, index) => {
    const [x, y] = pointAt(index, count, RADIUS * Math.max(0, Math.min(100, value)) / 100);
    return `${x},${y}`;
  }).join(' ');
  const label = data.labels.slice(0, count).map((name, index) => `${name}: ${values[index]}%`).join(', ');

  return (
    <svg
      className="w-full h-full max-w-[280px] overflow-visible"
      viewBox="0 0 240 240"
      role="img"
      aria-label={`Skill radar chart. ${label}`}
    >
      <defs>
        <linearGradient id="radar-fill" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#00f5ff" stopOpacity="0.38" />
          <stop offset="100%" stopColor="#39ff14" stopOpacity="0.12" />
        </linearGradient>
        <filter id="radar-glow" x="-40%" y="-40%" width="180%" height="180%">
          <feGaussianBlur stdDeviation="2.5" result="blur" />
          <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
      </defs>
      {LEVELS.map((level) => (
        <polygon
          key={level}
          points={Array.from({ length: count }, (_, index) => pointAt(index, count, RADIUS * level).join(',')).join(' ')}
          fill="none"
          stroke="rgba(127,168,196,0.24)"
          strokeWidth="1"
        />
      ))}
      {data.labels.slice(0, count).map((name, index) => {
        const [x, y] = pointAt(index, count, RADIUS);
        const [labelX, labelY] = pointAt(index, count, RADIUS + 21);
        return (
          <g key={name}>
            <line x1={CENTER} y1={CENTER} x2={x} y2={y} stroke="rgba(127,168,196,0.24)" strokeWidth="1" />
            <text x={labelX} y={labelY} fill="#9fb4c6" fontSize="8" textAnchor="middle" dominantBaseline="middle" className="font-mono">
              {name}
            </text>
          </g>
        );
      })}
      <polygon points={polygonPoints} fill="url(#radar-fill)" stroke="#00f5ff" strokeWidth="2" strokeLinejoin="round" filter="url(#radar-glow)" />
      {values.slice(0, count).map((value, index) => {
        const [x, y] = pointAt(index, count, RADIUS * Math.max(0, Math.min(100, value)) / 100);
        return <circle key={`${data.labels[index]}-point`} cx={x} cy={y} r="3" fill="#39ff14" stroke="#050b10" strokeWidth="1.5" />;
      })}
    </svg>
  );
}

export default React.memo(RadarChartComponent);
