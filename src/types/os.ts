export type AppId =
  | 'about'
  | 'experience'
  | 'projects'
  | 'project-detail'
  | 'skills'
  | 'resume'
  | 'contact'
  | 'terminal'
  | 'settings';

export type AccentColor = 'blue' | 'purple' | 'green' | 'orange';
export type AppearanceTheme = 'dark' | 'light';
export type AnimationMode = 'full' | 'reduced';
export type WallpaperId = 'cyber-mesh' | 'cosmic-grid' | 'aurora' | 'minimalist';

export interface WindowPosition {
  x: number;
  y: number;
}

export interface WindowDimension {
  width: number;
  height: number;
}

export interface WindowInstance {
  id: string;
  appId: AppId;
  title: string;
  isOpen: boolean;
  isMinimized: boolean;
  isMaximized: boolean;
  zIndex: number;
  position: WindowPosition;
  size: WindowDimension;
  data?: any; // e.g. active project data for project-detail
}

export interface AppDefinition {
  id: AppId;
  title: string;
  iconName: string;
  description: string;
  defaultSize: WindowDimension;
  defaultPosition: WindowPosition;
  isDesktopShortcut: boolean;
  dockShortcut?: boolean;
}

export interface ProjectItem {
  id: string;
  title: string;
  shortDescription: string;
  fullOverview: string;
  tagline: string;
  category: 'Full Stack' | 'Frontend' | 'Cloud & Systems';
  technologies: string[];
  features: string[];
  architectureHighlights: string[];
  myContribution: string[];
  challenges: string[];
  solutions: string[];
  liveDemoUrl?: string; // Configurable placeholder
  githubUrl?: string;   // Configurable placeholder
  imageUrl?: string;
  accentColor?: string;
  version: string;
  status: 'Production' | 'Live' | 'Completed' | 'Active';
}

export interface SkillItem {
  name: string;
  level: number; // 0 to 100 for telemetry meter visuals, clearly noted as capability index
  category: 'Frontend' | 'Backend' | 'Database' | 'Cloud & Tools' | 'Architecture & Methodologies';
  icon?: string;
  statusText: string;
  yearsExperience?: string;
}

export interface ExperienceItem {
  id?: string;
  chapterNumber: string; // e.g. "01", "02"
  year: string;
  role: string;
  title: string;
  company: string;
  companyTag?: string;
  period: string;
  type: string;
  location: string;
  summary: string;
  responsibilities: string[];
  technologies: string[];
  systemLogCode: string;
  metrics?: { label: string; value: string }[];
  keyAchievements?: string[];
  atmosphereColor?: string;
}
