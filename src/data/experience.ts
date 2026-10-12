import { ExperienceItem } from '../types/os';

export const experienceData: ExperienceItem[] = [
  {
    id: 'exp-esta',
    chapterNumber: '01',
    year: '2025 – Present',
    role: 'Full Stack Developer',
    title: 'Full Stack Developer',
    company: 'ESTA ENTERPRISES',
    companyTag: 'Enterprise Platforms & AI',
    period: 'May 2025 – Present',
    type: 'Full-time',
    location: 'Ernakulam, Kerala',
    summary: 'Engineering production full-stack platforms and AI-integrated web systems.',
    responsibilities: [
      'Architect and scale end-to-end web platforms using Next.js, React.js, Node.js, TypeScript, and MongoDB.',
      'Integrate AI-driven workflows (Google Gemini API, FastAPI) and manage AWS & Cloudinary cloud pipelines.'
    ],
    technologies: ['Next.js', 'React.js', 'Node.js', 'TypeScript', 'MongoDB', 'AWS'],
    systemLogCode: 'CH_01 // 10.0159° N, 76.3419° E',
    atmosphereColor: '#8b5cf6'
  },
  {
    id: 'exp-seclob',
    chapterNumber: '02',
    year: '2024 – 2025',
    role: 'Full Stack Developer Intern',
    title: 'Full Stack Developer Intern',
    company: 'Seclob Technologies',
    companyTag: 'Product Engineering',
    period: 'December 2024 – May 2025',
    type: 'Internship',
    location: 'Kozhikode, Kerala',
    summary: 'Built full-stack MERN applications and scalable backend architectures.',
    responsibilities: [
      'Engineered responsive React.js interfaces and modular Node.js/Express.js REST APIs with JWT authentication.',
      'Designed high-speed MongoDB schemas and integrated real-time Socket.io features across AWS deployments.'
    ],
    technologies: ['React.js', 'Node.js', 'Express.js', 'MongoDB', 'Socket.io', 'AWS'],
    systemLogCode: 'CH_02 // 11.2588° N, 75.7804° E',
    atmosphereColor: '#a855f7'
  }
];
