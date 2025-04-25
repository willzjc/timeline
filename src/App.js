import React, { useState, useEffect } from 'react';
import TimelineResume from './components/TimelineResume';
import MapSidePane from './components/MapSidePane';
import './App.css';

function App() {
  const [mapLocation, setMapLocation] = useState(null);

  const showMapSidePane = (location) => {
    setMapLocation(location);
  };

  const closeMapSidePane = () => {
    setMapLocation(null);
  };

  return (
    <div className={`app-container ${mapLocation ? 'map-open' : ''}`}>
      <div className="container">
        <h1 className="animated-title">Timeline Resume</h1>
        <div className="controls">
          <button id="zoom-in"><i className="fas fa-search-plus"></i></button>
          <button id="zoom-out"><i className="fas fa-search-minus"></i></button>
          <button id="reset-view"><i className="fas fa-sync"></i></button>
        </div>
        <TimelineResume 
          onShowMap={showMapSidePane}
        />
        <div id="details-panel" className="hidden">
          <button className="close-btn"><i className="fas fa-times"></i></button>
          <div id="details-content"></div>
        </div>
      </div>
      
      {mapLocation && (
        <>
          <div className="map-overlay" onClick={closeMapSidePane}></div>
          <MapSidePane location={mapLocation} onClose={closeMapSidePane} />
        </>
      )}
    </div>
  );
}

export default App;
