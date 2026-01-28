import React, { useState } from 'react';
import FileLoader from './Loader';
import TspMap from './Map';
import Solution from './Solution';
import AlgorithmControls from './AlgorithmControls';
import Chart from './Chart'; 
import './App.css';

function App() {
  const [cities, setCities] = useState([]);
  const [path, setPath] = useState([]);
  const [history, setHistory] = useState([]);

  const shuffleArray = (array) => {
    const newArray = [...array];
    for (let i = newArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray;
  };

  const calculateInitialDistance = (citiesArr, pathArr) => {
    if(!citiesArr.length) return 0;
    let sum = 0;
    for (let i = 0; i < pathArr.length; i++) {
        const c1 = citiesArr[pathArr[i]];
        const c2 = citiesArr[pathArr[(i + 1) % pathArr.length]];
        const dx = c1.x - c2.x;
        const dy = c1.y - c2.y;
        sum += Math.sqrt(dx * dx + dy * dy);
    }
    return sum;
  };


  const handleDataLoaded = (loadedCities) => {
    setCities(loadedCities);
 
    const indices = loadedCities.map((_, index) => index);
    const randomPath = shuffleArray(indices);
    setPath(randomPath);

    const initDist = calculateInitialDistance(loadedCities, randomPath);
    setHistory([{ iteration: 0, distance: initDist }]);
  };

  const updatePath = (newPath) => {
    setPath(newPath);
  };

  const handleIterationUpdate = (iterNum, currentDist) => {
    setHistory(prevHistory => [
      ...prevHistory,
      { iteration: iterNum, distance: currentDist }
    ]);
  };

  return (
    <div className="app-container">
      <header className="app-header">
        <h1>Aplikacja TSP</h1>
      </header>

      <main>
        <FileLoader onDataLoaded={handleDataLoaded} />
        {cities.length > 0 && (
          <>
         
            <AlgorithmControls 
              cities={cities} 
              currentPath={path} 
              onUpdatePath={updatePath}
              onIteration={handleIterationUpdate} 
            />
            
           
            <Chart history={history} />
            <Solution cities={cities} path={path} />
            <TspMap points={cities} path={path} />
          </>
        )}
      </main>
    </div>
  );
}

export default App;