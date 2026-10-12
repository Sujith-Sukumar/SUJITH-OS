import { create } from 'zustand';
import { AppId, WindowInstance, AppDefinition } from '../types/os';
import { playSystemSound } from '../utils/sound';

export const APP_REGISTRY: Record<AppId, AppDefinition> = {
  about: {
    id: 'about',
    title: 'About Me — Sujith K',
    iconName: 'User',
    description: 'Developer biography, background, core stack & engineering philosophy',
    defaultSize: { width: 780, height: 560 },
    defaultPosition: { x: 90, y: 50 },
    isDesktopShortcut: true,
    dockShortcut: true,
  },
  experience: {
    id: 'experience',
    title: 'System Experience Timeline',
    iconName: 'Briefcase',
    description: 'Career progression log, production roles & engineering milestones',
    defaultSize: { width: 820, height: 580 },
    defaultPosition: { x: 130, y: 70 },
    isDesktopShortcut: true,
    dockShortcut: true,
  },
  projects: {
    id: 'projects',
    title: 'Project Explorer',
    iconName: 'FolderKanban',
    description: 'Interactive file explorer showcasing full-stack platforms & architecture',
    defaultSize: { width: 880, height: 600 },
    defaultPosition: { x: 170, y: 90 },
    isDesktopShortcut: true,
    dockShortcut: true,
  },
  'project-detail': {
    id: 'project-detail',
    title: 'Project Specification',
    iconName: 'Code2',
    description: 'In-depth architecture, code breakdown, contributions & live links',
    defaultSize: { width: 860, height: 620 },
    defaultPosition: { x: 200, y: 100 },
    isDesktopShortcut: false,
    dockShortcut: false,
  },
  skills: {
    id: 'skills',
    title: 'System Diagnostics & Telemetry',
    iconName: 'Cpu',
    description: 'Real-time capability metrics, technology stack & diagnostic gauges',
    defaultSize: { width: 820, height: 560 },
    defaultPosition: { x: 220, y: 80 },
    isDesktopShortcut: true,
    dockShortcut: true,
  },
  terminal: {
    id: 'terminal',
    title: 'sujith@portfolio:~$',
    iconName: 'Terminal',
    description: 'Interactive Unix-like shell with portfolio CLI commands & utilities',
    defaultSize: { width: 750, height: 490 },
    defaultPosition: { x: 240, y: 120 },
    isDesktopShortcut: true,
    dockShortcut: true,
  },
  resume: {
    id: 'resume',
    title: 'Curriculum Vitae — Document Viewer',
    iconName: 'FileText',
    description: 'Verified CV document preview and download access',
    defaultSize: { width: 780, height: 620 },
    defaultPosition: { x: 160, y: 60 },
    isDesktopShortcut: true,
    dockShortcut: true,
  },
  contact: {
    id: 'contact',
    title: 'Comms Dispatcher // Contact',
    iconName: 'Send',
    description: 'Direct communication portal, encrypted message dispatcher & social coordinates',
    defaultSize: { width: 700, height: 550 },
    defaultPosition: { x: 260, y: 110 },
    isDesktopShortcut: true,
    dockShortcut: true,
  },
  settings: {
    id: 'settings',
    title: 'System Preferences',
    iconName: 'Settings',
    description: 'Appearance themes, accent colors, wallpapers and animation toggles',
    defaultSize: { width: 680, height: 500 },
    defaultPosition: { x: 300, y: 140 },
    isDesktopShortcut: true,
    dockShortcut: false,
  },
};

interface WindowStoreState {
  windows: WindowInstance[];
  activeWindowId: string | null;
  highestZIndex: number;
  selectedDesktopIcon: string | null;
  isStartMenuOpen: boolean;
  contextMenu: { isOpen: boolean; x: number; y: number } | null;
  isBooted: boolean;

  // Actions
  setBooted: (val: boolean) => void;
  openWindow: (appId: AppId, options?: { title?: string; data?: any }) => void;
  closeWindow: (id: string) => void;
  minimizeWindow: (id: string) => void;
  maximizeWindow: (id: string) => void;
  restoreWindow: (id: string) => void;
  focusWindow: (id: string) => void;
  toggleWindow: (id: string) => void;
  updatePosition: (id: string, position: { x: number; y: number }) => void;
  updateSize: (id: string, size: { width: number; height: number }) => void;
  setSelectedDesktopIcon: (id: string | null) => void;
  toggleStartMenu: () => void;
  setStartMenuOpen: (open: boolean) => void;
  openContextMenu: (x: number, y: number) => void;
  closeContextMenu: () => void;
  bringNextToFront: () => void;
}

