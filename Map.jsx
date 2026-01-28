import React, { useRef, useEffect, useState } from 'react';

export default function TspMap({ points, path }) {
  const canvasRef = useRef(null);
  const [showLines, setShowLines] = useState(false);

  const CANVAS_WIDTH = 800;
  const CANVAS_HEIGHT = 600;
  const PADDING = 40;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !points || points.length === 0) return;

    const ctx = canvas.getContext('2d');
    

    ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

    const minX = Math.min(...points.map(p => p.x));
    const maxX = Math.max(...points.map(p => p.x));
    const minY = Math.min(...points.map(p => p.y));
    const maxY = Math.max(...points.map(p => p.y));

    const dataWidth = maxX - minX;
    const dataHeight = maxY - minY;

    const availableWidth = CANVAS_WIDTH - (PADDING * 2);
    const availableHeight = CANVAS_HEIGHT - (PADDING * 2);
    
    const scaleX = availableWidth / dataWidth;
    const scaleY = availableHeight / dataHeight;
    const scale = Math.min(scaleX, scaleY);

    const offsetX = (CANVAS_WIDTH - (dataWidth * scale)) / 2;
    const offsetY = (CANVAS_HEIGHT - (dataHeight * scale)) / 2;

    const toX = (val) => (val - minX) * scale + offsetX;
    const toY = (val) => (val - minY) * scale + offsetY;


    if (showLines && path && path.length > 0) {
      ctx.beginPath();
      ctx.strokeStyle = '#6366f1';
      ctx.lineWidth = 2;
      ctx.lineJoin = 'round';
      ctx.lineCap = 'round';
      ctx.globalAlpha = 0.6;
      const startCity = points[path[0]];
      ctx.moveTo(toX(startCity.x), toY(startCity.y));

      for (let i = 1; i < path.length; i++) {
        const city = points[path[i]];
        ctx.lineTo(toX(city.x), toY(city.y));
      }

      ctx.lineTo(toX(startCity.x), toY(startCity.y));
      
      ctx.stroke(); 
      ctx.globalAlpha = 1.0; 
    }

    points.forEach(point => {
      const px = toX(point.x);
      const py = toY(point.y);

      ctx.beginPath();
      ctx.fillStyle = '#e11d48'; 
      ctx.arc(px, py, 4, 0, 2 * Math.PI); 
      ctx.fill();
    });

  }, [points, path, showLines]); 
  if (!points || points.length === 0) {
    return <p style={{ textAlign: 'center', color: '#999' }}>Wczytaj plik, aby zobaczyć mapę.</p>;
  }

  return (
    <div className="map-container">
      <div className="map-header-row">
        <h2 className="map-title" style={{ margin: 0 }}>Wizualizacja problemu</h2>
        
        <button 
          onClick={() => setShowLines(!showLines)}
          className="toggle-path-btn"
        >
          {showLines ? 'Ukryj rozwiązanie' : 'Pokaż rozwiązanie'}
        </button>
      </div>
      
      <canvas 
        ref={canvasRef}
        width={CANVAS_WIDTH}
        height={CANVAS_HEIGHT}
        style={{ 
          width: '100%', 
          height: 'auto', 
          display: 'block',
          backgroundColor: '#fafafa',
          borderRadius: '4px'
        }}
      />
    </div>
  );
}