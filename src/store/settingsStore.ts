import { create } from 'zustand';
import { AccentColor, AppearanceTheme, AnimationMode, WallpaperId } from '../types/os';

interface SettingsState {
  appearance: AppearanceTheme;
  accent: AccentColor;
  animations: AnimationMode;
  wallpaper: WallpaperId;
  soundEnabled: boolean;
  setAppearance: (appearance: AppearanceTheme) => void;
  setAccent: (accent: AccentColor) => void;
  setAnimations: (mode: AnimationMode) => void;
  setWallpaper: (wallpaper: WallpaperId) => void;
  setSoundEnabled: (enabled: boolean) => void;
}

const STORAGE_KEY = 'sujith_os_settings_v3';

const VALID_ACCENTS: AccentColor[] = ['blue', 'purple', 'green', 'orange'];

const getInitialSettings = () => {
  if (typeof window === 'undefined') {
    return {
      appearance: 'dark' as AppearanceTheme,
      accent: 'blue' as AccentColor,
      animations: 'full' as AnimationMode,
      wallpaper: 'cyber-mesh' as WallpaperId,
      soundEnabled: true,
    };
  }

  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (!VALID_ACCENTS.includes(parsed.accent)) {
        parsed.accent = 'blue';
      }
      return parsed;
    }
  } catch (e) {
    console.error('Failed to load settings from storage', e);
  }

  return {
    appearance: 'dark' as AppearanceTheme,
    accent: 'blue' as AccentColor,
    animations: 'full' as AnimationMode,
    wallpaper: 'cyber-mesh' as WallpaperId,
    soundEnabled: true,
  };
};

const applyThemeToDOM = (appearance: AppearanceTheme, accent: AccentColor) => {
  if (typeof document === 'undefined') return;
  const root = document.documentElement;
  root.setAttribute('data-accent', accent);
  root.setAttribute('data-theme', appearance);

  if (appearance === 'dark') {
    root.classList.add('dark');
    root.classList.remove('light');
  } else {
    root.classList.remove('dark');
    root.classList.add('light');
  }
};

export const useSettingsStore = create<SettingsState>((set) => {
  const initial = getInitialSettings();

  // Apply initial accent and theme to document root
  applyThemeToDOM(initial.appearance, initial.accent);

  const saveToStorage = (newState: Partial<SettingsState>) => {
    try {
      const current = getInitialSettings();
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ ...current, ...newState }));
    } catch (e) {
      console.error('Failed to save settings', e);
    }
  };

  return {
    ...initial,
    setAppearance: (appearance) => {
      set({ appearance });
      saveToStorage({ appearance });
      const currentAccent = useSettingsStore.getState().accent;
      applyThemeToDOM(appearance, currentAccent);
    },
    setAccent: (accent) => {
      set({ accent });
      saveToStorage({ accent });
      const currentAppearance = useSettingsStore.getState().appearance;
      applyThemeToDOM(currentAppearance, accent);
    },
    setAnimations: (animations) => {
      set({ animations });
      saveToStorage({ animations });
    },
    setWallpaper: (wallpaper) => {
      set({ wallpaper });
      saveToStorage({ wallpaper });
    },
    setSoundEnabled: (soundEnabled) => {
      set({ soundEnabled });
      saveToStorage({ soundEnabled });
    },
  };
});
