import { SkillItem } from '../types/os';

export interface SkillCategoryGroup {
  category: string;
  code: string;
  status: string;
  skills: SkillItem[];
}

export const skillsData: SkillCategoryGroup[] = [
  {
    category: 'Frontend Engineering',
    code: 'MOD_FE_01',
    status: 'OPTIMAL // CORE',
    skills: [
      { name: 'React.js', level: 95, category: 'Frontend', statusText: 'Primary / Production Ready', yearsExperience: '1.5+ yrs' },
      { name: 'JavaScript (ES6+)', level: 92, category: 'Frontend', statusText: 'Core Standard / Advanced', yearsExperience: '2+ yrs' },
      { name: 'TypeScript', level: 88, category: 'Frontend', statusText: 'Strict Typing / Scalable', yearsExperience: '1.5+ yrs' },
      { name: 'Next.js', level: 82, category: 'Frontend', statusText: 'App Router / SSR / SSG', yearsExperience: '1+ yrs' },
      { name: 'Angular', level: 75, category: 'Frontend', statusText: 'Components / Services / RxJS', yearsExperience: 'Proficient' },
      { name: 'Redux / Toolkit', level: 86, category: 'Frontend', statusText: 'Global State Architecture', yearsExperience: '1.5+ yrs' },
      { name: 'Tailwind CSS', level: 94, category: 'Frontend', statusText: 'Responsive / Design Systems', yearsExperience: '1.5+ yrs' },
      { name: 'Bootstrap / Material UI', level: 84, category: 'Frontend', statusText: 'Rapid Layout Prototyping', yearsExperience: '1.5+ yrs' }
    ]
  },
  {
    category: 'Backend Architecture',
    code: 'MOD_BE_02',
    status: 'ONLINE // ROBUST',
    skills: [
      { name: 'Node.js', level: 90, category: 'Backend', statusText: 'Event Loop / Microservices', yearsExperience: '1.5+ yrs' },
      { name: 'Express.js', level: 92, category: 'Backend', statusText: 'RESTful APIs / Middleware', yearsExperience: '1.5+ yrs' },
      { name: 'Socket.io', level: 85, category: 'Backend', statusText: 'Real-Time Bi-Directional WebSockets', yearsExperience: '1+ yrs' },
      { name: 'Nodemailer', level: 88, category: 'Backend', statusText: 'Transactional Email Systems', yearsExperience: '1+ yrs' },
      { name: 'RESTful API Design', level: 94, category: 'Backend', statusText: 'Standards / JWT / Auth', yearsExperience: '1.5+ yrs' }
    ]
  },
  {
    category: 'Database & Storage',
    code: 'MOD_DB_03',
    status: 'PERSISTENT // STABLE',
    skills: [
      { name: 'MongoDB', level: 88, category: 'Database', statusText: 'NoSQL / Aggregations / Indexes', yearsExperience: '1.5+ yrs' },
      { name: 'Mongoose ODM', level: 90, category: 'Database', statusText: 'Data Modeling / Validation', yearsExperience: '1.5+ yrs' }
    ]
  },
  {
    category: 'Cloud, Integrations & APIs',
    code: 'MOD_CLOUD_04',
    status: 'INTEGRATED // SECURE',
    skills: [
      { name: 'AWS S3', level: 84, category: 'Cloud & Tools', statusText: 'Object Storage / Buckets', yearsExperience: '1+ yrs' },
      { name: 'Razorpay Payment Gateway', level: 86, category: 'Cloud & Tools', statusText: 'Webhooks / Checkout API', yearsExperience: '1+ yrs' },
      { name: 'Cloudinary', level: 88, category: 'Cloud & Tools', statusText: 'Media Optimization & CDN', yearsExperience: '1.5+ yrs' },
      { name: 'Google Gemini API', level: 82, category: 'Cloud & Tools', statusText: 'LLM Integration & Prompting', yearsExperience: 'Active' }
    ]
  },
  {
    category: 'Dev Tools & Methodology',
    code: 'MOD_OPS_05',
    status: 'SYNCHRONIZED // AGILE',
    skills: [
      { name: 'Git & GitHub', level: 92, category: 'Cloud & Tools', statusText: 'Version Control / PR Workflows', yearsExperience: '2+ yrs' },
      { name: 'Postman', level: 90, category: 'Cloud & Tools', statusText: 'API Automation & Testing', yearsExperience: '2+ yrs' },
      { name: 'VS Code', level: 96, category: 'Cloud & Tools', statusText: 'Development Environment', yearsExperience: '2+ yrs' },
      { name: 'Agile / Scrum', level: 88, category: 'Architecture & Methodologies', statusText: 'Sprint Cadence & Standups', yearsExperience: '1.5+ yrs' }
    ]
  }
];

// Helper to generate the diagnostic terminal ASCII block bar
export function generateBlockBar(level: number, length: number = 20): string {
  const filled = Math.round((level / 100) * length);
  const empty = length - filled;
  return '█'.repeat(filled) + '░'.repeat(empty);
}
