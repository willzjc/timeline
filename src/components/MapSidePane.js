import React, { useEffect } from 'react';
import CONFIG from '../config';
import './MapSidePane.css';

function MapSidePane({ location, onClose }) {
  // Get API key from config file
  const apiKey = CONFIG?.GOOGLE_MAPS_API_KEY || '';

  // If no API key is available, use the keyless embed version
  const mapSrc = apiKey
    ? `https://www.google.com/maps/embed/v1/place?key=${apiKey}&q=${encodeURIComponent(
        location
      )}`
    : `https://maps.google.com/maps?q=${encodeURIComponent(
        location
      )}&output=embed`;
  
  // Add class to body when map is open to enable the side-by-side layout
  useEffect(() => {
    document.body.classList.add('map-open');
    
    // Clean up function to remove class when component unmounts
    return () => {
      document.body.classList.remove('map-open');
    };
  }, []);

  return (
    <div id="map-side-pane" className="map-side-pane">
      <div className="map-header">
        <h3 className="map-title">{location}</h3>
        <button className="map-close-btn" onClick={onClose}>&times;</button>
      </div>
      <div id="map-container" className="map-container">
        <iframe
          title="Location Map"
          width="100%"
          height="100%"
          frameBorder="0"
          style={{ border: 0 }}
          src={mapSrc}
          allowFullScreen
        ></iframe>
      </div>
    </div>
  );
}

export default MapSidePane;
