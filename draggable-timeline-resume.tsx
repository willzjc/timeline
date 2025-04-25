import React, { useState, useEffect, useRef } from 'react';
import * as d3 from 'd3';

const TimelineResume = () => {
  const svgRef = useRef(null);
  const containerRef = useRef(null);
  
  // Initial sample data
  const initialJobData = [
    {
      id: 1,
      title: "Senior Developer",
      company: "Tech Solutions Inc.",
      startDate: "2020-01",
      endDate: "Present",
      responsibilities: [
        "Led team of 5 developers on client projects",
        "Implemented CI/CD pipeline reducing deployment time by 40%",
        "Mentored junior developers"
      ]
    },
    {
      id: 2,
      title: "Web Developer",
      company: "Digital Creations",
      startDate: "2017-06",
      endDate: "2019-12",
      responsibilities: [
        "Built responsive websites for 20+ clients",
        "Optimized site performance increasing load speed by 35%",
        "Collaborated with design team to implement UI/UX improvements"
      ]
    },
    {
      id: 3,
      title: "Junior Developer",
      company: "Startup Innovations",
      startDate: "2015-09",
      endDate: "2017-05",
      responsibilities: [
        "Developed and maintained company website",
        "Created internal tools for workflow management",
        "Participated in agile development process"
      ]
    }
  ];

  // Add an empty placeholder card for adding new entries
  const emptyCard = {
    id: -1,
    title: "Add New Position",
    company: "Click to edit",
    startDate: "",
    endDate: "",
    responsibilities: [],
    isPlaceholder: true
  };

  // States
  const [jobData, setJobData] = useState([...initialJobData, emptyCard]);
  const [editingId, setEditingId] = useState(null);
  const [editFormData, setEditFormData] = useState({
    title: "",
    company: "",
    startDate: "",
    endDate: "",
    responsibilities: ""
  });
  const [draggedItem, setDraggedItem] = useState(null);
  const [dragOverItem, setDragOverItem] = useState(null);
  
  // Generate a new unique ID
  const generateId = () => {
    const maxId = Math.max(...jobData.filter(job => job.id !== -1).map(job => job.id), 0);
    return maxId + 1;
  };

  // Draw the timeline when jobData changes
  useEffect(() => {
    if (!svgRef.current || !containerRef.current) return;

    // Clear any previous renderings
    d3.select(svgRef.current).selectAll("*").remove();
    
    const container = containerRef.current;
    const containerWidth = container.clientWidth;
    
    // Parse dates
    const parseTime = d3.timeParse("%Y-%m");
    
    const processedData = jobData.map(job => ({
      ...job,
      parsedStartDate: job.startDate ? parseTime(job.startDate) : null,
      parsedEndDate: job.endDate === "Present" ? new Date() : job.endDate ? parseTime(job.endDate) : null
    }));
    
    // Timeline dimensions
    const margin = { top: 40, right: 20, bottom: 40, left: 20 };
    const timelineWidth = 80;
    const cardWidth = containerWidth - timelineWidth - margin.left - margin.right;
    const itemHeight = 200; // Increased height for more space
    const height = Math.max(processedData.length * itemHeight, 100);
    
    // Create SVG
    const svg = d3.select(svgRef.current)
      .attr("width", containerWidth)
      .attr("height", height + margin.top + margin.bottom);
    
    // Create a group for the timeline
    const timelineGroup = svg.append("g")
      .attr("class", "timeline-group")
      .attr("transform", `translate(${margin.left + timelineWidth/2}, ${margin.top})`);
    
    // Draw the main vertical line
    timelineGroup.append("line")
      .attr("class", "timeline-line")
      .attr("y1", 0)
      .attr("y2", height)
      .attr("stroke", "#aaa")
      .attr("stroke-width", 1);
    
    // Create timeline points and job cards
    processedData.forEach((job, i) => {
      const yPos = i * itemHeight + itemHeight / 2;
      const isPlaceholder = job.isPlaceholder;
      const isEditing = job.id === editingId;
      
      // Timeline point (only for non-placeholder or when editing)
      if (!isPlaceholder || isEditing) {
        timelineGroup.append("circle")
          .attr("class", "timeline-point")
          .attr("cy", yPos)
          .attr("r", 6)
          .attr("fill", isPlaceholder ? "#eee" : "#fff")
          .attr("stroke", isPlaceholder ? "#ccc" : "#666")
          .attr("stroke-width", 1);
          
        // Connecting line from timeline point to card
        svg.append("line")
          .attr("x1", margin.left + timelineWidth/2 + 6)
          .attr("y1", margin.top + yPos)
          .attr("x2", margin.left + timelineWidth + 20)
          .attr("y2", margin.top + i * itemHeight + itemHeight/2)
          .attr("stroke", isPlaceholder ? "#ccc" : "#aaa")
          .attr("stroke-width", 1)
          .attr("stroke-dasharray", "3,3");
      }
      
      // Job detail card group with draggable attribute
      const cardGroup = svg.append("g")
        .attr("class", "job-card")
        .attr("transform", `translate(${margin.left + timelineWidth + 20}, ${margin.top + i * itemHeight})`)
        .attr("data-id", job.id);
      
      if (!isPlaceholder) {
        // Make non-placeholder cards draggable
        cardGroup.attr("cursor", "grab")
          .on("mousedown", function(event) {
            if (!isEditing && !isPlaceholder) {
              d3.select(this).attr("cursor", "grabbing");
              setDraggedItem(job.id);
            }
          })
          .on("mouseover", function() {
            if (draggedItem !== null && draggedItem !== job.id && !isPlaceholder) {
              setDragOverItem(job.id);
              d3.select(this).select("rect").attr("stroke", "#4a90e2").attr("stroke-width", 2);
            }
          })
          .on("mouseout", function() {
            if (!isPlaceholder) {
              setDragOverItem(null);
              d3.select(this).select("rect").attr("stroke", "#ddd").attr("stroke-width", 1);
            }
          })
          .on("mouseup", function() {
            if (draggedItem !== null && dragOverItem !== null && draggedItem !== dragOverItem) {
              handleReorder(draggedItem, dragOverItem);
            }
            d3.select(this).attr("cursor", "grab");
            setDraggedItem(null);
            setDragOverItem(null);
          });
      }
      
      // Card background with different style for placeholder
      cardGroup.append("rect")
        .attr("width", cardWidth - 20)
        .attr("height", itemHeight - 20)
        .attr("rx", 4)
        .attr("ry", 4)
        .attr("fill", isPlaceholder ? (isEditing ? "#f9f9f9" : "#f0f0f0") : "#f9f9f9")
        .attr("stroke", isPlaceholder ? "#ccc" : "#ddd")
        .attr("stroke-width", 1)
        .attr("stroke-dasharray", isPlaceholder && !isEditing ? "5,5" : "0")
        .style("cursor", isPlaceholder && !isEditing ? "pointer" : "default")
        .on("click", () => {
          if (isPlaceholder && !isEditing) {
            handleStartEdit(job);
          }
        });
      
      if (isEditing) {
        // Render inline edit form with improved layout
        const formGroup = cardGroup.append("foreignObject")
          .attr("x", 10)
          .attr("y", 10)
          .attr("width", cardWidth - 40)
          .attr("height", itemHeight - 30);
          
        const formElement = formGroup.append("xhtml:div")
          .style("height", "100%")
          .style("width", "100%")
          .style("overflow", "visible") // Changed from hidden to visible
          .html(`
            <div style="font-family: sans-serif; font-size: 12px; width: 100%;">
              <div style="margin-bottom: 8px;">
                <label style="display: block; font-weight: bold; margin-bottom: 2px;">Job Title</label>
                <input id="title-${job.id}" type="text" value="${editFormData.title}" style="width: 95%; padding: 4px;" />
              </div>
              <div style="margin-bottom: 8px;">
                <label style="display: block; font-weight: bold; margin-bottom: 2px;">Company</label>
                <input id="company-${job.id}" type="text" value="${editFormData.company}" style="width: 95%; padding: 4px;" />
              </div>
              <div style="display: flex; margin-bottom: 8px;">
                <div style="flex: 1; margin-right: 8px;">
                  <label style="display: block; font-weight: bold; margin-bottom: 2px;">Start Date</label>
                  <input id="startDate-${job.id}" type="text" placeholder="YYYY-MM" value="${editFormData.startDate}" style="width: 90%; padding: 4px;" />
                </div>
                <div style="flex: 1;">
                  <label style="display: block; font-weight: bold; margin-bottom: 2px;">End Date</label>
                  <input id="endDate-${job.id}" type="text" placeholder="YYYY-MM or Present" value="${editFormData.endDate}" style="width: 90%; padding: 4px;" />
                </div>
              </div>
              <div style="margin-bottom: 12px;">
                <label style="display: block; font-weight: bold; margin-bottom: 2px;">Responsibilities (one per line)</label>
                <textarea id="responsibilities-${job.id}" style="width: 95%; height: 50px; padding: 4px;">${editFormData.responsibilities}</textarea>
              </div>
              <div style="display: flex; justify-content: flex-end;">
                <button id="cancel-${job.id}" style="margin-right: 8px; padding: 6px 12px; background: #eee; border: 1px solid #ccc; border-radius: 4px; cursor: pointer;">Cancel</button>
                <button id="save-${job.id}" style="padding: 6px 12px; background: #4a90e2; color: white; border: 1px solid #3a80d2; border-radius: 4px; cursor: pointer;">Save</button>
              </div>
            </div>
          `);
          
        // Add event listeners after a short delay to ensure DOM is ready
        setTimeout(() => {
          // Save button
          const saveButton = document.getElementById(`save-${job.id}`);
          if (saveButton) {
            saveButton.addEventListener("click", () => {
              const updatedJob = {
                title: document.getElementById(`title-${job.id}`).value,
                company: document.getElementById(`company-${job.id}`).value,
                startDate: document.getElementById(`startDate-${job.id}`).value,
                endDate: document.getElementById(`endDate-${job.id}`).value,
                responsibilities: document.getElementById(`responsibilities-${job.id}`).value
                  .split('\n')
                  .filter(r => r.trim())
              };
              
              handleSaveEdit(job.id, updatedJob);
            });
          }
          
          // Cancel button
          const cancelButton = document.getElementById(`cancel-${job.id}`);
          if (cancelButton) {
            cancelButton.addEventListener("click", () => {
              handleCancelEdit();
            });
          }
        }, 100);
        
      } else {
        // Regular card content (not editing)
        // Job title
        cardGroup.append("text")
          .attr("x", 15)
          .attr("y", 25)
          .attr("font-weight", "bold")
          .attr("font-size", isPlaceholder ? "0.9rem" : "1rem")
          .attr("fill", isPlaceholder ? "#888" : "#000")
          .text(job.title);
        
        // Company
        cardGroup.append("text")
          .attr("x", 15)
          .attr("y", 45)
          .attr("font-style", "italic")
          .attr("font-size", "0.9rem")
          .attr("fill", isPlaceholder ? "#888" : "#000")
          .text(job.company);
        
        if (!isPlaceholder) {
          // Date range (only for non-placeholders)
          cardGroup.append("text")
            .attr("x", 15)
            .attr("y", 65)
            .attr("font-size", "0.8rem")
            .attr("fill", "#666")
            .text(`${job.startDate} — ${job.endDate}`);
          
          // Drag indicator for non-placeholder items
          cardGroup.append("text")
            .attr("x", cardWidth - 40)
            .attr("y", 25)
            .attr("font-size", "16px")
            .attr("text-anchor", "middle")
            .attr("fill", "#999")
            .text("☰")
            .attr("title", "Drag to reorder");
          
          // Responsibilities
          const responsibilities = Array.isArray(job.responsibilities) 
            ? job.responsibilities 
            : job.responsibilities.split('\n').filter(r => r.trim());
            
          responsibilities.forEach((resp, j) => {
            cardGroup.append("text")
              .attr("x", 20)
              .attr("y", 90 + j * 20)
              .attr("font-size", "0.8rem")
              .text(`• ${resp}`);
          });
          
          // Add edit button to card
          const editButton = cardGroup.append("g")
            .attr("class", "edit-button")
            .attr("transform", `translate(${cardWidth - 80}, 15)`)
            .style("cursor", "pointer")
            .on("click", () => handleStartEdit(job));
            
          editButton.append("rect")
            .attr("width", 24)
            .attr("height", 24)
            .attr("rx", 4)
            .attr("fill", "#eee")
            .attr("stroke", "#ccc")
            .attr("stroke-width", 1);
            
          editButton.append("text")
            .attr("x", 12)
            .attr("y", 16)
            .attr("text-anchor", "middle")
            .attr("font-size", "14px")
            .text("✎");
            
          // Add delete button to card
          const deleteButton = cardGroup.append("g")
            .attr("class", "delete-button")
            .attr("transform", `translate(${cardWidth - 50}, 15)`)
            .style("cursor", "pointer")
            .on("click", () => handleDelete(job.id));
            
          deleteButton.append("rect")
            .attr("width", 24)
            .attr("height", 24)
            .attr("rx", 4)
            .attr("fill", "#eee")
            .attr("stroke", "#ccc")
            .attr("stroke-width", 1);
            
          deleteButton.append("text")
            .attr("x", 12)
            .attr("y", 16)
            .attr("text-anchor", "middle")
            .attr("font-size", "14px")
            .text("×");
        }
      }
    });
    
    // Set up mouse events for the entire SVG to complete drag operations
    svg.on("mouseup", function() {
      if (draggedItem !== null) {
        setDraggedItem(null);
        setDragOverItem(null);
      }
    });
    
  }, [jobData, editingId, editFormData, draggedItem, dragOverItem]);
  
  // Handler for starting edit mode
  const handleStartEdit = (job) => {
    setEditingId(job.id);
    
    if (job.isPlaceholder) {
      setEditFormData({
        title: "",
        company: "",
        startDate: "",
        endDate: "",
        responsibilities: ""
      });
    } else {
      setEditFormData({
        title: job.title,
        company: job.company,
        startDate: job.startDate,
        endDate: job.endDate,
        responsibilities: Array.isArray(job.responsibilities) 
          ? job.responsibilities.join('\n') 
          : job.responsibilities
      });
    }
  };
  
  // Handler for saving edits
  const handleSaveEdit = (id, updatedJob) => {
    if (id === -1) {
      // Add new job
      const newJob = {
        ...updatedJob,
        id: generateId()
      };
      
      setJobData(prev => {
        const withoutPlaceholder = prev.filter(job => !job.isPlaceholder);
        return [...withoutPlaceholder, newJob, emptyCard];
      });
    } else {
      // Update existing job
      setJobData(prev => 
        prev.map(job => 
          job.id === id 
            ? { ...job, ...updatedJob } 
            : job
        )
      );
    }
    
    setEditingId(null);
  };
  
  // Handler for canceling edits
  const handleCancelEdit = () => {
    setEditingId(null);
  };
  
  // Handler for reordering jobs via drag and drop
  const handleReorder = (draggedId, dropId) => {
    setJobData(prev => {
      const newJobs = [...prev];
      const dragIndex = newJobs.findIndex(job => job.id === draggedId);
      const dropIndex = newJobs.findIndex(job => job.id === dropId);
      
      if (dragIndex === -1 || dropIndex === -1) return prev;
      
      // Remove the dragged item
      const [draggedItem] = newJobs.splice(dragIndex, 1);
      
      // Insert it at the new position
      newJobs.splice(dropIndex, 0, draggedItem);
      
      return newJobs;
    });
  };
  
  // Handler for deleting a job
  const handleDelete = (id) => {
    setJobData(prev => {
      const withoutDeleted = prev.filter(job => job.id !== id);
      
      // Ensure we always have the empty placeholder at the end
      if (!withoutDeleted.some(job => job.isPlaceholder)) {
        return [...withoutDeleted, emptyCard];
      }
      
      return withoutDeleted;
    });
  };

  return (
    <div className="flex flex-col items-center p-6 bg-gray-50">
      <h1 className="text-2xl font-bold mb-6">Interactive Timeline Resume</h1>
      <p className="text-gray-600 mb-6">
        <span className="font-medium">✱ Drag job cards</span> to reorder them | 
        <span className="font-medium"> ✎ Edit</span> to modify details | 
        <span className="font-medium"> × Delete</span> to remove entries
      </p>
      
      {/* Timeline Visualization */}
      <div 
        ref={containerRef} 
        className="w-full max-w-4xl bg-white p-4 shadow-md mb-8"
      >
        <svg ref={svgRef}></svg>
      </div>
      
      {/* Instructions */}
      <div className="w-full max-w-4xl text-center text-sm mb-8">
        <p className="text-gray-500">Click the "Add New Position" card at the bottom to add a new job entry</p>
      </div>
    </div>
  );
};

export default TimelineResume;
