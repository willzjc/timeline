document.addEventListener('DOMContentLoaded', function() {
    // Initialize the timeline
    const timeline = new TimelineResume('timeline-container');
    
    // Add sample jobs to demonstrate the timeline
    timeline.addJob({
        title: 'Senior Developer',
        company: 'Example Tech',
        responsibilities: 'Led team of developers\nImplemented new features\nManaged technical infrastructure',
        startDate: '2020-01-01',
        endDate: '2023-01-01',
        currentJob: false,
        location: 'Level 24-30/1 Denison St, North Sydney NSW 2060, Australia'
    });
    
    timeline.addJob({
        title: 'Frontend Developer',
        company: 'Web Solutions Inc',
        responsibilities: 'Built responsive web applications\nOptimized site performance\nCollaborated with design team',
        startDate: '2018-03-15',
        endDate: '2019-12-20',
        currentJob: false,
        location: '1 Hosking Pl, Sydney NSW 2000, Australia'
    });
});
