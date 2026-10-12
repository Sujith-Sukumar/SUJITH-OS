import React, { useState } from 'react';
import { useWindowStore, APP_REGISTRY } from '../../store/windowStore';
import { portfolioConfig } from '../../data/portfolioData';
import { AppId } from '../../types/os';
import { getAppIcon } from '../../utils/icons';
import { AboutApp } from '../apps/AboutApp';
import { ExperienceApp } from '../apps/ExperienceApp';
import { ProjectsApp } from '../apps/ProjectsApp';
import { ProjectDetailApp } from '../apps/ProjectDetailApp';
import { SkillsApp } from '../apps/SkillsApp';
import { TerminalApp } from '../apps/TerminalApp';
import { ResumeApp } from '../apps/ResumeApp';
import { ContactApp } from '../apps/ContactApp';
import { SettingsApp } from '../apps/SettingsApp';
import {
  Wifi,
  BatteryMedium,
  ArrowLeft,
  X,
  Home,
  FolderKanban,
  Terminal,
  Send,
  MapPin
} from 'lucide-react';
import { playSystemSound } from '../../utils/sound';

export const MobileLayout: React.FC = () => {
  const { windows, activeWindowId, openWindow, closeWindow } = useWindowStore();
  const [activeMobileApp, setActiveMobileApp] = useState<AppId | null>(null);
  const [projectDetailData, setProjectDetailData] = useState<any>(null);

  const activeWindow = windows.find((w) => w.id === activeWindowId && !w.isMinimized);

  const handleOpenApp = (appId: AppId, data?: any) => {
    setActiveMobileApp(appId);
    if (data) setProjectDetailData(data);
    openWindow(appId, { data });
    playSystemSound('open');
  };

  const handleCloseActive = () => {
    if (activeWindow) {
      closeWindow(activeWindow.id);
    }
    setActiveMobileApp(null);
    setProjectDetailData(null);
    playSystemSound('close');
  };

  const currentAppId = activeWindow?.appId || activeMobileApp;

  const renderActiveApp = () => {
    switch (currentAppId) {
      case 'about':
        return <AboutApp />;
      case 'experience':
        return <ExperienceApp />;
      case 'projects':
        return <ProjectsApp />;
      case 'project-detail':
        return <ProjectDetailApp project={activeWindow?.data || projectDetailData} />;
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
        return null;
    }
  };

  return (
    <div className="fixed inset-0 z-20 flex flex-col bg-bg text-txt-primary overflow-hidden select-none md:hidden">
      {/* Mobile Top Status Bar */}
      <div className="h-8 px-4 flex items-center justify-between text-[11px] font-mono text-txt-muted bg-surface-secondary border-b border-border flex-shrink-0">
        <div className="font-semibold text-txt-primary">
          {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </div>
        <div className="flex items-center gap-2">
          <Wifi className="w-3.5 h-3.5 text-txt-muted" />
          <div className="flex items-center gap-1 text-txt-secondary">
            <BatteryMedium className="w-3.5 h-3.5" />
            <span>100%</span>
          </div>
        </div>
      </div>

      {/* Main View Area */}
      <div className="flex-1 relative overflow-hidden flex flex-col">
        {currentAppId ? (
          /* Fullscreen Mobile App View */
          <div className="absolute inset-0 flex flex-col bg-surface z-30">
            {/* Header */}
            <div className="h-12 px-3 flex items-center justify-between bg-surface-secondary border-b border-border flex-shrink-0">
              <button
                onClick={handleCloseActive}
                className="flex items-center gap-1 text-xs font-mono text-txt-secondary hover:text-txt-primary"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Home</span>
              </button>

              <span className="font-semibold text-xs text-txt-primary truncate max-w-[200px]">
                {APP_REGISTRY[currentAppId]?.title || 'Application'}
              </span>

              <button
                onClick={handleCloseActive}
                className="w-7 h-7 rounded-lg flex items-center justify-center hover:bg-surface-hover text-txt-muted hover:text-txt-primary"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* App Body */}
            <div className="flex-1 overflow-y-auto overflow-x-hidden bg-surface">
              {renderActiveApp()}
            </div>
          </div>
        ) : (
          /* Mobile Launcher Grid */
          <div className="flex-1 flex flex-col p-5 overflow-y-auto">
            {/* User Profile Card */}
            <div className="p-4 rounded-xl bg-surface border border-border shadow-sm mb-6">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-lg bg-surface-secondary border border-border flex items-center justify-center font-mono font-bold text-txt-primary text-base">
                  SK
                </div>
                <div>
                  <h1 className="text-base font-semibold text-txt-primary">
                    {portfolioConfig.personal.fullName}
                  </h1>
                  <p className="text-xs text-txt-secondary font-mono">
                    {portfolioConfig.personal.role}
                  </p>
                  <p className="text-[11px] text-txt-muted mt-0.5 flex items-center gap-1">
                    <MapPin className="w-3 h-3" />
                    {portfolioConfig.personal.location}
                  </p>
                </div>
              </div>

              <div className="mt-3 pt-2.5 border-t border-border-subtle flex items-center justify-between text-[11px] font-mono">
                <span className="text-txt-muted">STACK: MERN</span>
                <span className="text-status-success font-semibold">AVAILABLE</span>
              </div>
            </div>

            {/* Applications Grid */}
            <div className="text-[10px] font-mono uppercase text-txt-muted tracking-wider mb-2.5 px-1 font-semibold">
              APPLICATIONS
            </div>

            <div className="grid grid-cols-4 gap-2.5">
              {Object.values(APP_REGISTRY)
                .filter((app) => app.id !== 'project-detail')
                .map((app) => (
                  <button
                    key={app.id}
                    onClick={() => handleOpenApp(app.id)}
                    className="flex flex-col items-center gap-1.5 p-2 rounded-xl active:bg-surface-hover transition-colors outline-none"
                  >
                    <div className="w-12 h-12 rounded-xl bg-surface border border-border flex items-center justify-center text-txt-secondary shadow-xs">
                      {getAppIcon(app.id, { className: 'w-5 h-5' })}
                    </div>
                    <span className="text-[11px] text-txt-primary text-center truncate max-w-[68px]">
                      {app.id === 'about'
                        ? 'About'
                        : app.id === 'experience'
                        ? 'Experience'
                        : app.id === 'projects'
                        ? 'Projects'
                        : app.id === 'skills'
                        ? 'Skills'
                        : app.id === 'resume'
                        ? 'Resume'
                        : app.id === 'contact'
                        ? 'Contact'
                        : app.id === 'terminal'
                        ? 'Terminal'
                        : 'Settings'}
                    </span>
                  </button>
                ))}
            </div>

            <div className="mt-8 p-3 rounded-lg bg-surface border border-border text-[11px] font-mono text-txt-muted text-center">
              SUJITH OS v2.0 Mobile Workstation
            </div>
          </div>
        )}
      </div>

      {/* Mobile Bottom Navigation Dock */}
      <div className="h-14 bg-surface border-t border-border flex items-center justify-around px-2 flex-shrink-0 z-40">
        <button
          onClick={handleCloseActive}
          className={`flex flex-col items-center gap-0.5 p-1 rounded-lg ${
            !currentAppId ? 'text-txt-primary font-semibold' : 'text-txt-muted'
          }`}
        >
          <Home className="w-5 h-5" />
          <span className="text-[10px] font-mono">Home</span>
        </button>

        <button
          onClick={() => handleOpenApp('projects')}
          className={`flex flex-col items-center gap-0.5 p-1 rounded-lg ${
            currentAppId === 'projects' || currentAppId === 'project-detail'
              ? 'text-txt-primary font-semibold'
              : 'text-txt-muted'
          }`}
        >
          <FolderKanban className="w-5 h-5" />
          <span className="text-[10px] font-mono">Projects</span>
        </button>

        <button
          onClick={() => handleOpenApp('terminal')}
          className={`flex flex-col items-center gap-0.5 p-1 rounded-lg ${
            currentAppId === 'terminal' ? 'text-txt-primary font-semibold' : 'text-txt-muted'
          }`}
        >
          <Terminal className="w-5 h-5" />
          <span className="text-[10px] font-mono">Terminal</span>
        </button>

        <button
          onClick={() => handleOpenApp('contact')}
          className={`flex flex-col items-center gap-0.5 p-1 rounded-lg ${
            currentAppId === 'contact' ? 'text-txt-primary font-semibold' : 'text-txt-muted'
          }`}
        >
          <Send className="w-5 h-5" />
          <span className="text-[10px] font-mono">Contact</span>
        </button>
      </div>
    </div>
  );
};
