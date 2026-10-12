import { useEffect } from 'react';
import { useWindowStore } from '../store/windowStore';
import { AppId } from '../types/os';

export const useKeyboardShortcuts = () => {
  const {
    openWindow,
    selectedDesktopIcon,
    setSelectedDesktopIcon,
    isStartMenuOpen,
    setStartMenuOpen,
    contextMenu,
    closeContextMenu,
    activeWindowId,
    closeWindow,
    bringNextToFront,
    isBooted
  } = useWindowStore();

  useEffect(() => {
    if (!isBooted) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore if user is typing inside an input or textarea (unless it's a global combo like Ctrl+K or Esc)
      const target = e.target as HTMLElement;
      const isInput = target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable;

      // Esc closes menus and context menu
      if (e.key === 'Escape') {
        if (contextMenu) {
          closeContextMenu();
          return;
        }
        if (isStartMenuOpen) {
          setStartMenuOpen(false);
          return;
        }
        if (selectedDesktopIcon) {
          setSelectedDesktopIcon(null);
          return;
        }
      }

      // Ctrl + K -> Open Start Menu / Search
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setStartMenuOpen(!isStartMenuOpen);
        return;
      }

      // Ctrl + Shift + T -> Open Terminal
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key.toLowerCase() === 't') {
        e.preventDefault();
        openWindow('terminal');
        return;
      }

      // Alt + Tab -> Cycle windows
      if (e.altKey && e.key === 'Tab') {
        e.preventDefault();
        bringNextToFront();
        return;
      }

      // Enter to open selected icon
      if (e.key === 'Enter' && selectedDesktopIcon && !isInput) {
        e.preventDefault();
        openWindow(selectedDesktopIcon as AppId);
        return;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [
    isBooted,
    isStartMenuOpen,
    contextMenu,
    selectedDesktopIcon,
    activeWindowId,
    openWindow,
    closeContextMenu,
    setStartMenuOpen,
    setSelectedDesktopIcon,
    closeWindow,
    bringNextToFront
  ]);
};