export const useWindowStore = create<WindowStoreState>((set, get) => ({
  windows: [],
  activeWindowId: null,
  highestZIndex: 10,
  selectedDesktopIcon: null,
  isStartMenuOpen: false,
  contextMenu: null,
  isBooted: false,

  setBooted: (val) => set({ isBooted: val }),

  openWindow: (appId, options) => {
    const { windows, highestZIndex } = get();
    const appDef = APP_REGISTRY[appId];
    if (!appDef) return;

    // For single-instance apps (except project-detail which might open different projects)
    const existingWindow = windows.find((w) => {
      if (appId === 'project-detail' && options?.data?.id) {
        return w.appId === 'project-detail' && w.data?.id === options.data.id;
      }
      return w.appId === appId;
    });

    if (existingWindow) {
      if (existingWindow.isMinimized) {
        get().restoreWindow(existingWindow.id);
      }
      get().focusWindow(existingWindow.id);
      playSystemSound('open');
      return;
    }

    const newZIndex = highestZIndex + 1;
    const windowId = `${appId}-${Date.now()}`;

    // Responsive screen-aware offset
    const screenWidth = typeof window !== 'undefined' ? window.innerWidth : 1200;
    const screenHeight = typeof window !== 'undefined' ? window.innerHeight : 800;

    let targetWidth = Math.min(appDef.defaultSize.width, screenWidth - 32);
    let targetHeight = Math.min(appDef.defaultSize.height, screenHeight - 100);

    // Stagger cascaded windows
    const count = windows.filter(w => w.isOpen).length;
    const cascadeOffset = (count % 6) * 24;
    const targetX = Math.max(16, Math.min(appDef.defaultPosition.x + cascadeOffset, screenWidth - targetWidth - 20));
    const targetY = Math.max(16, Math.min(appDef.defaultPosition.y + cascadeOffset, screenHeight - targetHeight - 70));

    const newWindow: WindowInstance = {
      id: windowId,
      appId,
      title: options?.title || (options?.data?.title ? `${options.data.title} — Specs` : appDef.title),
      isOpen: true,
      isMinimized: false,
      isMaximized: screenWidth < 768, // Auto-maximize on small screens
      zIndex: newZIndex,
      position: { x: targetX, y: targetY },
      size: { width: targetWidth, height: targetHeight },
      data: options?.data,
    };

    set({
      windows: [...windows, newWindow],
      activeWindowId: windowId,
      highestZIndex: newZIndex,
      isStartMenuOpen: false,
      contextMenu: null,
    });

    playSystemSound('open');
  },

  closeWindow: (id) => {
    const { windows } = get();
    const target = windows.find((w) => w.id === id);
    if (!target) return;

    const remaining = windows.filter((w) => w.id !== id);
    // Find next top window to focus
    const nextActive = remaining
      .filter((w) => !w.isMinimized)
      .sort((a, b) => b.zIndex - a.zIndex)[0];

    set({
      windows: remaining,
      activeWindowId: nextActive ? nextActive.id : null,
    });

    playSystemSound('close');
  },

  minimizeWindow: (id) => {
    const { windows } = get();
    const remaining = windows.map((w) => (w.id === id ? { ...w, isMinimized: true } : w));
    const nextActive = remaining
      .filter((w) => !w.isMinimized)
      .sort((a, b) => b.zIndex - a.zIndex)[0];

    set({
      windows: remaining,
      activeWindowId: nextActive ? nextActive.id : null,
    });

    playSystemSound('minimize');
  },

  maximizeWindow: (id) => {
    set((state) => ({
      windows: state.windows.map((w) =>
        w.id === id ? { ...w, isMaximized: !w.isMaximized } : w
      ),
    }));
    get().focusWindow(id);
    playSystemSound('click');
  },

  restoreWindow: (id) => {
    const { highestZIndex } = get();
    const newZIndex = highestZIndex + 1;
    set((state) => ({
      windows: state.windows.map((w) =>
        w.id === id ? { ...w, isMinimized: false, zIndex: newZIndex } : w
      ),
      activeWindowId: id,
      highestZIndex: newZIndex,
    }));
    playSystemSound('click');
  },

  focusWindow: (id) => {
    const { activeWindowId, highestZIndex } = get();
    if (activeWindowId === id) return;

    const newZIndex = highestZIndex + 1;
    set((state) => ({
      windows: state.windows.map((w) =>
        w.id === id ? { ...w, zIndex: newZIndex, isMinimized: false } : w
      ),
      activeWindowId: id,
      highestZIndex: newZIndex,
      isStartMenuOpen: false,
      contextMenu: null,
    }));
  },

  toggleWindow: (id) => {
    const { activeWindowId, windows } = get();
    const win = windows.find((w) => w.id === id);
    if (!win) return;

    if (win.isMinimized) {
      get().restoreWindow(id);
    } else if (activeWindowId === id) {
      get().minimizeWindow(id);
    } else {
      get().focusWindow(id);
    }
  },

  updatePosition: (id, position) => {
    set((state) => ({
      windows: state.windows.map((w) => (w.id === id ? { ...w, position } : w)),
    }));
  },

  updateSize: (id, size) => {
    set((state) => ({
      windows: state.windows.map((w) => (w.id === id ? { ...w, size } : w)),
    }));
  },

  setSelectedDesktopIcon: (id) => {
    set({ selectedDesktopIcon: id });
  },

  toggleStartMenu: () => {
    set((state) => ({
      isStartMenuOpen: !state.isStartMenuOpen,
      contextMenu: null,
    }));
    playSystemSound('click');
  },

  setStartMenuOpen: (open) => set({ isStartMenuOpen: open }),

  openContextMenu: (x, y) => {
    // Keep context menu on screen
    const screenWidth = typeof window !== 'undefined' ? window.innerWidth : 1200;
    const screenHeight = typeof window !== 'undefined' ? window.innerHeight : 800;
    const boundedX = Math.min(x, screenWidth - 220);
    const boundedY = Math.min(y, screenHeight - 260);

    set({
      contextMenu: { isOpen: true, x: boundedX, y: boundedY },
      isStartMenuOpen: false,
    });
  },

  closeContextMenu: () => set({ contextMenu: null }),

  bringNextToFront: () => {
    const { windows } = get();
    const openWins = windows.filter((w) => !w.isMinimized);
    if (openWins.length <= 1) return;
    const sorted = [...openWins].sort((a, b) => a.zIndex - b.zIndex);
    const oldest = sorted[0];
    get().focusWindow(oldest.id);
  },
}));
