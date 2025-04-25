import React, { useState, useRef, useEffect } from 'react';
import * as d3 from 'd3';
import TimelineItem from './TimelineItem';
import EditForm from './EditForm';
import NewCardPlaceholder from './NewCardPlaceholder';
import '../styles/Timeline.css';

function Timeline({ jobs, onAddJob, onUpdateJob, onDeleteJob, onReorderJobs, onShowJobDetails, onShowMap }) {
  const [editingIndex, setEditingIndex] = useState(null);
  const [newJobData, setNewJobData] = useState(null);
  const [draggedItemIndex, setDraggedItemIndex] = useState(null);
  
  const svgRef = useRef(null);
  const timelineElementRef = useRef(null);
  
  // Calculate timeline height based on content
  const timelineHeight = Math.max((jobs.length + 1) * 150 + 100, 300);
  
  // Draw the timeline line using D3
  useEffect(() => {
    if (!svgRef.current) return;
    
    const svg = d3.select(svgRef.current);
    svg.selectAll('.timeline-line').remove();
    
    if (jobs.length > 0) {
      svg.append('line')
        .attr('class', 'timeline-line')
        .attr('x1', 30)
        .attr('x2', 30)
        .attr('y1', 0)
        .attr('y2', timelineHeight);
    }
  }, [jobs.length, timelineHeight]);
  
  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    const options = { year: 'numeric', month: 'short' };
    return date.toLocaleDateString('en-US', options);
  };
  
  const handleEdit = (index) => {
    setEditingIndex(index);
    setNewJobData(null);
  };
  
  const handleSave = (index, updatedJobData) => {
    const updatedJob = { ...jobs[index], ...updatedJobData };
    onUpdateJob(updatedJob);
    setEditingIndex(null);
  };
  
  const handleCancelEdit = () => {
    setEditingIndex(null);
  };
  
  const handleCreateNew = () => {
    const newJob = {
      id: `temp-${Date.now()}`,
      title: '',
      company: '',
      responsibilities: '',
      startDate: '',
      endDate: '',
      currentJob: false,
      location: ''
    };
    setNewJobData(newJob);
  };
  
  const handleSaveNew = (jobData) => {
    onAddJob(jobData);
    setNewJobData(null);
  };
  
  const handleCancelNew = () => {
    setNewJobData(null);
  };
  
  // Drag and Drop handlers
  const handleDragStart = (e, index) => {
    setDraggedItemIndex(index);
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', index.toString());
    
    // Add a class after a small delay to avoid flickering
    setTimeout(() => {
      e.target.classList.add('dragging');
    }, 0);
  };
  
  const handleDragEnd = (e) => {
    e.target.classList.remove('dragging');
    setDraggedItemIndex(null);
  };
  
  const handleDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };
  
  const handleDragEnter = (e, index) => {
    e.preventDefault();
    const target = e.currentTarget;
    target.classList.add('drag-over');
  };
  
  const handleDragLeave = (e) => {
    e.currentTarget.classList.remove('drag-over');
  };
  
  const handleDrop = (e, targetIndex) => {
    e.preventDefault();
    e.currentTarget.classList.remove('drag-over');
    
    if (draggedItemIndex === null || draggedItemIndex === targetIndex) return;
    
    const reorderedJobs = [...jobs];
    const [draggedJob] = reorderedJobs.splice(draggedItemIndex, 1);
    reorderedJobs.splice(targetIndex, 0, draggedJob);
    
    onReorderJobs(reorderedJobs);
    setDraggedItemIndex(null);
  };
  
  return (
    <div className="timeline-container" id="timeline-container">
      <svg 
        ref={svgRef} 
        width="60" 
        height={timelineHeight} 
        className="timeline-axis"
      />
      
      <div ref={timelineElementRef} className="timeline-elements">
        {jobs.map((job, index) => (
          <div 
            key={job.id}
            className="timeline-item job-item"
            onDragOver={handleDragOver}
            onDragEnter={(e) => handleDragEnter(e, index)}
            onDragLeave={handleDragLeave}
            onDrop={(e) => handleDrop(e, index)}
          >
            <div className="timeline-dot"></div>
            {editingIndex === index ? (
              <EditForm 
                job={job}
                onSave={(data) => handleSave(index, data)}
                onCancel={handleCancelEdit}
              />
            ) : (
              <TimelineItem 
                job={job}
                formatDate={formatDate}
                onEdit={() => handleEdit(index)}
                onDelete={() => onDeleteJob(job.id)}
                onShowDetails={() => onShowJobDetails(job)}
                onShowMap={() => onShowMap(job.location)}
                onDragStart={(e) => handleDragStart(e, index)}
                onDragEnd={handleDragEnd}
              />
            )}
          </div>
        ))}
        
        {newJobData && (
          <div className="timeline-item new-job-item">
            <div className="timeline-dot"></div>
            <EditForm
              job={newJobData}
              onSave={handleSaveNew}
              onCancel={handleCancelNew}
              isNew={true}
            />
          </div>
        )}
        
        {!newJobData && (
          <NewCardPlaceholder onCreate={handleCreateNew} />
        )}
      </div>
    </div>
  );
}

export default Timeline;
