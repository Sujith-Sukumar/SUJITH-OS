import React, { useRef } from 'react';
import { useWindowStore, APP_REGISTRY } from '../../store/windowStore';
import { DesktopIcon } from './DesktopIcon';
import { Wallpaper } from './Wallpaper';
import { ContextMenu } from './ContextMenu';
import { WindowManager } from '../window/WindowManager';
import { Taskbar } from '../taskbar/Taskbar';
import { MobileLayout } from '../mobile/MobileLayout';
import { useKeyboardShortcuts } from '../../hooks/useKeyboardShortcuts';

export const Desktop: React.FC = () => {
  const { setSelectedDesktopIcon, openContextMenu, closeContextMenu } = useWindowStore();
  const desktopRef = useRef<HTMLDivElement | null>(null);

  // Activate keyboard shortcuts (Ctrl+K, Ctrl+Shift+T, Alt+Tab, Enter, Esc)
  useKeyboardShortcuts();

  const handleDesktopClick = (e: React.MouseEvent) => {
    // Only clear selection if clicking directly on the desktop background
    if (e.target === desktopRef.current || (e.target as HTMLElement).tagName === 'CANVAS') {
      setSelectedDesktopIcon(null);
      closeContextMenu();
    }
  };

  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    openContextMenu(e.clientX, e.clientY);
  };

  const desktopApps = Object.values(APP_REGISTRY).filter((app) => app.isDesktopShortcut);

  return (
    <div
      ref={desktopRef}
      onClick={handleDesktopClick}
      onContextMenu={handleContextMenu}
      className="relative w-screen h-screen overflow-hidden bg-[var(--os-bg-base)] text-[var(--os-text-primary)] font-sans select-none transition-colors duration-200"
    >
      {/* Dynamic Animated Abstract Wallpaper */}
      <Wallpaper />

      {/* Desktop Icons Container (Desktop & Tablet view) */}
      <div className="relative z-10 p-6 flex flex-col flex-wrap gap-2.5 h-[calc(100vh-56px)] w-fit pointer-events-auto hidden md:flex">
        {desktopApps.map((app, index) => (
          <DesktopIcon key={app.id} app={app} index={index} />
        ))}
      </div>

      {/* Window Stacking Manager (Draggable Windows) */}
      <div className="hidden md:block">
        <WindowManager />
      </div>

      {/* Bottom Taskbar */}
      <div className="hidden md:block">
        <Taskbar />
      </div>

      {/* Dedicated Mobile OS Interface */}
      <MobileLayout />

      {/* Right Click Desktop Context Menu */}
      <ContextMenu />
    </div>
  );
};
