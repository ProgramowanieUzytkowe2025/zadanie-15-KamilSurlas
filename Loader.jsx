import React, { useState } from 'react';

export default function FileLoader({ onDataLoaded }) {
  const [fileName, setFileName] = useState('');
  const [error, setError] = useState('');

  const handleFileUpload = (e) => {
    const file = e.target.files && e.target.files[0];
    if (!file) return;

    setFileName(file.name);
    setError('');

    const reader = new FileReader();
    
    reader.onload = (event) => {
      const text = event.target.result;
      parseTspData(text);
    };

    reader.onerror = () => {
      setError("Błąd podczas odczytu pliku.");
    };

    reader.readAsText(file);
  };

  const parseTspData = (text) => {
    const lines = text.split('\n');
    const parsedCities = [];
    let isCoordSection = false;

    for (let line of lines) {
      line = line.trim();
      if (!line) continue;
      if (line === 'NODE_COORD_SECTION') {
        isCoordSection = true;
        continue;
      }
      if (line === 'EOF') break;

      if (isCoordSection) {
        const parts = line.replace(/\s+/g, ' ').split(' ');
        if (parts.length >= 3) {
          const id = parseInt(parts[0], 10);
          const x = parseFloat(parts[1]);
          const y = parseFloat(parts[2]);
          if (!isNaN(id) && !isNaN(x) && !isNaN(y)) {
            parsedCities.push({ id, x, y });
          }
        }
      }
    }

    if (parsedCities.length === 0) {
      setError("Nie znaleziono poprawnych danych w sekcji NODE_COORD_SECTION.");
    } else {
      onDataLoaded(parsedCities);
    }
  };

  return (
    <div className="loader-section">
      {error && <div className="error-message">{error}</div>}

      <div className="loader-container">
        <label className="file-label">
          <span className="upload-text">Kliknij, aby wybrać plik</span>
          <input 
            type="file" 
            accept=".tsp,.txt" 
            onChange={handleFileUpload} 
            className="hidden-input" 
          />
        </label>
        {fileName && <p className="file-name">Wybrany plik: {fileName}</p>}
      </div>
    </div>
  );
}