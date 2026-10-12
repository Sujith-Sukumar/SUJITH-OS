import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import {
  ArrowLeft,
  ExternalLink,
  Zap,
  ArrowUpRight,
  Cpu,
  ShieldCheck,
  X,
  Radio,
  ChevronRight,
} from 'lucide-react';
import { GithubIcon as Github } from '../../ui/BrandIcons';
import { projectsData } from '../../../data/projects';
import { ProjectItem } from '../../../types/os';
import { workspaceSound } from '../../../utils/workspaceAudio';

gsap.registerPlugin(ScrollTrigger);

interface ProjectsRoomProps {
  onReturn: () => void;
}

interface ProjectVisualConfig {
  accent: string;
  badge: string;
  year: string;
  metrics: { label: string; value: string }[];
  summary: string;
  previewType: 'matrimony' | 'lms' | 'hrm' | 'crm';
}

const PROJECT_VISUALS: Record<string, ProjectVisualConfig> = {
  'matrimony-platform': {
    accent: '#3b82f6',
    badge: 'CASE STUDY 01',
    year: '2025 — 2026',
    metrics: [
      { label: 'Realtime', value: 'Socket.io WS' },
      { label: 'Storage', value: 'AWS S3 CDN' },
      { label: 'Payments', value: 'Razorpay API' },
    ],
    summary:
      'Production matchmaking platform featuring real-time Socket.io chat, AWS S3 media pipelines, and Razorpay subscription billing.',
    previewType: 'matrimony',
  },
  'lms-platform': {
    accent: '#2563eb',
    badge: 'CASE STUDY 02',
    year: '2025',
    metrics: [
      { label: 'Security', value: 'Tiered RBAC' },
      { label: 'Media', value: 'Protected Stream' },
      { label: 'State', value: 'Progress Sync' },
    ],
    summary:
      'Enterprise learning platform with hierarchical RBAC, protected video course delivery, and real-time student progress tracking.',
    previewType: 'lms',
  },
  'hrm-platform': {
    accent: '#0ea5e9',
    badge: 'CASE STUDY 03',
    year: '2025',
    metrics: [
      { label: 'Payroll', value: 'Automated Run' },
      { label: 'Attendance', value: 'Shift Engine' },
      { label: 'Access', value: 'Multi-Role' },
    ],
    summary:
      'Workforce management system automating attendance tracking, leave approval workflows, and monthly payroll generation.',
    previewType: 'hrm',
  },
  'crm-platform': {
    accent: '#60a5fa',
    badge: 'CASE STUDY 04',
    year: '2025 — 2026',
    metrics: [
      { label: 'Pipeline', value: 'Kanban Engine' },
      { label: 'Scoring', value: 'Lead Analytics' },
      { label: 'Updates', value: 'Live Socket.io' },
    ],
    summary:
      'Sales pipeline and customer relationship platform with interactive Kanban stages, automated lead scoring, and revenue telemetry.',
    previewType: 'crm',
  },
};

