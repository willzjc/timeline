import React, { useState, useEffect, useRef } from 'react';
import * as d3 from 'd3';
// Update the CSS import path
import '../styles/Timeline.css';

function TimelineResume({ onShowMap, jobs, setJobs }) {
  const [editingIndex, setEditingIndex] = useState(null);
  const [draggedItemIndex, setDraggedItemIndex] = useState(null);
  
  const containerRef = useRef(null);
  const svgRef = useRef(null);
  const timelineElementRef = useRef(null);
  const timelineElementsRef = useRef(null);
  
  // Initialize the timeline structure
  useEffect(() => {
    if (!svgRef.current || !timelineElementRef.current) return;
    
    // Set up the timeline structure
    const svg = d3.select(svgRef.current)
      .attr('width', 60)
      .attr('class', 'timeline-axis');
    
    // Update the timeline when window resizes
    const handleResize = () => {
      const containerWidth = containerRef.current ? 
        parseInt(window.getComputedStyle(containerRef.current).width) - 40 : 1160;
      
      updateTimelineDimensions(containerWidth);
      updateTimelineHeight();
    };
    
    window.addEventListener('resize', handleResize);
    handleResize(); // Initial call
    
    // Set up ResizeObserver to monitor content height changes
    const resizeObserver = new ResizeObserver(() => {
      updateTimelineHeight();
    });
    
    if (timelineElementRef.current) {
      resizeObserver.observe(timelineElementRef.current);
    }
    
    return () => {
      window.removeEventListener('resize', handleResize);
      resizeObserver.disconnect();
    };
  }, []);
  
  // Update the timeline whenever jobs change
  useEffect(() => {
    updateTimeline();
    
    // Add a small delay to ensure DOM has updated with new content
    setTimeout(() => {
      updateTimelineHeight();
    }, 100);
  }, [jobs]);
  
  // Helper function to update timeline dimensions
  const updateTimelineDimensions = (width) => {
    // Logic to adjust timeline based on width
  };
  
  // Calculate and update timeline height based on actual content
  const updateTimelineHeight = () => {
    if (!svgRef.current || !timelineElementRef.current) return;
    
    // Get the actual height of the timeline content
    const elementsHeight = timelineElementRef.current.scrollHeight;
    const timelineHeight = Math.max(elementsHeight, 300); // Minimum 300px height
    
    // Update SVG height
    d3.select(svgRef.current).attr('height', timelineHeight);
    
    // Update timeline line
    drawTimelineLine(timelineHeight);
  };
  
  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    const options = { year: 'numeric', month: 'short' };
    return date.toLocaleDateString('en-US', options);
  };
  
  // Add a new job
  const addJob = (job) => {
    setJobs([...jobs, job]);
  };
  
  // Update timeline visualization
  const updateTimeline = () => {
    if (!svgRef.current || !timelineElementRef.current) return;
    updateTimelineHeight();
  };
  
  // Draw the timeline vertical line with the accurate height
  const drawTimelineLine = (height) => {
    const svg = d3.select(svgRef.current);
    svg.select(".timeline-line").remove();
    
    if (jobs.length > 0) {
      svg.append("line")
        .attr("class", "timeline-line")
        .attr("x1", 30)
        .attr("y1", 0)
        .attr("x2", 30)
        .attr("y2", height - 20); // Slight padding at bottom
    }
  };
  
  // Create new job entry
  const createNewJob = () => {
    const newJob = {
      id: Date.now().toString(), // Unique ID
      title: '',
      company: '',
      responsibilities: '',
      startDate: '',
      endDate: '',
      currentJob: false,
      location: ''
    };
    
    setJobs([...jobs, newJob]);
    setEditingIndex(jobs.length); // Edit the newly added job
  };
  
  // Edit existing job
  const editJob = (index) => {
    setEditingIndex(index);
  };
  
  // Save job after editing
  const saveJob = (index, updatedJob) => {
    const updatedJobs = [...jobs];
    updatedJobs[index] = { ...updatedJobs[index], ...updatedJob };
    setJobs(updatedJobs);
    setEditingIndex(null);
    
    // Allow time for DOM to update before recalculating height
    setTimeout(updateTimelineHeight, 100);
  };
  
  // Cancel editing a job
  const cancelEdit = (index) => {
    // If it was a new job with empty data, remove it
    if (index === jobs.length - 1 && isEmptyJob(jobs[index])) {
      const updatedJobs = [...jobs];
      updatedJobs.pop();
      setJobs(updatedJobs);
    }
    
    setEditingIndex(null);
  };
  
  // Check if job is empty (for removing empty new jobs)
  const isEmptyJob = (job) => {
    return !job.title && !job.company && !job.responsibilities && !job.startDate;
  };
  
  // Delete a job
  const deleteJob = (index) => {
    if (window.confirm('Are you sure you want to delete this job entry?')) {
      const updatedJobs = [...jobs];
      updatedJobs.splice(index, 1);
      setJobs(updatedJobs);
      
      if (editingIndex === index) {
        setEditingIndex(null);
      }
    }
  };
  
  // Handle drag and drop reordering
  const handleDragStart = (e, index) => {
    setDraggedItemIndex(index);
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', index);
  };
  
  const handleDrop = (e, targetIndex) => {
    e.preventDefault();
    
    if (draggedItemIndex === null || targetIndex === draggedItemIndex) {
      return;
    }
    
    // Reorder the jobs array
    const updatedJobs = [...jobs];
    const [draggedJob] = updatedJobs.splice(draggedItemIndex, 1);
    updatedJobs.splice(targetIndex, 0, draggedJob);
    
    setJobs(updatedJobs);
    setDraggedItemIndex(null);
  };
  
  return (
    <div ref={containerRef} id="timeline-container" className="timeline-resume-container">
      <svg ref={svgRef} className="timeline-axis">
        {/* D3 will add the line here */}
      </svg>
      
      <div ref={timelineElementRef} className="timeline-elements">
        {jobs.map((job, index) => (
          <div 
            key={job.id || index}
            className={`timeline-item job-item ${draggedItemIndex === index ? 'dragging' : ''}`}
            data-index={index}
            onDragOver={(e) => e.preventDefault()}
            onDragEnter={(e) => {
              e.preventDefault();
              e.currentTarget.classList.add('drag-over');
            }}
            onDragLeave={(e) => {
              e.currentTarget.classList.remove('drag-over');
            }}
            onDrop={(e) => {
              e.currentTarget.classList.remove('drag-over');
              handleDrop(e, index);
            }}
          >
            <div className="timeline-dot"></div>
            
            {editingIndex === index ? (
              <div className="timeline-content edit-mode">
                <div className="timeline-arrow"></div>
                <form className="edit-form" onSubmit={(e) => {
                  e.preventDefault();
                  const formData = new FormData(e.target);
                  const updatedJob = {
                    title: formData.get('title'),
                    company: formData.get('company'),
                    responsibilities: formData.get('responsibilities'),
                    startDate: formData.get('startDate'),
                    endDate: formData.get('currentJob') ? '' : formData.get('endDate'),
                    currentJob: formData.get('currentJob') === 'on',
                    location: formData.get('location')
                  };
                  saveJob(index, updatedJob);
                }}>
                  {/* Job Form Fields */}
                  <div className="form-group">
                    <label htmlFor={`job-title-${index}`}>Job Title:</label>
                    <input
                      type="text"
                      id={`job-title-${index}`}
                      name="title"
                      defaultValue={job.title}
                      required
                    />
                  </div>
                  
                  <div className="form-group">
                    <label htmlFor={`company-${index}`}>Company:</label>
                    <input
                      type="text"
                      id={`company-${index}`}
                      name="company"
                      defaultValue={job.company}
                      required
                    />
                  </div>
                  
                  <div className="form-group">
                    <label htmlFor={`responsibilities-${index}`}>Responsibilities:</label>
                    <textarea
                      id={`responsibilities-${index}`}
                      name="responsibilities"
                      rows={4}
                      defaultValue={job.responsibilities}
                      required
                    ></textarea>
                  </div>
                  
                  <div className="form-group">
                    <label htmlFor={`start-date-${index}`}>Start Date:</label>
                    <input
                      type="date"
                      id={`start-date-${index}`}
                      name="startDate"
                      defaultValue={job.startDate}
                      required
                    />
                  </div>
                  
                  <div className="form-group">
                    <label htmlFor={`end-date-${index}`}>End Date:</label>
                    <input
                      type="date"
                      id={`end-date-${index}`}
                      name="endDate"
                      defaultValue={job.endDate}
                      disabled={job.currentJob}
                    />
                    
                    <div className="checkbox-group">
                      <input
                        type="checkbox"
                        id={`current-job-${index}`}
                        name="currentJob"
                        defaultChecked={job.currentJob}
                        onChange={(e) => {
                          document.getElementById(`end-date-${index}`).disabled = e.target.checked;
                        }}
                      />
                      <label htmlFor={`current-job-${index}`}>Current Job</label>
                    </div>
                  </div>
                  
                  <div className="form-group">
                    <label htmlFor={`location-${index}`}>Location:</label>
                    <input
                      type="text"
                      id={`location-${index}`}
                      name="location"
                      defaultValue={job.location}
                    />
                  </div>
                  
                  <div className="edit-actions">
                    <button
                      type="button"
                      className="cancel-btn"
                      onClick={() => cancelEdit(index)}
                    >
                      Cancel
                    </button>
                    <button type="submit" className="save-btn">Save</button>
                  </div>
                </form>
              </div>
            ) : (
              <div
                className="timeline-content draggable"
                draggable={true}
                onDragStart={(e) => handleDragStart(e, index)}
                onDragEnd={() => setDraggedItemIndex(null)}
              >
                <div className="timeline-arrow"></div>
                <div className="drag-handle" title="Drag to reorder"></div>
                
                <div className="card-actions">
                  <button
                    className="edit-btn"
                    title="Edit"
                    onClick={() => editJob(index)}
                  >
                    ✏️
                  </button>
                  <button
                    className="delete-btn"
                    title="Delete"
                    onClick={() => deleteJob(index)}
                  >
                    🗑️
                  </button>
                </div>
                
                <div className="timeline-date">
                  {`${formatDate(job.startDate)} - ${job.currentJob ? 'Present' : formatDate(job.endDate)}`}
                </div>
                <h3 className="timeline-title">{job.title}</h3>
                <div className="timeline-company">{job.company}</div>
                
                {job.location && (
                  <div
                    className="timeline-location"
                    onClick={(e) => {
                      e.stopPropagation();
                      onShowMap(job.location);
                    }}
                  >
                    {job.location}
                  </div>
                )}
                
                <div className="timeline-responsibilities">{job.responsibilities}</div>
              </div>
            )}
          </div>
        ))}
        
        {/* New Card Placeholder */}
        <div className="timeline-item new-card-item">
          <div
            className="timeline-content new-card"
            onClick={createNewJob}
          >
            <div className="new-card-icon">+</div>
            <div className="new-card-text">Add new job entry</div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default TimelineResume;
