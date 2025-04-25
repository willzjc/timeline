// Sample job data with 4 software engineering roles, each lasting 3 years

const sampleJobs = [
  {
    id: "1",
    title: "Senior Software Engineer",
    company: "Tech Innovations Inc.",
    responsibilities: "Led development of cloud-based solutions utilizing AWS and Azure platforms.\nMentored junior developers through pair programming and code reviews.\nImplemented CI/CD pipelines using Jenkins and GitHub Actions.\nDesigned and deployed microservices architecture using Docker and Kubernetes.\nOptimized system performance resulting in 35% reduction in response times.\nCollaborated with product managers to refine requirements and technical specifications.\nSpearheaded adoption of test-driven development across engineering teams.",
    startDate: "2020-01-01",
    endDate: "",
    currentJob: true,
    location: "San Francisco, CA"
  },
  {
    id: "2",
    title: "Software Engineer II",
    company: "DataDrive Systems",
    responsibilities: "Developed and maintained data processing applications using React, Redux, and Node.js.\nImproved system performance by 40% through code optimization and database query refinement.\nRefactored legacy systems to modern architecture standards reducing technical debt.\nImplemented real-time analytics dashboard used by over 500 enterprise clients.\nCollaborated with UX/UI team to enhance user experience and accessibility standards.\nParticipated in 24-hour on-call rotation to support mission-critical systems.",
    startDate: "2017-02-15",
    endDate: "2019-12-31",
    currentJob: false,
    location: "Austin, TX"
  },
  {
    id: "3",
    title: "Full Stack Developer",
    company: "WebSphere Solutions",
    responsibilities: "Built responsive web applications with React, Angular, and Vue.js frameworks.\nIntegrated third-party APIs including payment gateways, mapping services, and social media platforms.\nImplemented secure authentication systems using OAuth 2.0 and JWT across multiple platforms.\nOptimized front-end performance achieving 95+ scores on Google Lighthouse metrics.\nDeveloped RESTful APIs using Express.js and documented with Swagger.\nCoordinated with QA team to establish comprehensive testing protocols and automation.",
    startDate: "2014-03-10",
    endDate: "2017-02-01",
    currentJob: false,
    location: "Seattle, WA"
  },
  {
    id: "4",
    title: "Junior Software Engineer",
    company: "StartUp Ventures",
    responsibilities: "Assisted in developing MVP for iOS and Android applications using React Native.\nWorked on front-end components implementing UI designs using HTML5, CSS3, and JavaScript.\nCollaborated with design team to translate mockups into functional interfaces.\nParticipated in daily stand-ups and bi-weekly sprint planning sessions.\nDocumented code and created user guides for internal and external stakeholders.\nTroubleshooted and fixed bugs reported through customer feedback channels.",
    startDate: "2011-06-01",
    endDate: "2014-03-01",
    currentJob: false,
    location: "Boston, MA"
  }
];

export default sampleJobs;
