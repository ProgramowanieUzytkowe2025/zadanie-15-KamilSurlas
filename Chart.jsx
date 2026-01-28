import React from 'react';

export default function Chart({ history }) {
  if (!history || history.length < 2) {
    return (
      <div className="chart-placeholder">
        Uruchom algorytm, aby zobaczyć wykres postępu...
      </div>
    );
  }

  const width = 600;
  const height = 300; 
  const padding = 60;
  const tickCount = 5; 
  const maxIter = history[history.length - 1].iteration;
  const minIter = history[0].iteration;
  
  const distances = history.map(h => h.distance);
  const minDist = Math.min(...distances);
  const maxDist = Math.max(...distances);

  const getX = (iter) => {
    if (maxIter === minIter) return padding;
    return padding + ((iter - minIter) / (maxIter - minIter)) * (width - 2 * padding);
  };

  const getY = (dist) => {
    if (maxDist === minDist) return height / 2;
    const normalized = (dist - minDist) / (maxDist - minDist);
    return (height - padding) - (normalized * (height - 2 * padding));
  };

  const yTicks = Array.from({ length: tickCount }).map((_, i) => {
    const value = minDist + (maxDist - minDist) * (i / (tickCount - 1));
    return {
      value: Math.round(value),
      y: getY(value)
    };
  });

  const xTicks = Array.from({ length: tickCount }).map((_, i) => {
    const value = minIter + (maxIter - minIter) * (i / (tickCount - 1));
    return {
      value: Math.round(value),
      x: getX(value)
    };
  });

  const points = history
    .map(point => `${getX(point.iteration)},${getY(point.distance)}`)
    .join(' ');

  return (
    <div className="chart-container">
      <h3 className="chart-title">Wykres zbieżności (Pełny przebieg)</h3>
      
      <svg viewBox={`0 0 ${width} ${height}`} className="chart-svg">
 
        {yTicks.map((tick, i) => (
          <g key={`y-grid-${i}`}>
            <line 
              x1={padding} 
              y1={tick.y} 
              x2={width - padding} 
              y2={tick.y} 
              stroke="#e0e0e0" 
              strokeWidth="1" 
              strokeDasharray="4" 
            />

            <text 
              x={padding - 10} 
              y={tick.y} 
              dy="4" 
              textAnchor="end" 
              fontSize="11" 
              fill="#666"
            >
              {tick.value}
            </text>
          </g>
        ))}

        {xTicks.map((tick, i) => (
          <g key={`x-grid-${i}`}>
            <line 
              x1={tick.x} 
              y1={padding} 
              x2={tick.x} 
              y2={height - padding} 
              stroke="#e0e0e0" 
              strokeWidth="1" 
              strokeDasharray="4"
            />
            <text 
              x={tick.x} 
              y={height - padding + 20} 
              textAnchor="middle" 
              fontSize="11" 
              fill="#666"
            >
              {tick.value}
            </text>
          </g>
        ))}

        <line x1={padding} y1={padding} x2={padding} y2={height - padding} stroke="#ccc" strokeWidth="2" />
        <line x1={padding} y1={height - padding} x2={width - padding} y2={height - padding} stroke="#ccc" strokeWidth="2" />

        <polyline
          points={points}
          fill="none"
          stroke="#007bff"
          strokeWidth="1.5"
          strokeLinejoin="round"
        />

        <text 
          x={15} 
          y={height / 2} 
          textAnchor="middle" 
          transform={`rotate(-90 15, ${height / 2})`} 
          fontSize="12" 
          fontWeight="bold" 
          fill="#333"
        >
          Długość trasy
        </text>

        <text 
          x={width / 2} 
          y={height - 10} 
          textAnchor="middle" 
          fontSize="12" 
          fontWeight="bold" 
          fill="#333"
        >
          Liczba iteracji
        </text>

      </svg>
    </div>
  );
}