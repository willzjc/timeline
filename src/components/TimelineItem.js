import React from 'react';

function TimelineItem({ job, formatDate, onEdit, onDelete, onShowDetails, onShowMap, onDragStart, onDragEnd }) {
  const endDateText = job.currentJob ? 'Present' : formatDate(job.endDate);
  
  return (
    <div 
      className="timeline-content draggable"
      draggable="true"
      onDragStart={onDragStart}
      onDragEnd={onDragEnd}
    >
      <div className="timeline-arrow"></div>
      
      <div className="card-actions">
        <button className="edit-btn" title="Edit" onClick={onEdit}>✏️</button>
        <button className="delete-btn" title="Delete" onClick={onDelete}>🗑️</button>
      </div>
      
      <div className="timeline-date">
        {`${formatDate(job.startDate)} - ${endDateText}`}
      </div>
      
      <h3 className="timeline-title">{job.title}</h3>
      <div className="timeline-company">{job.company}</div>
      
      {job.location && (
        <div 
          className="timeline-location"
          onClick={(e) => {
            e.stopPropagation();
            onShowMap();
          }}
        >
          {job.location}
        </div>
      )}
      
      <div className="timeline-responsibilities">{job.responsibilities}</div>
    </div>
  );
}

export default TimelineItem;
