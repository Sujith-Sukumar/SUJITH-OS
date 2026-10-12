import React, { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  RotateCcw,
  Terminal,
  FolderKanban,
  User,
  Image as ImageIcon,
  Settings,
  Maximize,
  Volume2,
  VolumeX,
} from 'lucide-react';
import { useWindowStore } from '../../store/windowStore';
import { useSettingsStore } from '../../store/settingsStore';
import { playSystemSound } from '../../utils/sound';

export const ContextMenu: React.FC = () => {
  const { contextMenu, closeContextMenu, openWindow } = useWindowStore();
  const { wallpaper, setWallpaper, soundEnabled, setSoundEnabled } = useSettingsStore();
  const menuRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        closeContextMenu();
      }
    };

    if (contextMenu?.isOpen) {
      window.addEventListener('mousedown', handleOutsideClick);
    }
    return () => window.removeEventListener('mousedown', handleOutsideClick);
  }, [contextMenu, closeContextMenu]);

  if (!contextMenu?.isOpen) return null;

  const cycleWallpaper = () => {
    const wallpapers: ('cyber-mesh' | 'cosmic-grid' | 'aurora' | 'minimalist')[] = [
      'cyber-mesh',
      'cosmic-grid',
      'aurora',
      'minimalist',
    ];
    const currentIndex = wallpapers.indexOf(wallpaper);
    const nextIndex = (currentIndex + 1) % wallpapers.length;
    setWallpaper(wallpapers[nextIndex]);
    playSystemSound('click');
    closeContextMenu();
  };

  const handleRefresh = () => {
    playSystemSound('click');
    closeContextMenu();
  };

  const handleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
    } else {
      document.exitFullscreen().catch(() => {});
    }
    closeContextMenu();
  };

  return (
    <AnimatePresence>
      <motion.div
        ref={menuRef}
        initial={{ opacity: 0, scale: 0.96, y: -2 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96 }}
        transition={{ duration: 0.1 }}
        style={{ left: contextMenu.x, top: contextMenu.y }}
        className="fixed z-50 w-56 rounded-xl bg-surface border border-border p-1.5 shadow-os-elevated text-xs text-txt-primary divide-y divide-border-subtle"
      >
        <div className="py-0.5">
          <button
            onClick={handleRefresh}
            className="w-full flex items-center gap-2.5 px-3 py-1.5 rounded-lg hover:bg-surface-hover text-txt-secondary hover:text-txt-primary transition-colors text-left"
          >
            <RotateCcw className="w-3.5 h-3.5 text-txt-muted" />
            <span>Refresh Desktop</span>
          </button>
        </div>

        <div className="py-0.5">
          <button
            onClick={() => {
              openWindow('terminal');
              closeContextMenu();
            }}
            className="w-full flex items-center gap-2.5 px-3 py-1.5 rounded-lg hover:bg-surface-hover text-txt-secondary hover:text-txt-primary transition-colors text-left"
          >
            <Terminal className="w-3.5 h-3.5 text-txt-muted" />
            <span>Open Terminal</span>
            <span className="ml-auto text-[10px] text-txt-muted font-mono">Ctrl+Shift+T</span>
          </button>
          <button
            onClick={() => {
              openWindow('projects');
              closeContextMenu();
            }}
            className="w-full flex items-center gap-2.5 px-3 py-1.5 rounded-lg hover:bg-surface-hover text-txt-secondary hover:text-txt-primary transition-colors text-left"
          >
            <FolderKanban className="w-3.5 h-3.5 text-txt-muted" />
            <span>Open Projects Explorer</span>
          </button>
          <button
            onClick={() => {
              openWindow('about');
              closeContextMenu();
            }}
            className="w-full flex items-center gap-2.5 px-3 py-1.5 rounded-lg hover:bg-surface-hover text-txt-secondary hover:text-txt-primary transition-colors text-left"
          >
            <User className="w-3.5 h-3.5 text-txt-muted" />
            <span>Open About Me</span>
          </button>
        </div>

        <div className="py-0.5">
          <button
            onClick={cycleWallpaper}
            className="w-full flex items-center gap-2.5 px-3 py-1.5 rounded-lg hover:bg-surface-hover text-txt-secondary hover:text-txt-primary transition-colors text-left"
          >
            <ImageIcon className="w-3.5 h-3.5 text-txt-muted" />
            <span>Cycle Wallpaper</span>
            <span className="ml-auto text-[10px] text-txt-muted uppercase font-mono">{wallpaper.split('-')[0]}</span>
          </button>
          <button
            onClick={() => {
              setSoundEnabled(!soundEnabled);
              closeContextMenu();
            }}
            className="w-full flex items-center gap-2.5 px-3 py-1.5 rounded-lg hover:bg-surface-hover text-txt-secondary hover:text-txt-primary transition-colors text-left"
          >
            {soundEnabled ? (
              <Volume2 className="w-3.5 h-3.5 text-txt-secondary" />
            ) : (
              <VolumeX className="w-3.5 h-3.5 text-txt-muted" />
            )}
            <span>System Audio</span>
            <span className="ml-auto text-[10px] text-txt-muted font-mono">{soundEnabled ? 'ON' : 'OFF'}</span>
          </button>
          <button
            onClick={handleFullscreen}
            className="w-full flex items-center gap-2.5 px-3 py-1.5 rounded-lg hover:bg-surface-hover text-txt-secondary hover:text-txt-primary transition-colors text-left"
          >
            <Maximize className="w-3.5 h-3.5 text-txt-muted" />
            <span>Toggle Fullscreen</span>
          </button>
        </div>

        <div className="py-0.5">
          <button
            onClick={() => {
              openWindow('settings');
              closeContextMenu();
            }}
            className="w-full flex items-center gap-2.5 px-3 py-1.5 rounded-lg hover:bg-surface-hover text-txt-secondary hover:text-txt-primary transition-colors text-left"
          >
            <Settings className="w-3.5 h-3.5 text-txt-muted" />
            <span>System Settings...</span>
          </button>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};
