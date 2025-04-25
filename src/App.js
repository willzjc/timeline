import React, { useState, useEffect } from 'react';
import TimelineResume from './components/TimelineResume';
import MapSidePane from './components/MapSidePane';
import sampleJobs from './data/sampleJobs';
import './styles/App.css';

function App() {
  const [mapLocation, setMapLocation] = useState(null);
  const [jobs, setJobs] = useState([]);

  // Load jobs from localStorage or use sample jobs if none exist
  useEffect(() => {
    const savedJobs = localStorage.getItem('timelineJobs');
    if (savedJobs && JSON.parse(savedJobs).length > 0) {
      setJobs(JSON.parse(savedJobs));
    } else {
      // Use sample jobs as default data
      setJobs(sampleJobs);
    }
  }, []);

  // Save jobs to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('timelineJobs', JSON.stringify(jobs));
  }, [jobs]);

  const showMapSidePane = (location) => {
    setMapLocation(location);
  };

  const closeMapSidePane = () => {
    setMapLocation(null);
  };

  return (
    <div className={`app-container ${mapLocation ? 'with-sidemap' : ''}`}>
      <div className="main-content">
        <div className="container">
          <h1 className="animated-title">Timeline Resume</h1>
          <TimelineResume 
            onShowMap={showMapSidePane}
            jobs={jobs}
            setJobs={setJobs}
          />
          <div id="details-panel" className="hidden">
            <div id="details-content"></div>
          </div>
        </div>
      </div>
      
      {mapLocation && (
        <div className="map-side-container">
          <button className="close-map-btn" onClick={closeMapSidePane}>×</button>
          <MapSidePane location={mapLocation} onClose={closeMapSidePane} />
        </div>
      )}
    </div>
  );
}

export default App;
