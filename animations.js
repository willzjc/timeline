document.addEventListener('DOMContentLoaded', () => {
    // Animation configurations
    const config = {
        duration: 1000,
        pointRadius: 6,
        pointRadiusHover: 10,
        lineThickness: 3,
        colors: {
            points: d3.schemeCategory10,
            lines: ['#4a90e2', '#50e3c2'],
            background: '#f8f9fa'
        }
    };

    // Initialize animations
    initAnimations();

    function initAnimations() {
        // Animate title
        animateTitle();
        
        // Setup event listeners for zoom controls
        setupZoomControls();
        
        // Add global event listeners
        addEventListeners();
        
        // Set up observers to animate elements as they come into view
        setupScrollObservers();
    }

    function animateTitle() {
        const title = document.querySelector('.animated-title');
        
        // Use GSAP for smoother animations
        gsap.fromTo(title, 
            { opacity: 0, y: -20 }, 
            { opacity: 1, y: 0, duration: 1.2, ease: "power3.out" }
        );
    }

    function setupZoomControls() {
        // Get zoom control buttons
        const zoomIn = document.getElementById('zoom-in');
        const zoomOut = document.getElementById('zoom-out');
        const resetView = document.getElementById('reset-view');
        
        if (zoomIn && zoomOut && resetView) {
            zoomIn.addEventListener('click', () => zoomTimeline(1.2));
            zoomOut.addEventListener('click', () => zoomTimeline(0.8));
            resetView.addEventListener('click', resetTimelineView);
        }
    }

    function zoomTimeline(scaleFactor) {
        // This function will be implemented in the timeline.js file or extended here
        // It should scale the timeline visualization
        const timelineContainer = d3.select('#timeline-container');
        const currentTransform = d3.zoomTransform(timelineContainer.node());
        
        if (window.timelineZoom) {
            window.timelineZoom.scaleBy(timelineContainer.transition().duration(750), scaleFactor);
        }
    }

    function resetTimelineView() {
        // Reset zoom and pan to default
        const timelineContainer = d3.select('#timeline-container');
        
        if (window.timelineZoom) {
            timelineContainer.transition()
                .duration(750)
                .call(window.timelineZoom.transform, d3.zoomIdentity);
        }
    }

    function addEventListeners() {
        // Close detail panel when close button is clicked
        const closeBtn = document.querySelector('.close-btn');
        if (closeBtn) {
            closeBtn.addEventListener('click', () => {
                const detailsPanel = document.getElementById('details-panel');
                detailsPanel.classList.remove('visible');
                setTimeout(() => detailsPanel.classList.add('hidden'), 300);
            });
        }

        // Add window resize handler
        window.addEventListener('resize', debounce(() => {
            if (window.updateTimelineResponsive) {
                window.updateTimelineResponsive();
            }
        }, 250));
    }

    function setupScrollObservers() {
        // Observe timeline elements and animate them as they enter the viewport
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                }
            });
        }, { threshold: 0.1 });

        // Observe all timeline cards
        document.querySelectorAll('.timeline-card').forEach(card => {
            observer.observe(card);
        });
    }

    // Helper functions
    function debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    // Export functions to global scope for use in other scripts
    window.animateTimelineElement = function(element, delay = 0) {
        gsap.fromTo(element, 
            { opacity: 0, scale: 0.8 }, 
            { opacity: 1, scale: 1, duration: 0.8, delay, ease: "elastic.out(1, 0.5)" }
        );
    };

    window.showDetailsPanel = function(data) {
        const detailsPanel = document.getElementById('details-panel');
        const detailsContent = document.getElementById('details-content');
        
        // Populate details content
        detailsContent.innerHTML = `
            <h2>${data.title}</h2>
            <p class="date">${data.startDate} - ${data.endDate || 'Present'}</p>
            <div class="details-body">${data.description}</div>
        `;
        
        // Show panel with animation
        detailsPanel.classList.remove('hidden');
        setTimeout(() => detailsPanel.classList.add('visible'), 10);
    };
});
