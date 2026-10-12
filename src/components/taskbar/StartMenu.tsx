import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useWindowStore, APP_REGISTRY } from '../../store/windowStore';
import { portfolioConfig } from '../../data/portfolioData';
import { AppId } from '../../types/os';
import { getAppIcon } from '../../utils/icons';
import {
  Search,
  RotateCcw,
  ChevronRight,
} from 'lucide-react';
import { playSystemSound } from '../../utils/sound';

export const StartMenu: React.FC = () => {
  const { isStartMenuOpen, setStartMenuOpen, openWindow, setBooted } = useWindowStore();
  const [searchQuery, setSearchQuery] = useState<string>('');
  const menuRef = useRef<HTMLDivElement | null>(null);
  const searchInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (isStartMenuOpen) {
      setTimeout(() => {
        searchInputRef.current?.focus();
      }, 100);
    } else {
      setSearchQuery('');
    }
  }, [isStartMenuOpen]);

  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        const target = e.target as HTMLElement;
        if (!target.closest('#start-menu-button')) {
          setStartMenuOpen(false);
        }
      }
    };

    if (isStartMenuOpen) {
      window.addEventListener('mousedown', handleOutsideClick);
    }
    return () => window.removeEventListener('mousedown', handleOutsideClick);
  }, [isStartMenuOpen, setStartMenuOpen]);

  if (!isStartMenuOpen) return null;

  const appList = Object.values(APP_REGISTRY).filter((a) => a.id !== 'project-detail');

  const filteredApps = appList.filter((app) =>
    app.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    app.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    app.id.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleLaunch = (appId: AppId) => {
    openWindow(appId);
    setStartMenuOpen(false);
  };

  const handleRestart = () => {
    playSystemSound('click');
    setStartMenuOpen(false);
    sessionStorage.removeItem('sujith_os_session_entered');
    setBooted(false);
  };

  return (
    <AnimatePresence>
      <motion.div
        ref={menuRef}
        initial={{ opacity: 0, y: 10, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 10, scale: 0.97 }}
        transition={{ duration: 0.15, ease: 'easeOut' }}
        className="fixed bottom-14 left-4 z-50 w-80 sm:w-96 rounded-xl bg-surface border border-border shadow-os-elevated overflow-hidden flex flex-col select-none text-txt-primary"
      >
        {/* Top Header Banner — Understated Raycast Style */}
        <div className="p-3.5 bg-surface-secondary border-b border-border flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-surface border border-border flex items-center justify-center font-mono font-bold text-txt-primary text-xs">
              SO
            </div>
            <div>
              <div className="font-semibold text-xs tracking-tight text-txt-primary">SUJITH OS</div>
              <div className="text-[10px] font-mono text-txt-muted">v2.0 &bull; Workstation</div>
            </div>
          </div>

          <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-surface border border-border text-txt-secondary">
            READY
          </span>
        </div>

        {/* Search Field */}
        <div className="p-2.5 border-b border-border-subtle bg-surface">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-txt-muted" />
            <input
              ref={searchInputRef}
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search applications..."
              className="w-full pl-9 pr-3.5 py-1.5 rounded-lg bg-surface-secondary border border-border text-xs text-txt-primary placeholder:text-txt-muted focus:outline-none focus:border-border-hover focus:ring-1 focus:ring-accent transition-all"
            />
          </div>
        </div>

        {/* Applications List */}
        <div className="p-1.5 overflow-y-auto max-h-72 space-y-0.5 bg-surface">
          <div className="text-[10px] font-mono uppercase text-txt-muted tracking-wider px-2.5 py-1">
            APPLICATIONS ({filteredApps.length})
          </div>

          {filteredApps.length === 0 ? (
            <div className="p-4 text-center text-xs text-txt-muted">
              No matching applications found.
            </div>
          ) : (
            filteredApps.map((app) => (
              <button
                key={app.id}
                onClick={() => handleLaunch(app.id)}
                className="w-full flex items-center gap-3 p-2 rounded-lg hover:bg-surface-hover active:bg-surface-active transition-colors text-left group"
              >
                <div className="w-8 h-8 rounded-lg bg-surface-secondary border border-border flex items-center justify-center text-txt-secondary group-hover:text-txt-primary group-hover:border-border-hover transition-colors flex-shrink-0">
                  {getAppIcon(app.id, { className: 'w-4 h-4' })}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="font-medium text-xs text-txt-primary transition-colors truncate">
                    {app.title}
                  </div>
                  <div className="text-[11px] text-txt-muted truncate">
                    {app.description}
                  </div>
                </div>
                <ChevronRight className="w-3.5 h-3.5 text-txt-muted group-hover:text-txt-secondary transition-colors flex-shrink-0" />
              </button>
            ))
          )}
        </div>

        {/* Bottom Profile & System Options */}
        <div className="p-2.5 bg-surface-secondary border-t border-border flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-md bg-surface border border-border flex items-center justify-center font-mono text-[10px] font-bold text-txt-primary">
              SK
            </div>
            <div>
              <div className="text-xs font-medium text-txt-primary leading-tight">{portfolioConfig.personal.fullName}</div>
              <div className="text-[10px] text-txt-muted">{portfolioConfig.personal.role}</div>
            </div>
          </div>

          <button
            onClick={handleRestart}
            className="p-1.5 rounded-md hover:bg-surface-hover text-txt-muted hover:text-txt-primary transition-colors"
            title="Re-run Boot Sequence"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};
