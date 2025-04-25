import React, { useState } from 'react';
import './EditForm.css';

function EditForm({ job, onSave, onCancel, isNew = false }) {
  const [formData, setFormData] = useState({
    title: job.title || '',
    company: job.company || '',
    responsibilities: job.responsibilities || '',
    startDate: job.startDate || '',
    endDate: job.endDate || '',
    currentJob: job.currentJob || false,
    location: job.location || '',
  });
  
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({
      ...job,
      ...formData,
      endDate: formData.currentJob ? '' : formData.endDate
    });
  };
  
  return (
    <div className="timeline-content edit-mode">
      <div className="timeline-arrow"></div>
      
      <form className="edit-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="job-title">Job Title:</label>
          <input
            type="text"
            id="job-title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="company">Company:</label>
          <input
            type="text"
            id="company"
            name="company"
            value={formData.company}
            onChange={handleChange}
            required
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="responsibilities">Responsibilities:</label>
          <textarea
            id="responsibilities"
            name="responsibilities"
            rows="4"
            value={formData.responsibilities}
            onChange={handleChange}
            required
          ></textarea>
        </div>
        
        <div className="form-group">
          <label htmlFor="start-date">Start Date:</label>
          <input
            type="date"
            id="start-date"
            name="startDate"
            value={formData.startDate}
            onChange={handleChange}
            required
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="end-date">End Date:</label>
          <input
            type="date"
            id="end-date"
            name="endDate"
            value={formData.endDate}
            onChange={handleChange}
            disabled={formData.currentJob}
          />
          
          <div className="checkbox-group">
            <input
              type="checkbox"
              id="current-job"
              name="currentJob"
              checked={formData.currentJob}
              onChange={handleChange}
            />
            <label htmlFor="current-job">Current Job</label>
          </div>
        </div>
        
        <div className="form-group">
          <label htmlFor="location">Location:</label>
          <input
            type="text"
            id="location"
            name="location"
            value={formData.location}
            onChange={handleChange}
          />
        </div>
        
        <div className="edit-actions">
          <button type="button" className="cancel-btn" onClick={onCancel}>
            Cancel
          </button>
          <button type="submit" className="save-btn">
            Save
          </button>
        </div>
      </form>
    </div>
  );
}

export default EditForm;
