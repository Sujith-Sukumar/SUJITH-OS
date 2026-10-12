import React from 'react';
import { useWindowStore } from '../../store/windowStore';
import { WindowFrame } from './WindowFrame';
import { AboutApp } from '../apps/AboutApp';
import { ExperienceApp } from '../apps/ExperienceApp';
import { ProjectsApp } from '../apps/ProjectsApp';
import { ProjectDetailApp } from '../apps/ProjectDetailApp';
import { SkillsApp } from '../apps/SkillsApp';
import { TerminalApp } from '../apps/TerminalApp';
import { ResumeApp } from '../apps/ResumeApp';
import { ContactApp } from '../apps/ContactApp';
import { SettingsApp } from '../apps/SettingsApp';

export const WindowManager: React.FC = () => {
  const windows = useWindowStore((s) => s.windows);

  const renderAppContent = (win: any) => {
    switch (win.appId) {
      case 'about':
        return <AboutApp />;
      case 'experience':
        return <ExperienceApp />;
      case 'projects':
        return <ProjectsApp />;
      case 'project-detail':
        return <ProjectDetailApp project={win.data} />;
      case 'skills':
        return <SkillsApp />;
      case 'terminal':
        return <TerminalApp />;
      case 'resume':
        return <ResumeApp />;
      case 'contact':
        return <ContactApp />;
      case 'settings':
        return <SettingsApp />;
      default:
        return (
          <div className="p-8 text-center text-slate-400">
            Application content unavailable.
          </div>
        );
    }
  };

  return (
    <div className="absolute inset-0 pointer-events-none z-10">
      {windows.map((win) => (
        <div key={win.id} className="pointer-events-auto">
          <WindowFrame window={win}>
            {renderAppContent(win)}
          </WindowFrame>
        </div>
      ))}
    </div>
  );
};
