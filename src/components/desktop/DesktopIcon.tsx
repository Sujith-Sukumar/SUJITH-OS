import React, { useRef } from 'react';
import { motion } from 'framer-motion';
import { AppDefinition } from '../../types/os';
import { useWindowStore } from '../../store/windowStore';
import { getAppIcon } from '../../utils/icons';
import { playSystemSound } from '../../utils/sound';

interface DesktopIconProps {
  app: AppDefinition;
  index: number;
}

export const DesktopIcon: React.FC<DesktopIconProps> = ({ app, index }) => {
  const { openWindow, selectedDesktopIcon, setSelectedDesktopIcon } = useWindowStore();
  const isSelected = selectedDesktopIcon === app.id;
  const clickTimeoutRef = useRef<number | null>(null);

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();

    if (clickTimeoutRef.current) {
      clearTimeout(clickTimeoutRef.current);
      clickTimeoutRef.current = null;
      handleOpen();
    } else {
      setSelectedDesktopIcon(app.id);
      playSystemSound('click');
      clickTimeoutRef.current = window.setTimeout(() => {
        clickTimeoutRef.current = null;
      }, 300);
    }
  };

  const handleDoubleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (clickTimeoutRef.current) {
      clearTimeout(clickTimeoutRef.current);
      clickTimeoutRef.current = null;
    }
    handleOpen();
  };

  const handleOpen = () => {
    openWindow(app.id);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleOpen();
    }
  };

  return (
    <motion.button
      type="button"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, delay: index * 0.03 }}
      whileHover={{ y: -2 }}
      whileTap={{ scale: 0.97 }}
      onClick={handleClick}
      onDoubleClick={handleDoubleClick}
      onKeyDown={handleKeyDown}
      tabIndex={0}
      title={app.description}
      aria-label={`Open ${app.title}`}
      className={`group relative flex flex-col items-center justify-center p-2.5 rounded-xl transition-all duration-150 outline-none w-24 select-none ${
        isSelected
          ? 'bg-accent-subtle ring-1 ring-accent'
          : 'hover:bg-surface-hover active:bg-surface-active'
      }`}
    >
      {/* Icon Tile - Monochromatic & Neutral */}
      <div
        className={`relative flex items-center justify-center w-12 h-12 rounded-xl transition-all duration-150 ${
          isSelected
            ? 'bg-surface border border-accent shadow-md text-accent-text'
            : 'bg-surface border border-border shadow-sm text-txt-secondary group-hover:text-txt-primary group-hover:border-border-hover'
        }`}
      >
        {getAppIcon(app.id, { className: 'w-5 h-5 stroke-[1.75]' })}

        {/* Selected dot indicator */}
        {isSelected && (
          <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-accent ring-2 ring-surface shadow-sm" />
        )}
      </div>

      {/* Label - High Contrast Neutral */}
      <span
        className={`mt-2 text-xs font-medium tracking-tight text-center truncate max-w-[86px] px-1.5 py-0.5 rounded transition-colors ${
          isSelected
            ? 'text-accent-text font-semibold'
            : 'text-txt-primary group-hover:text-txt-primary'
        }`}
      >
        {app.id === 'about'
          ? 'About Me'
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
          : app.id === 'settings'
          ? 'Settings'
          : app.title}
      </span>
    </motion.button>
  );
};
