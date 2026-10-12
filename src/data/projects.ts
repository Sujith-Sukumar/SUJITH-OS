import { ProjectItem } from '../types/os';

export const projectsData: ProjectItem[] = [
  {
    id: 'matrimony-platform',
    title: 'Matrimony Platform',
    shortDescription: 'Full-featured matrimonial matchmaking web app with real-time chat, media storage, and payment verification.',
    tagline: 'End-to-end matchmaking ecosystem with instant messaging and cloud media management.',
    fullOverview: 'A comprehensive modern matrimony web application engineered using the MERN stack. Designed to deliver an intuitive and secure matchmaking experience with multi-tier membership, profile verification, interactive search filters, real-time Socket.io instant messaging, and secure multi-media cloud storage.',
    category: 'Full Stack',
    version: 'v2.4.0',
    status: 'Live',
    accentColor: '#ec4899',
    technologies: [
      'React.js',
      'Node.js',
      'Express.js',
      'MongoDB',
      'Socket.io',
      'AWS S3',
      'Razorpay',
      'Cloudinary',
      'Tailwind CSS',
      'Redux Toolkit'
    ],
    features: [
      'Advanced Matchmaking Engine: Multi-factor search algorithms by community, education, location, and astrological criteria.',
      'Real-Time Chat & Notifications: Low-latency bilateral messaging powered by Socket.io with delivery badges and typing indicators.',
      'Cloud Media Pipeline: Secure photo upload, optimization, and watermarking using AWS S3 and Cloudinary.',
      'Premium Subscription Tiers: Integrated Razorpay payment gateway with automated invoice dispatch and webhook validation.',
      'Privacy & Visibility Controls: Configurable profile photo masking, phone number privacy requests, and mutual interest requests.'
    ],
    architectureHighlights: [
      'Modular RESTful API architecture structured with Express middleware for JWT authentication and rate limiting.',
      'Socket.io rooms segregated by conversation IDs with MongoDB message persistence.',
      'AWS S3 pre-signed URL protocol for secure direct-to-cloud asset storage without server memory bottlenecks.'
    ],
    myContribution: [
      'Designed and engineered the end-to-end React single-page application with responsive layouts and state caching.',
      'Implemented the real-time chat service and WebSocket connection lifecycle management.',
      'Architected the MongoDB schema with compound indexes for rapid matchmaking search queries.',
      'Integrated Razorpay checkout flows and webhook listener for automated transaction fulfillment.'
    ],
    challenges: [
      'Handling real-time state synchronization when users navigate between tabs or disconnect temporarily.',
      'Optimizing complex aggregation queries across hundreds of matchmaking attributes without latency spikes.'
    ],
    solutions: [
      'Leveraged Socket.io reconnection tokens combined with Redux persistence for message cache consistency.',
      'Constructed MongoDB compound indexes on high-frequency search fields and utilized projection pipelines.'
    ],
    // Replace placeholders with your actual live URLs when available
    liveDemoUrl: 'https://marrymitra.com/',
    githubUrl: 'https://github.com/your-username/matrimony-platform', // CONFIGURABLE_PLACEHOLDER
    imageUrl: '/Matrimony.png'
  },
  {
    id: 'lms-platform',
    title: 'Learning Management System (LMS)',
    shortDescription: 'Scalable educational platform featuring course management, video streaming, and hierarchical role-based access.',
    tagline: 'Enterprise-grade course authoring, video delivery, and student progress tracking.',
    fullOverview: 'A complete Learning Management System built to streamline digital education for institutions and independent educators. Features hierarchical role permissions (Super Admin, Instructor, Student), protected video streaming, interactive module checklists, student enrollment pipelines, and analytical progress dashboards.',
    category: 'Full Stack',
    version: 'v3.1.2',
    status: 'Completed',
    accentColor: '#3b82f6',
    technologies: [
      'React.js',
      'TypeScript',
      'Node.js',
      'Express.js',
      'MongoDB',
      'AWS S3',
      'Cloudinary',
      'Tailwind CSS',
      'Nodemailer'
    ],
    features: [
      'Hierarchical Role-Based Access Control (RBAC): Distinct permissions for Super Admin, Instructors, and Enrolled Students.',
      'Course Curriculum Authoring: Rich-text module builder with chapter sequencing, assignments, and downloadable resources.',
      'Protected Video Delivery: Optimized video streaming player with playback memory, quality selection, and completion detection.',
      'Student Enrollment & Tracking: Seamless course enrollment, progress calculation, and completion certificate generation.',
      'Automated Email Dispatch: Nodemailer integration for welcome emails, enrollment receipts, and milestone alerts.'
    ],
    architectureHighlights: [
      'JWT token authentication paired with role-guarding Express middleware for API authorization.',
      'Decoupled media assets using Cloudinary and AWS S3 storage buckets with CDN edge caching.',
      'Normalized relational MongoDB schema design utilizing Mongoose references and populate hooks.'
    ],
    myContribution: [
      'Built the full client-side interface in React + TypeScript with responsive video player controls.',
      'Implemented RBAC security middleware and protected route guards on both frontend and backend.',
      'Created administrative dashboard with course analytics, enrollment counts, and student performance metrics.'
    ],
    challenges: [
      'Preventing unauthorized course content and direct video stream URL scraping.',
      'Managing intricate video progress timestamps across varied network conditions.'
    ],
    solutions: [
      'Secured video delivery streams with expiring signed token parameters and restricted HTTP referrer validation.',
      'Implemented debounced local timestamp caching with periodic batch syncs to the server.'
    ],
    // Replace placeholders with your actual live URLs when available
    liveDemoUrl: 'https://example.com/demo/lms', // CONFIGURABLE_PLACEHOLDER
    githubUrl: 'https://github.com/your-username/lms-platform', // CONFIGURABLE_PLACEHOLDER
    imageUrl: '/LMS.png'
  },
  {
    id: 'hrm-platform',
    title: 'Human Resource Management (HRM)',
    shortDescription: 'Enterprise HRM system managing employee lifecycle, payroll pipelines, automated attendance, and leave management.',
    tagline: 'Comprehensive workforce management, biometric attendance sync, and automated payroll computing.',
    fullOverview: 'An enterprise-grade Human Resource Management (HRM) platform built with the MERN stack. Streamlines end-to-end employee lifecycle workflows, departmental hierarchies, automated payroll calculations with tax deductions, leave request approval chains, attendance tracking, and internal company announcements.',
    category: 'Full Stack',
    version: 'v2.2.0',
    status: 'Live',
    accentColor: '#10b981',
    technologies: [
      'React.js',
      'TypeScript',
      'Node.js',
      'Express.js',
      'MongoDB',
      'Redux Toolkit',
      'Tailwind CSS',
      'JWT Auth',
      'Nodemailer'
    ],
    features: [
      'Employee Directory & Lifecycle: Comprehensive employee records, document vault, onboarding workflows, and departmental organization charts.',
      'Automated Payroll Engine: Dynamic salary calculation, allowances, tax deductions, pay slip generation, and direct bank dispatch records.',
      'Leave & Attendance Tracker: Shift management, multi-level leave approval hierarchies, overtime tracking, and holiday calendars.',
      'Role-Based Permission Matrix: Granular access control for HR Admins, Department Managers, and Staff Members.',
      'Company Noticeboard & Policies: Broadcast company memos, policy documentation, and event announcements with email triggers.'
    ],
    architectureHighlights: [
      'Transactional payroll computations with atomic MongoDB document updates to guarantee financial data integrity.',
      'Hierarchical approval workflows using state machine patterns and event-driven notifications.',
      'Automated PDF pay slip generation pipeline with secure S3 storage and dispatch.'
    ],
    myContribution: [
      'Designed and engineered the full-stack HRM architecture with secure JWT authorization and role-based route middleware.',
      'Implemented the salary calculation engine and automated PDF pay slip generator.',
      'Developed responsive self-service employee portals with leave submission and attendance dashboards.'
    ],
    challenges: [
      'Managing intricate leave entitlement quotas across varying employment tiers and anniversary periods.',
      'Ensuring payroll calculations remain atomic and resistant to concurrent modifications.'
    ],
    solutions: [
      'Implemented MongoDB ACID transactions on payroll processing batches.',
      'Engineered an automated month-end reconciliation cron service with thorough audit trails.'
    ],
    liveDemoUrl: 'https://example.com/demo/hrm',
    githubUrl: 'https://github.com/your-username/hrm-platform',
    imageUrl: '/HRM.png'
  },
  {
    id: 'crm-platform',
    title: 'Customer Relationship Management (CRM)',
    shortDescription: 'High-performance CRM suite featuring visual deal pipelines, client communications, lead scoring, and sales analytics.',
    tagline: 'Sales pipeline acceleration, automated lead nurturing, and client intelligence dashboard.',
    fullOverview: 'A feature-complete Customer Relationship Management (CRM) system designed to maximize sales velocity and client retention. Features kanban-style drag-and-drop deal pipelines, automated lead scoring, communication history tracking, task scheduling, revenue forecasting analytics, and real-time sales team leaderboards.',
    category: 'Full Stack',
    version: 'v2.1.0',
    status: 'Live',
    accentColor: '#f59e0b',
    technologies: [
      'React.js',
      'TypeScript',
      'Node.js',
      'Express.js',
      'MongoDB',
      'Socket.io',
      'Chart.js',
      'Tailwind CSS',
      'Zustand'
    ],
    features: [
      'Visual Deal Pipelines: Interactive drag-and-drop Kanban board for deals across qualification, proposal, negotiation, and closed stages.',
      'Lead Scoring & Qualification: Algorithmic prospect evaluation based on engagement metrics, company size, and budget indicators.',
      'Omnichannel Activity Log: Centralized history of emails, call notes, meetings, and upcoming reminders linked to each contact.',
      'Sales Forecasting & Analytics: Dynamic revenue projections, win/loss ratios, team performance KPIs, and custom reporting filters.',
      'Real-Time Team Collaboration: Live notification dispatch via Socket.io when deal stages shift or high-value leads convert.'
    ],
    architectureHighlights: [
      'High-throughput MongoDB aggregation pipelines powering sub-second analytic calculations over large sales datasets.',
      'Optimistic UI state updates on drag-and-drop deal transitions for instant feedback backed by persistent server sync.',
      'Real-time WebSocket event broadcaster notifying sales representatives of lead assignment changes.'
    ],
    myContribution: [
      'Architected the front-end Kanban workflow with fluid dragging interactions and optimistic UI state management.',
      'Engineered backend REST endpoints and aggregation query pipelines for business metrics dashboards.',
      'Integrated real-time notification service keeping sales representatives informed of deal progress.'
    ],
    challenges: [
      'Maintaining zero lag during rapid drag-and-drop card movements across stages while synchronizing with the database.',
      'Aggregating complex sales pipeline statistics across custom date ranges without degrading API throughput.'
    ],
    solutions: [
      'Implemented optimistic UI state updates in Zustand with rollback mechanisms on network errors.',
      'Utilized MongoDB compound indexes on stage, createdDate, and dealValue fields paired with Redis cache layers.'
    ],
    liveDemoUrl: 'https://estaconnect.in/',
    githubUrl: 'https://github.com/your-username/crm-platform',
    imageUrl: '/CRM.png'
  }
];
