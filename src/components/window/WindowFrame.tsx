import React from 'react';
import { motion } from 'framer-motion';
import { Minus, Square, X, Copy } from 'lucide-react';
import { WindowInstance } from '../../types/os';
import { useWindowStore } from '../../store/windowStore';
import { getAppIcon } from '../../utils/icons';

interface WindowFrameProps {
  window: WindowInstance;
  children: React.ReactNode;
}

export const WindowFrame: React.FC<WindowFrameProps> = ({ window: win, children }) => {
  const {
    activeWindowId,
    focusWindow,
    closeWindow,
    minimizeWindow,
    maximizeWindow,
    updatePosition,
  } = useWindowStore();

  const isActive = activeWindowId === win.id;

  if (win.isMinimized) {
    return null;
  }

  const handleHeaderDoubleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    maximizeWindow(win.id);
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.96, y: 12 }}
      animate={
        win.isMaximized
          ? {
              opacity: 1,
              scale: 1,
              x: 0,
              y: 0,
              width: '100%',
              height: 'calc(100% - 48px)', // Reserve bottom taskbar height
              top: 0,
              left: 0,
            }
          : {
              opacity: 1,
              scale: 1,
              x: win.position.x,
              y: win.position.y,
              width: win.size.width,
              height: win.size.height,
              top: 0,
              left: 0,
            }
      }
      exit={{ opacity: 0, scale: 0.95, y: 16 }}
      transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
      drag={!win.isMaximized}
      dragMomentum={false}
      dragElastic={0.04}
      onDragEnd={(_, info) => {
        if (!win.isMaximized) {
          updatePosition(win.id, {
            x: Math.max(0, Math.min(window.innerWidth - 120, win.position.x + info.offset.x)),
            y: Math.max(0, Math.min(window.innerHeight - 120, win.position.y + info.offset.y)),
          });
        }
      }}
      onMouseDown={() => focusWindow(win.id)}
      style={{ zIndex: win.zIndex }}
      className={`fixed flex flex-col rounded-xl overflow-hidden select-none transition-shadow duration-150 ${
        isActive
          ? 'shadow-os-window-active border border-border-hover bg-surface'
          : 'shadow-os-window border border-border bg-surface opacity-95'
      }`}
    >
      {/* Window Title Bar — Understated & Clean */}
      <div
        onDoubleClick={handleHeaderDoubleClick}
        className={`flex items-center justify-between px-3.5 py-2.5 border-b border-border cursor-grab active:cursor-grabbing transition-colors duration-150 ${
          isActive
            ? 'bg-surface-secondary text-txt-primary'
            : 'bg-surface text-txt-muted'
        }`}
      >
        {/* Left: Window Icon + Title */}
        <div className="flex items-center gap-2.5 min-w-0 pr-4">
          <div className="flex items-center justify-center w-4 h-4 text-txt-secondary">
            {getAppIcon(win.appId, { className: 'w-4 h-4' })}
          </div>
          <span className="text-xs font-medium tracking-tight truncate select-none text-txt-primary">
            {win.title}
          </span>
        </div>

        {/* Right: Window Controls */}
        <div className="flex items-center gap-1 flex-shrink-0" onMouseDown={(e) => e.stopPropagation()}>
          {/* Minimize button */}
          <button
            type="button"
            onClick={() => minimizeWindow(win.id)}
            title="Minimize"
            aria-label="Minimize"
            className="w-6 h-6 flex items-center justify-center rounded-md hover:bg-surface-hover active:bg-surface-active text-txt-muted hover:text-txt-primary transition-colors"
          >
            <Minus className="w-3.5 h-3.5" />
          </button>

          {/* Maximize / Restore button */}
          <button
            type="button"
            onClick={() => maximizeWindow(win.id)}
            title={win.isMaximized ? 'Restore' : 'Maximize'}
            aria-label={win.isMaximized ? 'Restore' : 'Maximize'}
            className="w-6 h-6 flex items-center justify-center rounded-md hover:bg-surface-hover active:bg-surface-active text-txt-muted hover:text-txt-primary transition-colors"
          >
            {win.isMaximized ? (
              <Copy className="w-3 h-3 rotate-180" />
            ) : (
              <Square className="w-3 h-3" />
            )}
          </button>

          {/* Close button */}
          <button
            type="button"
            onClick={() => closeWindow(win.id)}
            title="Close"
            aria-label="Close"
            className="w-6 h-6 flex items-center justify-center rounded-md hover:bg-red-500/15 text-txt-muted hover:text-red-500 active:bg-red-500/25 transition-colors"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Window Body Container */}
      <div className="flex-1 overflow-auto bg-surface text-txt-primary relative select-text">
        {children}
      </div>
    </motion.div>
  );
};
