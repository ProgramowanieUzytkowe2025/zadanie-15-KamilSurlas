import React from 'react';

export default function Solution({ cities, path }) {
  if (!cities || cities.length === 0 || !path || path.length === 0) {
    return null;
  }

  const getEuklDistance = (cityA, cityB) => {
    const dx = cityA.x - cityB.x;
    const dy = cityA.y - cityB.y;
    return Math.sqrt(dx * dx + dy * dy);
  };

  const totalDistance = path.reduce((sum, cityIndex, i) => {
    const currentCity = cities[cityIndex];
    
    const nextCityIndex = path[(i + 1) % path.length];
    const nextCity = cities[nextCityIndex];
    
    return sum + getEuklDistance(currentCity, nextCity);
  }, 0);

  const pathString = path.map(idx => cities[idx].id).join(' -> ');

  return (
    <div className="solution-container">
      <h2 className="solution-title">Rozwiązanie</h2>
      
      <div className="path-display">
        {pathString}
        {' -> ' + cities[path[0]].id}
      </div>

      <div className="distance-display">
        Długość trasy: <strong>{totalDistance.toFixed(2)}</strong>
      </div>
    </div>
  );
}