import React from 'react';
import { useWindowStore } from '../../store/windowStore';
import { SystemTray } from './SystemTray';
import { StartMenu } from './StartMenu';
import { getAppIcon } from '../../utils/icons';

export const Taskbar: React.FC = () => {
  const {
    windows,
    activeWindowId,
    toggleWindow,
    isStartMenuOpen,
    toggleStartMenu,
  } = useWindowStore();

  const handleStartClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleStartMenu();
  };

  return (
    <>
      <StartMenu />

      <footer className="fixed bottom-0 left-0 right-0 h-12 z-40 px-3 flex items-center justify-between border-t border-border select-none bg-surface text-txt-primary shadow-sm">
        {/* Left: Start Button & Open Windows */}
        <div className="flex items-center gap-2 h-full">
          {/* SUJITH OS Start Button — Clean & Neutral */}
          <button
            id="start-menu-button"
            type="button"
            onClick={handleStartClick}
            aria-label="Open SUJITH OS Start Menu"
            className={`flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all duration-150 outline-none ${
              isStartMenuOpen
                ? 'bg-surface-secondary text-txt-primary border border-border-hover'
                : 'hover:bg-surface-hover text-txt-secondary hover:text-txt-primary border border-transparent'
            }`}
          >
            {/* Minimal Monochrome Emblem */}
            <div className="w-5 h-5 rounded-md bg-surface-secondary border border-border flex items-center justify-center font-mono font-bold text-[11px] text-txt-primary">
              S
            </div>
            <span className="font-mono text-xs font-semibold tracking-tight hidden sm:inline text-txt-primary">
              SUJITH OS
            </span>
          </button>

          <div className="w-px h-5 bg-border mx-1 hidden sm:block" />

          {/* Running Windows Task Tabs */}
          <div className="flex items-center gap-1 overflow-x-auto max-w-md md:max-w-xl h-full py-1">
            {windows.map((win) => {
              const isActive = activeWindowId === win.id && !win.isMinimized;

              return (
                <button
                  key={win.id}
                  onClick={() => toggleWindow(win.id)}
                  title={win.title}
                  className={`relative flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all max-w-[160px] truncate ${
                    isActive
                      ? 'bg-surface-secondary text-txt-primary border border-border'
                      : win.isMinimized
                      ? 'text-txt-muted hover:bg-surface-hover border border-transparent opacity-60'
                      : 'text-txt-secondary hover:text-txt-primary hover:bg-surface-hover border border-transparent'
                  }`}
                >
                  <div className="w-3.5 h-3.5 flex-shrink-0 text-txt-secondary">
                    {getAppIcon(win.appId, { className: 'w-3.5 h-3.5' })}
                  </div>
                  <span className="truncate text-xs">
                    {win.title.split('—')[0].trim()}
                  </span>

                  {/* Active Window subtle dot indicator */}
                  {isActive && (
                    <span className="absolute bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-accent" />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Right: System Tray & Clock */}
        <SystemTray />
      </footer>
    </>
  );
};
