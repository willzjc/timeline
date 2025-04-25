class TimelineResume {
    constructor(containerId) {
        this.container = d3.select(`#${containerId}`);
        this.jobs = [];
        this.margin = { top: 20, right: 20, bottom: 20, left: 20 };
        this.width = parseInt(this.container.style('width')) - this.margin.left - this.margin.right;
        this.editingIndex = null;
        this.draggedItemIndex = null;
        this.initTimeline();
        
        // Handle window resize
        window.addEventListener('resize', () => {
            this.width = parseInt(this.container.style('width')) - this.margin.left - this.margin.right;
            this.updateTimeline();
        });
    }
    
    initTimeline() {
        // Create SVG container for the timeline line
        this.svg = this.container.append('svg')
            .attr('width', 60)
            .attr('class', 'timeline-axis');
            
        // Create a div for the timeline elements
        this.timelineElement = this.container.append('div')
            .attr('class', 'timeline-elements');
            
        // Add the vertical line
        this.svg.append('line')
            .attr('class', 'timeline-line')
            .attr('x1', 30)
            .attr('x2', 30)
            .attr('y1', 0)
            .style('stroke', '#232323') // Changed fromrgb(0, 0, 0) to grey
            .style('stroke-width', '4px');
    }
    
    addJob(job) {
        this.jobs.push(job);
        this.sortJobs();
        this.updateTimeline();
    }
    
    sortJobs() {
        this.jobs.sort((a, b) => new Date(b.startDate) - new Date(a.startDate));
    }
    
    formatDate(dateString) {
        if (!dateString) return '';
        const date = new Date(dateString);
        const options = { year: 'numeric', month: 'short' };
        return date.toLocaleDateString('en-US', options);
    }
    
    updateTimeline() {
        // Clear existing timeline
        this.timelineElement.html('');
        
        // Add the "new card" placeholder
        this.addNewCardPlaceholder();
        
        // Set the height of the SVG based on content
        const timelineHeight = Math.max((this.jobs.length + 1) * 150 + 100, 300);
        this.svg.attr('height', timelineHeight);
        
        // Update the vertical line
        this.svg.select('.timeline-line')
            .attr('y2', timelineHeight);
            
        // Create timeline items for existing jobs
        const timelineItems = this.timelineElement.selectAll('.timeline-item.job-item')
            .data(this.jobs)
            .enter()
            .append('div')
            .attr('class', 'timeline-item job-item')
            .style('margin-bottom', '30px')
            .attr('data-index', (d, i) => i)
            .attr('draggable', false)  // The container isn't draggable, only the content
            // Drag event listeners for the drop target
            .on('dragover', (event) => {
                event.preventDefault();
                event.dataTransfer.dropEffect = 'move';
            })
            .on('dragenter', (event) => {
                event.preventDefault();
                const target = event.currentTarget;
                d3.select(target).classed('drag-over', true);
            })
            .on('dragleave', (event) => {
                const target = event.currentTarget;
                d3.select(target).classed('drag-over', false);
            })
            .on('drop', (event, d) => {
                event.preventDefault();
                const targetIndex = parseInt(d3.select(event.currentTarget).attr('data-index'));
                this.handleDrop(targetIndex);
                d3.select(event.currentTarget).classed('drag-over', false);
            });
            
        // Add timeline dots to each item
        timelineItems.append('div')
            .attr('class', 'timeline-dot');
            
        // Create content cards
        const timelineContent = timelineItems.append('div')
            .attr('class', 'timeline-content draggable')
            .attr('data-index', (d, i) => i)
            .attr('draggable', true)
            // Drag event listeners for the dragged element
            .on('dragstart', (event, d, i) => {
                const index = parseInt(d3.select(event.currentTarget).attr('data-index'));
                event.dataTransfer.effectAllowed = 'move';
                event.dataTransfer.setData('text/plain', index);
                setTimeout(() => {
                    d3.select(event.currentTarget).classed('dragging', true);
                }, 0);
                this.draggedItemIndex = index;
            })
            .on('dragend', (event) => {
                d3.select(event.currentTarget).classed('dragging', false);
                this.draggedItemIndex = null;
                // Remove drag-over class from all items
                this.timelineElement.selectAll('.timeline-item').classed('drag-over', false);
            });
        
        // Add connector arrow from content to dot
        timelineContent.append('div')
            .attr('class', 'timeline-arrow')
            .attr('title', 'Connection to timeline');
            
        // Add drag handle
        timelineContent.append('div')
            .attr('class', 'drag-handle')
            .attr('title', 'Drag to reorder');
            
        // Add action buttons
        const cardActions = timelineContent.append('div')
            .attr('class', 'card-actions');
            
        cardActions.append('button')
            .attr('class', 'edit-btn')
            .html('✏️')
            .attr('title', 'Edit')
            .on('click', (event, d, i) => {
                event.stopPropagation();
                const index = parseInt(d3.select(event.currentTarget.parentNode.parentNode).attr('data-index'));
                this.editJob(index);
            });
            
        cardActions.append('button')
            .attr('class', 'delete-btn')
            .html('🗑️')
            .attr('title', 'Delete')
            .on('click', (event, d, i) => {
                event.stopPropagation();
                const index = parseInt(d3.select(event.currentTarget.parentNode.parentNode).attr('data-index'));
                this.deleteJob(index);
            });
        
        // Add job info (when not in edit mode)
        this.renderJobContent(timelineContent);
    }
    
    renderJobContent(container) {
        // Add date range
        container.append('div')
            .attr('class', 'timeline-date')
            .text(d => {
                const endDateText = d.currentJob ? 'Present' : this.formatDate(d.endDate);
                return `${this.formatDate(d.startDate)} - ${endDateText}`;
            });
            
        // Add job title
        container.append('h3')
            .attr('class', 'timeline-title')
            .text(d => d.title);
            
        // Add company
        container.append('div')
            .attr('class', 'timeline-company')
            .text(d => d.company);
            
        // Add location
        container.append('div')
            .attr('class', 'timeline-location')
            .html(d => `${d.location}`)
            .on('click', (event, d) => {
                event.stopPropagation();
                this.showMapSidePane(d.location);
            });
            
        // Add responsibilities
        container.append('div')
            .attr('class', 'timeline-responsibilities')
            .text(d => d.responsibilities);
    }
    
    addNewCardPlaceholder() {
        const newCardItem = this.timelineElement.append('div')
            .attr('class', 'timeline-item new-card-item')  // Added "new-card-item" class
            .style('margin-bottom', '30px');
            
        newCardItem.append('div')
            .attr('class', 'timeline-dot');
            
        const newCard = newCardItem.append('div')
            .attr('class', 'timeline-content new-card')
            .on('click', () => this.createNewJob());
            
        // Add connector arrow for new card
        newCard.append('div')
            .attr('class', 'timeline-arrow')
            .attr('title', 'Connection to timeline');
            
        newCard.append('div')
            .attr('class', 'new-card-icon')
            .html('+');
            
        newCard.append('div')
            .attr('class', 'new-card-text')
            .text('Add new job entry');
    }
    
    createNewJob() {
        const newJob = {
            title: '',
            company: '',
            responsibilities: '',
            startDate: '',
            endDate: '',
            currentJob: false,
            location: '' // Added location property
        };
        
        this.jobs.unshift(newJob);
        this.updateTimeline();
        this.editJob(0); // Edit the first job (newly added)
    }
    
    editJob(index) {
        this.editingIndex = index;
        const job = this.jobs[index];
        
        // Find the card we need to edit
        const card = this.timelineElement.select(`.timeline-content[data-index="${index}"]`);
        card.html(''); // Clear the current content
        card.classed('edit-mode', true);
        
        // Add connector arrow back since we cleared the content
        card.append('div')
            .attr('class', 'timeline-arrow')
            .attr('title', 'Connection to timeline');
        
        // Create edit form
        const form = card.append('form')
            .attr('class', 'edit-form')
            .on('submit', (event) => {
                event.preventDefault();
                this.saveJob(index);
            });
            
        // Job Title
        const titleGroup = form.append('div').attr('class', 'form-group');
        titleGroup.append('label').attr('for', `job-title-${index}`).text('Job Title:');
        titleGroup.append('input')
            .attr('type', 'text')
            .attr('id', `job-title-${index}`)
            .attr('value', job.title)
            .attr('required', true);
            
        // Company
        const companyGroup = form.append('div').attr('class', 'form-group');
        companyGroup.append('label').attr('for', `company-${index}`).text('Company:');
        companyGroup.append('input')
            .attr('type', 'text')
            .attr('id', `company-${index}`)
            .attr('value', job.company)
            .attr('required', true);
            
        // Responsibilities
        const respGroup = form.append('div').attr('class', 'form-group');
        respGroup.append('label').attr('for', `responsibilities-${index}`).text('Responsibilities:');
        respGroup.append('textarea')
            .attr('id', `responsibilities-${index}`)
            .attr('rows', 4)
            .attr('required', true)
            .text(job.responsibilities);
            
        // Start Date
        const startDateGroup = form.append('div').attr('class', 'form-group');
        startDateGroup.append('label').attr('for', `start-date-${index}`).text('Start Date:');
        startDateGroup.append('input')
            .attr('type', 'date')
            .attr('id', `start-date-${index}`)
            .attr('value', job.startDate)
            .attr('required', true);
            
        // End Date and Current Job
        const endDateGroup = form.append('div').attr('class', 'form-group');
        endDateGroup.append('label').attr('for', `end-date-${index}`).text('End Date:');
        const endDateInput = endDateGroup.append('input')
            .attr('type', 'date')
            .attr('id', `end-date-${index}`)
            .attr('value', job.endDate)
            .property('disabled', job.currentJob);
            
        const checkboxGroup = endDateGroup.append('div').attr('class', 'checkbox-group');
        const checkbox = checkboxGroup.append('input')
            .attr('type', 'checkbox')
            .attr('id', `current-job-${index}`)
            .property('checked', job.currentJob)
            .on('change', function() {
                endDateInput.property('disabled', this.checked);
                if (this.checked) {
                    endDateInput.property('value', '');
                }
            });
            
        checkboxGroup.append('label')
            .attr('for', `current-job-${index}`)
            .text('Current Job');
            
        // Location
        const locationGroup = form.append('div').attr('class', 'form-group');
        locationGroup.append('label').attr('for', `location-${index}`).text('Location:');
        locationGroup.append('input')
            .attr('type', 'text')
            .attr('id', `location-${index}`)
            .attr('value', job.location);
            
        // Action buttons
        const actions = form.append('div').attr('class', 'edit-actions');
        actions.append('button')
            .attr('type', 'button')
            .attr('class', 'cancel-btn')
            .text('Cancel')
            .on('click', () => this.cancelEdit(index));
            
        actions.append('button')
            .attr('type', 'submit')
            .attr('class', 'save-btn')
            .text('Save');
    }
    
    saveJob(index) {
        const job = this.jobs[index];
        
        job.title = document.getElementById(`job-title-${index}`).value;
        job.company = document.getElementById(`company-${index}`).value;
        job.responsibilities = document.getElementById(`responsibilities-${index}`).value;
        job.startDate = document.getElementById(`start-date-${index}`).value;
        job.currentJob = document.getElementById(`current-job-${index}`).checked;
        job.endDate = job.currentJob ? null : document.getElementById(`end-date-${index}`).value;
        job.location = document.getElementById(`location-${index}`).value;
        
        this.editingIndex = null;
        
        // Don't sort when saving - keep manual order
        // this.sortJobs();
        
        this.updateTimeline();
    }
    
    cancelEdit(index) {
        // If it was a new job with empty data, remove it
        if (this.isEmptyJob(this.jobs[index])) {
            this.jobs.splice(index, 1);
        }
        
        this.editingIndex = null;
        this.updateTimeline();
    }
    
    isEmptyJob(job) {
        return !job.title && !job.company && !job.responsibilities && !job.startDate;
    }
    
    deleteJob(index) {
        if (confirm('Are you sure you want to delete this job entry?')) {
            this.jobs.splice(index, 1);
            this.updateTimeline();
        }
    }
    
    handleDrop(targetIndex) {
        if (this.draggedItemIndex === null || targetIndex === this.draggedItemIndex) {
            return;
        }
        
        // Get the job being dragged
        const draggedJob = this.jobs[this.draggedItemIndex];
        
        // Remove the dragged job from its original position
        this.jobs.splice(this.draggedItemIndex, 1);
        
        // Insert the dragged job at the target position
        this.jobs.splice(targetIndex, 0, draggedJob);
        
        // Sort only if we're not manually reordering
        // this.sortJobs();
        
        // Update the timeline
        this.updateTimeline();
    }

    showJobDetails(job) {
        // Add location to the details panel if available
        if (job.location) {
            const locationElement = document.getElementById('address-display');
            if (locationElement) {
                locationElement.textContent = job.location;
                document.getElementById('location-info').classList.remove('hidden');
            }
        } else {
            document.getElementById('location-info').classList.add('hidden');
        }
    }

    // Initialize the map side pane
    initMapSidePane() {
        // Create map side pane if it doesn't exist
        if (!document.getElementById('map-side-pane')) {
            const mapPane = document.createElement('div');
            mapPane.id = 'map-side-pane';
            mapPane.innerHTML = `
                <div class="map-header">
                    <h3 class="map-title">Location</h3>
                    <button class="map-close-btn">&times;</button>
                </div>
                <div id="map-container"></div>
            `;
            
            document.body.appendChild(mapPane);
            
            // Create overlay
            const overlay = document.createElement('div');
            overlay.className = 'map-overlay';
            document.body.appendChild(overlay);
            
            // Add event listener for close button
            document.querySelector('.map-close-btn').addEventListener('click', () => {
                this.closeMapSidePane();
            });
            
            // Close on overlay click
            overlay.addEventListener('click', () => {
                this.closeMapSidePane();
            });
        }
    }

    // Show the map side pane with the specified location
    showMapSidePane(location) {
        // Make sure the side pane exists
        this.initMapSidePane();
        
        // Update the map title
        document.querySelector('.map-title').textContent = location;
        
        // Show the side pane and overlay
        document.getElementById('map-side-pane').classList.add('open');
        document.querySelector('.map-overlay').classList.add('active');
        document.querySelector('.container').classList.add('map-open');
        
        // Load Google Map
        this.loadGoogleMap(location);
    }
    
    // Close the map side pane
    closeMapSidePane() {
        document.getElementById('map-side-pane').classList.remove('open');
        document.querySelector('.map-overlay').classList.remove('active');
        document.querySelector('.container').classList.remove('map-open');
    }
    
    // Load Google Map with the given location
    loadGoogleMap(location) {
        const mapContainer = document.getElementById('map-container');
        
        // Get API key from config file
        const apiKey = typeof CONFIG !== 'undefined' && CONFIG.GOOGLE_MAPS_API_KEY ? 
                       CONFIG.GOOGLE_MAPS_API_KEY : '';
                       
        // If no API key is available, use the keyless embed version
        const mapSrc = apiKey ? 
            `https://www.google.com/maps/embed/v1/place?key=${apiKey}&q=${encodeURIComponent(location)}` :
            `https://maps.google.com/maps?q=${encodeURIComponent(location)}&output=embed`;
        
        // Create an iframe with Google Maps embed
        mapContainer.innerHTML = `
            <iframe 
                width="100%" 
                height="100%" 
                frameborder="0" 
                style="border:0" 
                src="${mapSrc}" 
                allowfullscreen>
            </iframe>
        `;
    }
}