export const ProjectsRoom: React.FC<ProjectsRoomProps> = ({ onReturn }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [activeCategory, setActiveCategory] = useState<'All' | 'Full Stack' | 'Frontend'>('All');
  const [selectedProject, setSelectedProject] = useState<ProjectItem | null>(null);

  const filteredProjects = projectsData.filter((p) => {
    if (activeCategory === 'All') return true;
    return p.category === activeCategory;
  });

  useEffect(() => {
    workspaceSound.playOpen();

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    const ctx = gsap.context(() => {
      const caseStudies = gsap.utils.toArray<HTMLElement>('.case-study-item');
      caseStudies.forEach((item) => {
        const visual = item.querySelector('.project-visual');
        const text = item.querySelector('.project-text');

        if (visual) {
          gsap.fromTo(
            visual,
            { opacity: 0, y: 36, scale: 0.98 },
            {
              opacity: 1,
              y: 0,
              scale: 1,
              duration: 0.85,
              ease: 'power3.out',
              scrollTrigger: {
                trigger: item,
                scroller: scrollRef.current,
                start: 'top 86%',
                once: true,
              },
            }
          );
        }

        if (text) {
          gsap.fromTo(
            text,
            { opacity: 0, y: 28 },
            {
              opacity: 1,
              y: 0,
              duration: 0.75,
              delay: 0.1,
              ease: 'power3.out',
              scrollTrigger: {
                trigger: item,
                scroller: scrollRef.current,
                start: 'top 86%',
                once: true,
              },
            }
          );
        }
      });
    }, containerRef);

    return () => ctx.revert();
  }, [activeCategory]);

  const handleReturn = () => {
    workspaceSound.playClose();
    onReturn();
  };

  const handleOpenStudy = (project: ProjectItem) => {
    try {
      workspaceSound.playClick();
    } catch {}
    setSelectedProject(project);
  };

  const renderProjectMockup = (project: ProjectItem) => {
    const visual = PROJECT_VISUALS[project.id] || {
      accent: '#3b82f6',
      badge: 'CASE STUDY',
      year: '2025',
      metrics: [],
      summary: project.shortDescription,
      previewType: 'matrimony',
    };

    const configMap = {
      matrimony: {
        url: 'https://marrymitra.com',
        tag: 'LIVE PRODUCTION',
        img: '/Matrimony.png',
        alt: 'Matrimony Platform Screenshot',
        stack: 'MERN · SOCKET.IO · AWS S3 · RAZORPAY',
        Icon: Radio,
      },
      lms: {
        url: 'lms-architecture // internal',
        tag: 'RBAC SECURED',
        img: '/LMS.png',
        alt: 'Learning Management System Screenshot',
        stack: 'REACT · TYPESCRIPT · NODE · MONGODB',
        Icon: ShieldCheck,
      },
      hrm: {
        url: 'hrm-workforce // enterprise',
        tag: 'WORKFORCE CORE',
        img: '/HRM.png',
        alt: 'Human Resource Management Screenshot',
        stack: 'REACT · TYPESCRIPT · REDUX · MONGODB',
        Icon: ShieldCheck,
      },
      crm: {
        url: 'https://estaconnect.in',
        tag: 'LIVE PRODUCTION',
        img: '/CRM.png',
        alt: 'Customer Relationship Management Screenshot',
        stack: 'REACT · TYPESCRIPT · NODE · SOCKET.IO',
        Icon: Zap,
      },
    };

    const cfg = configMap[visual.previewType];
    const StatusIcon = cfg.Icon;

    return (
      <div className="w-full h-full bg-[#080a10] flex flex-col justify-between font-sans select-none relative overflow-hidden group/mockup">
        {/* Top Browser Frame */}
        <div className="flex items-center justify-between px-4 py-2.5 border-b border-white/[0.08] bg-[#06080d]/90 backdrop-blur-md relative z-20">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-zinc-700" />
            <span className="w-2.5 h-2.5 rounded-full bg-zinc-700" />
            <span className="w-2.5 h-2.5 rounded-full bg-zinc-700" />
            <span className="ml-2.5 font-mono text-[10px] tracking-wider text-zinc-400 hidden sm:inline-block">
              {cfg.url}
            </span>
          </div>
          <div className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-blue-500/10 border border-blue-400/25 text-[9px] font-mono tracking-[0.16em] text-blue-300">
            <StatusIcon className="w-2.5 h-2.5 text-blue-400" />
            <span>{cfg.tag}</span>
          </div>
        </div>

        {/* Authentic Production Screenshot */}
        <div className="relative flex-1 w-full overflow-hidden bg-[#06070a]">
          <img
            src={cfg.img}
            alt={cfg.alt}
            loading="lazy"
            className="w-full h-full object-cover object-top transition-transform duration-700 ease-out group-hover/mockup:scale-[1.03]"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#080a10] via-transparent to-black/20 pointer-events-none" />
        </div>

        {/* Bottom Architectural Telemetry Strip */}
        <div className="flex items-center justify-between px-4 py-2.5 border-t border-white/[0.08] bg-[#06080d]/90 text-[10px] font-mono tracking-[0.16em] text-zinc-400 relative z-20">
          <span className="text-blue-300/90">{cfg.stack}</span>
          <span className="hidden sm:inline text-zinc-500">INSPECT ARCHITECTURE</span>
        </div>
      </div>
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      className="fixed inset-0 z-50 flex flex-col bg-[#06070a] text-white overflow-hidden select-none"
      ref={containerRef}
    >
      {/* Restrained Atmospheric Background */}
      <div className="absolute inset-0 z-0 bg-[radial-gradient(ellipse_at_top,_rgba(59,130,246,0.08)_0%,_rgba(6,7,10,0.92)_55%,_#06070a_100%)] pointer-events-none" />

      {/* Dedicated Top Navigation Header */}
      <header className="relative z-30 shrink-0 w-full bg-[#06070a]/90 backdrop-blur-md border-b border-white/[0.07] px-6 sm:px-10 md:px-14 py-3.5 flex items-center justify-between">
        <button
          onClick={handleReturn}
          className="group flex items-center gap-3 text-left cursor-pointer focus:outline-none"
        >
          <span className="w-8 h-8 rounded-full border border-white/15 bg-white/[0.03] flex items-center justify-center transition-all duration-300 group-hover:border-blue-400/60 group-hover:bg-blue-400/10 group-hover:-translate-x-0.5">
            <ArrowLeft className="w-3.5 h-3.5 text-zinc-300 group-hover:text-blue-300 transition-colors" />
          </span>
          <div className="flex flex-col">
            <span className="font-mono text-[10px] tracking-[0.24em] text-zinc-200 group-hover:text-blue-300 transition-colors">
              RETURN TO NEXUS
            </span>
            <span className="font-mono text-[8px] tracking-[0.2em] text-zinc-500">
              ESC // CHAMBER 02 · SELECTED WORKS
            </span>
          </div>
        </button>

        {/* Category Filter Pills */}
        <div className="hidden sm:flex items-center gap-1 p-1 rounded-full bg-white/[0.02] border border-white/[0.07]">
          {(['All', 'Full Stack', 'Frontend'] as const).map((cat) => (
            <button
              key={cat}
              onClick={() => {
                setActiveCategory(cat);
                try {
                  workspaceSound.playHover();
                } catch {}
              }}
              className={`px-3.5 py-1 rounded-full font-mono text-[10px] tracking-[0.18em] uppercase transition-all cursor-pointer ${
                activeCategory === cat
                  ? 'bg-blue-500/20 text-blue-300 border border-blue-400/40'
                  : 'text-zinc-400 hover:text-zinc-200 border border-transparent'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="text-right font-mono">
          <div className="text-[9px] tracking-[0.24em] text-blue-400/90 uppercase">
            ARCHIVE // 04 PRODUCTION SYSTEMS
          </div>
          <div className="text-[8px] tracking-[0.2em] text-zinc-500">
            MERN &amp; NEXT.JS ARCHITECTURE
          </div>
        </div>
      </header>

      {/* Main Editorial Scroll Stream */}
      <div className="relative z-10 flex-1 overflow-y-auto scroll-smooth" ref={scrollRef}>
        <div className="max-w-7xl mx-auto px-6 sm:px-10 md:px-14 pt-6 sm:pt-8 md:pt-10 pb-28 space-y-20 md:space-y-28">
          {/* Concise Hero Header */}
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2.5 mb-3">
              <span className="w-2 h-2 rounded-full bg-blue-400" />
              <span className="text-[10px] font-mono tracking-[0.28em] text-blue-300 uppercase">
                02 / SELECTED PRODUCTION WORKS
              </span>
            </div>
            <h1 className="font-display font-bold tracking-[-0.03em] text-white leading-[1.06] text-[clamp(2rem,4.4vw,3.75rem)]">
              Engineered for scale. Built for real users.
            </h1>
          </div>

          {/* Case Studies List */}
          <div className="space-y-20 md:space-y-28">
            {filteredProjects.map((project, index) => {
              const visual = PROJECT_VISUALS[project.id] || {
                accent: '#3b82f6',
                badge: `CASE STUDY 0${index + 1}`,
                year: '2025',
                metrics: [],
                summary: project.shortDescription,
                previewType: 'matrimony',
              };

              const isEven = index % 2 === 0;

              return (
                <article
                  key={project.id}
                  className="case-study-item grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center pt-8 border-t border-white/[0.07]"
                >
                  {/* Project Screenshot Frame */}
                  <div
                    className={`project-visual lg:col-span-7 ${
                      isEven ? 'lg:order-1' : 'lg:order-2'
                    }`}
                  >
                    <div
                      onClick={() => handleOpenStudy(project)}
                      className="group relative rounded-xl overflow-hidden border border-white/10 hover:border-blue-400/50 transition-colors duration-300 bg-[#08090e] shadow-2xl cursor-pointer"
                      style={{ height: 'clamp(290px, 42vh, 440px)' }}
                    >
                      {renderProjectMockup(project)}

                      <div className="absolute inset-0 bg-black/55 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-between p-6 pointer-events-none">
                        <div>
                          <span className="font-mono text-[10px] tracking-[0.22em] text-blue-300 uppercase">
                            TECHNICAL CASE STUDY
                          </span>
                          <h4 className="text-lg font-bold font-display text-white mt-0.5">
                            {project.title}
                          </h4>
                        </div>
                        <div className="px-4 py-2 rounded-full bg-blue-500/20 border border-blue-400/50 text-blue-200 font-mono text-[10px] tracking-[0.2em] flex items-center gap-1.5">
                          <span>INSPECT</span>
                          <ArrowUpRight className="w-3.5 h-3.5" />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Concise Editorial Column */}
                  <div
                    className={`project-text lg:col-span-5 space-y-5 ${
                      isEven ? 'lg:order-2' : 'lg:order-1'
                    }`}
                  >
                    <div className="flex items-center gap-3 font-mono text-[10px] tracking-[0.22em]">
                      <span className="text-blue-300">{visual.badge}</span>
                      <span className="text-zinc-600">//</span>
                      <span className="text-zinc-400">{visual.year}</span>
                    </div>

                    <div>
                      <h2
                        onClick={() => handleOpenStudy(project)}
                        className="font-display text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight text-white hover:text-blue-300 transition-colors cursor-pointer"
                      >
                        {project.title}
                      </h2>
                      <p className="text-xs font-mono text-zinc-400 mt-1.5">{project.tagline}</p>
                    </div>

                    <p className="text-sm text-zinc-300 leading-relaxed">{visual.summary}</p>

                    {visual.metrics.length > 0 && (
                      <div className="grid grid-cols-3 gap-3 pt-2 border-t border-white/10">
                        {visual.metrics.map((m, mIdx) => (
                          <div key={mIdx}>
                            <div className="text-[9px] font-mono tracking-[0.2em] text-zinc-500 uppercase">
                              {m.label}
                            </div>
                            <div className="text-xs font-mono font-semibold text-zinc-200 mt-0.5">
                              {m.value}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Action Links */}
                    <div className="flex flex-wrap items-center gap-3 pt-2">
                      <button
                        onClick={() => handleOpenStudy(project)}
                        className="px-5 py-2.5 rounded-full bg-blue-500/15 hover:bg-blue-500/25 border border-blue-400/40 text-blue-200 font-mono text-[10px] tracking-[0.2em] uppercase flex items-center gap-2 transition-colors cursor-pointer"
                      >
                        <span>CASE STUDY</span>
                        <ArrowUpRight className="w-3.5 h-3.5" />
                      </button>

                      {project.liveDemoUrl && (
                        <a
                          href={project.liveDemoUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="px-4 py-2.5 rounded-full bg-white/[0.04] hover:bg-white/[0.09] text-zinc-200 border border-white/10 font-mono text-[10px] tracking-[0.2em] uppercase flex items-center gap-2 transition-colors"
                        >
                          <ExternalLink className="w-3 h-3" />
                          <span>LIVE SITE</span>
                        </a>
                      )}

                      {project.githubUrl && (
                        <a
                          href={project.githubUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="p-2.5 rounded-full bg-white/[0.04] hover:bg-white/[0.09] text-zinc-300 hover:text-white border border-white/10 transition-colors"
                          title="View Repository"
                        >
                          <Github className="w-3.5 h-3.5" />
                        </a>
                      )}
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </div>

      {/* Case Study Drawer */}
      <AnimatePresence>
        {selectedProject && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-end bg-black/75 backdrop-blur-sm"
            onClick={() => setSelectedProject(null)}
          >
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 30, stiffness: 300 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-xl h-full bg-[#080a10] border-l border-white/10 shadow-2xl flex flex-col overflow-hidden text-white"
            >
              <div className="flex items-center justify-between px-6 py-5 border-b border-white/10 bg-[#06070a]">
                <div>
                  <span className="text-[10px] font-mono tracking-[0.22em] text-blue-400 uppercase">
                    {selectedProject.category} // {selectedProject.status}
                  </span>
                  <h3 className="text-xl font-bold font-display text-white mt-0.5">
                    {selectedProject.title}
                  </h3>
                </div>

                <button
                  onClick={() => setSelectedProject(null)}
                  className="p-2 rounded-full bg-white/5 hover:bg-white/10 text-zinc-400 hover:text-white transition-colors cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-6 space-y-6">
                <div className="h-52 rounded-lg overflow-hidden border border-white/10">
                  {renderProjectMockup(selectedProject)}
                </div>

                <div className="space-y-2">
                  <h4 className="text-[10px] font-mono tracking-[0.22em] text-blue-300 uppercase">
                    OVERVIEW
                  </h4>
                  <p className="text-sm text-zinc-300 leading-relaxed">
                    {selectedProject.shortDescription}
                  </p>
                </div>

                <div className="space-y-2.5">
                  <h4 className="text-[10px] font-mono tracking-[0.22em] text-blue-300 uppercase flex items-center gap-2">
                    <Cpu className="w-3.5 h-3.5 text-blue-400" />
                    <span>KEY ARCHITECTURE HIGHLIGHTS</span>
                  </h4>
                  <div className="space-y-2">
                    {selectedProject.architectureHighlights.slice(0, 3).map((arch, i) => (
                      <div
                        key={i}
                        className="p-3 rounded-lg bg-white/[0.02] border border-white/[0.06] text-xs text-zinc-300 leading-relaxed flex items-start gap-2.5"
                      >
                        <ChevronRight className="w-3.5 h-3.5 text-blue-400 shrink-0 mt-0.5" />
                        <span>{arch}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <h4 className="text-[10px] font-mono tracking-[0.22em] text-blue-300 uppercase">
                    TECHNOLOGY STACK
                  </h4>
                  <div className="flex flex-wrap gap-1.5">
                    {selectedProject.technologies.map((tech) => (
                      <span
                        key={tech}
                        className="px-2.5 py-1 rounded bg-white/[0.04] border border-white/10 text-[11px] font-mono text-zinc-300"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="pt-4 flex items-center gap-3 border-t border-white/10">
                  {selectedProject.liveDemoUrl && (
                    <a
                      href={selectedProject.liveDemoUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="flex-1 py-2.5 px-4 rounded-full bg-blue-500/20 hover:bg-blue-500/30 border border-blue-400/40 text-blue-200 font-mono text-[10px] tracking-[0.2em] uppercase flex items-center justify-center gap-2 transition-colors"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                      <span>OPEN LIVE SITE</span>
                    </a>
                  )}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default ProjectsRoom;
