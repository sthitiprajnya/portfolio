import React from 'react';
import { Radar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend,
  type ChartData,
  type ChartOptions
} from 'chart.js';

// BOLT: True Lazy Loading Optimization
// Chart.js registration is moved inside this wrapper component rather than
// at the module level in parent components. This ensures that the heavy ~50KB
// Chart.js dependency is completely excluded from the main Next.js initial bundle
// and only loaded when a user actually scrolls to a section requiring a chart.
ChartJS.register(
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend
);

interface RadarChartProps {
  data: ChartData<'radar'>;
  options: ChartOptions<'radar'>;
}

function RadarChartComponent({ data, options }: RadarChartProps) {
  return <Radar data={data} options={options} />;
}

export default React.memo(RadarChartComponent);
