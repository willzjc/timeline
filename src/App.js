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
    <div className={`app-container ${mapLocation ? 'map-open' : ''}`}>
      <div className="container">
        <h1 className="animated-title">Timeline Resume</h1>
        <TimelineResume 
          onShowMap={showMapSidePane}
          jobs={jobs}
          setJobs={setJobs}
        />
        <div id="details-panel" className="hidden">
          {/* <button className="close-btn"><i className="fas fa-times"></i></button> */}
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
