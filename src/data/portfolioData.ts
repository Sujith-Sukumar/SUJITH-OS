export interface SocialLink {
  name: string;
  url: string;
  icon: string;
  isPlaceholder: boolean;
}

export interface PortfolioConfig {
  personal: {
    name: string;
    fullName: string;
    role: string;
    tagline: string;
    bio: string[];
    experienceYears: string;
    primaryStack: string;
    location: string;
    methodology: string;
    availability: string;
    systemVersion: string;
    status: string;
  };
  contact: {
    email: string; // Configurable placeholder
    phone?: string;
    github: string; // Configurable placeholder
    linkedin: string; // Configurable placeholder
    resumePdfUrl: string; // Configurable placeholder (e.g. "/resume.pdf" or external link)
    socials: SocialLink[];
  };
  telemetry: {
    uptime: string;
    kernel: string;
    engine: string;
    compiler: string;
    locationCode: string;
  };
}

export const portfolioConfig: PortfolioConfig = {
  personal: {
    name: "Sujith K",
    fullName: "Sujith K",
    role: "Full Stack Developer",
    tagline: "Building scalable and engaging web applications using modern technologies.",
    bio: [
      "Full Stack Developer with 1.5+ years of hands-on professional engineering experience, specializing in the MERN stack.",
      "Passionate about clean architecture, high-performance responsive user interfaces, real-time client-server communication, and robust RESTful API design.",
      "Dedicated to crafting polished digital experiences with attention to performance, modern design systems, and maintainable TypeScript codebases."
    ],
    experienceYears: "1.5+ Years",
    primaryStack: "MERN Stack (MongoDB, Express, React, Node.js)",
    location: "Kerala, India",
    methodology: "Agile / Scrum",
    availability: "Available for Full Stack Opportunities",
    systemVersion: "SUJITH OS v2.0 (Build 2026.10)",
    status: "SYSTEM OPERATIONAL // ACTIVE"
  },
  contact: {
    email: "sujithsukumarofficial@gmail.com",
    github: "https://github.com/your-username",
    linkedin: "https://linkedin.com/in/sujith-sukumar",
    resumePdfUrl: "/SUJITH.CV.pdf",
    socials: [
      {
        name: "GitHub",
        url: "https://github.com/your-username",
        icon: "Github",
        isPlaceholder: true
      },
      {
        name: "LinkedIn",
        url: "https://linkedin.com/in/sujith-sukumar",
        icon: "Linkedin",
        isPlaceholder: false
      },
      {
        name: "Email",
        url: "mailto:sujithsukumarofficial@gmail.com",
        icon: "Mail",
        isPlaceholder: false
      }
    ]
  },
  telemetry: {
    uptime: "99.98%",
    kernel: "Darwin-React-6.4-Vite",
    engine: "V8 / Node 22.x / React 19",
    compiler: "TypeScript 5.x ESM",
    locationCode: "IN-KL // 10.8505° N, 76.2711° E"
  }
};
