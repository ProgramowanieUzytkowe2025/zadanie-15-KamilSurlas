import React, { useState, useEffect, useRef } from 'react';

export default function AlgorithmControls({ cities, currentPath, onUpdatePath, onIteration }) {
  const [isRunning, setIsRunning] = useState(false);
  const [iterations, setIterations] = useState(0);
  
  const intervalRef = useRef(null);

  const calculateDistance = (pathToCheck) => {
    let sum = 0;
    for (let i = 0; i < pathToCheck.length; i++) {
      const currentCity = cities[pathToCheck[i]];
      const nextCity = cities[pathToCheck[(i + 1) % pathToCheck.length]];
      
      const dx = currentCity.x - nextCity.x;
      const dy = currentCity.y - nextCity.y;
      sum += Math.sqrt(dx * dx + dy * dy);
    }
    return sum;
  };

  const shufflePath = (basePath) => {
    const newPath = [...basePath];
    for (let i = newPath.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [newPath[i], newPath[j]] = [newPath[j], newPath[i]];
    }
    return newPath;
  };

  useEffect(() => {
    if (isRunning) {
      intervalRef.current = setInterval(() => {
        setIterations((prevIter) => {
          const newIter = prevIter + 1;
          
          const currentBestDist = calculateDistance(currentPath);

          const candidatePath = shufflePath(currentPath);
          const candidateDist = calculateDistance(candidatePath);
          
          if (onIteration) {
            onIteration(newIter, candidateDist);
          }

          if (candidateDist < currentBestDist) {
            onUpdatePath(candidatePath);
          }

          return newIter;
        });

      }, 100); // Interwał 100ms
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isRunning, cities, currentPath, onUpdatePath, onIteration]);

  const handleToggle = () => {
    setIsRunning(!isRunning);
  };

  return (
    <div className="controls-container">
      <button 
        onClick={handleToggle}
        className={`control-button ${isRunning ? 'stop-btn' : 'start-btn'}`}
      >
        {isRunning ? 'Przerwa' : 'Szukaj rozwiązania'}
      </button>

      <div className="stats-info">
        Liczba iteracji: <strong>{iterations}</strong>
      </div>
    </div>
  );
}