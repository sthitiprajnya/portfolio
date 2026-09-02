import React from 'react';

interface RadarChartProps {
  data: any;
  options?: any;
}

function RadarChartComponent({ data, options }: RadarChartProps) {
  // A simple placeholder for the radar chart since chart.js is removed
  return (
    <div className="w-full h-full flex items-center justify-center border border-cyan/30 rounded-full bg-cyan/5">
      <span className="text-cyan font-mono text-xs">Radar Chart (Static SVG)</span>
    </div>
  );
}

export default React.memo(RadarChartComponent);
