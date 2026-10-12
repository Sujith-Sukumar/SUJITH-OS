import React from 'react';
import { useSettingsStore } from '../../store/settingsStore';
import { AccentColor, AppearanceTheme, AnimationMode, WallpaperId } from '../../types/os';
import {
  Palette,
  Sun,
  Moon,
  Sparkles,
  Zap,
  Image as ImageIcon,
  Volume2,
  VolumeX,
  Check,
  Info
} from 'lucide-react';
import { playSystemSound } from '../../utils/sound';

export const SettingsApp: React.FC = () => {
  const {
    appearance,
    accent,
    animations,
    wallpaper,
    soundEnabled,
    setAppearance,
    setAccent,
    setAnimations,
    setWallpaper,
    setSoundEnabled,
  } = useSettingsStore();

  const handleAccentChange = (col: AccentColor) => {
    setAccent(col);
    playSystemSound('click');
  };

  const handleAppearanceChange = (mode: AppearanceTheme) => {
    setAppearance(mode);
    playSystemSound('click');
  };

  const handleAnimationChange = (mode: AnimationMode) => {
    setAnimations(mode);
    playSystemSound('click');
  };

  const handleWallpaperChange = (wall: WallpaperId) => {
    setWallpaper(wall);
    playSystemSound('click');
  };

  const handleSoundToggle = () => {
    setSoundEnabled(!soundEnabled);
    playSystemSound('click');
  };

  return (
    <div className="h-full flex flex-col p-6 overflow-y-auto text-txt-primary bg-surface select-none">
      {/* Header */}
      <div className="pb-4 mb-5 border-b border-border">
        <h1 className="text-lg font-bold tracking-tight text-txt-primary flex items-center gap-2">
          <Palette className="w-4 h-4 text-txt-muted" />
          <span>SYSTEM PREFERENCES</span>
        </h1>
        <p className="text-xs text-txt-muted mt-0.5">
          Configure appearance mode, UI accents, desktop wallpaper, and audio feedback.
        </p>
      </div>

      <div className="space-y-5 max-w-2xl">
        {/* Appearance Mode */}
        <div className="p-4 rounded-lg bg-surface-secondary border border-border">
          <h2 className="text-xs font-mono font-semibold uppercase text-txt-muted tracking-wider mb-2.5">
            APPEARANCE THEME
          </h2>
          <div className="grid grid-cols-2 gap-2.5">
            <button
              onClick={() => handleAppearanceChange('dark')}
              className={`flex items-center justify-between p-3 rounded-lg border text-xs font-medium transition-all ${
                appearance === 'dark'
                  ? 'bg-surface border-border-hover text-txt-primary shadow-sm ring-1 ring-border'
                  : 'bg-surface/50 border-border text-txt-muted hover:text-txt-primary'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Moon className="w-4 h-4 text-txt-muted" />
                <span>Dark Mode</span>
              </div>
              {appearance === 'dark' && <Check className="w-3.5 h-3.5 text-txt-primary" />}
            </button>

            <button
              onClick={() => handleAppearanceChange('light')}
              className={`flex items-center justify-between p-3 rounded-lg border text-xs font-medium transition-all ${
                appearance === 'light'
                  ? 'bg-surface border-border-hover text-txt-primary shadow-sm ring-1 ring-border'
                  : 'bg-surface/50 border-border text-txt-muted hover:text-txt-primary'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Sun className="w-4 h-4 text-txt-muted" />
                <span>Light Mode</span>
              </div>
              {appearance === 'light' && <Check className="w-3.5 h-3.5 text-txt-primary" />}
            </button>
          </div>
        </div>

        {/* Accent Color Selection */}
        <div className="p-4 rounded-lg bg-surface-secondary border border-border">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-xs font-mono font-semibold uppercase text-txt-muted tracking-wider">
              UI ACCENT COLOR
            </h2>
            <span className="text-[10px] font-mono text-txt-muted">SELECTIVE HIGHLIGHTS ONLY</span>
          </div>

          <p className="text-[11px] text-txt-muted mb-3 leading-relaxed">
            The accent is applied selectively to active indicators, selection rings, and primary links. The operating system surfaces and Terminal remain neutral.
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {[
              { id: 'blue', label: 'Blue (Default)', color: '#3B82F6' },
              { id: 'purple', label: 'Purple', color: '#8B5CF6' },
              { id: 'green', label: 'Green', color: '#10B981' },
              { id: 'orange', label: 'Orange', color: '#F97316' },
            ].map((item) => (
              <button
                key={item.id}
                onClick={() => handleAccentChange(item.id as AccentColor)}
                className={`flex items-center gap-2.5 p-2.5 rounded-lg border transition-all text-left ${
                  accent === item.id
                    ? 'bg-surface border-border-hover ring-1 ring-border shadow-sm'
                    : 'bg-surface/50 border-border hover:bg-surface'
                }`}
              >
                <div
                  className="w-3.5 h-3.5 rounded-full flex-shrink-0"
                  style={{ backgroundColor: item.color }}
                />
                <span className="text-xs font-medium text-txt-primary">{item.label}</span>
                {accent === item.id && <Check className="w-3 h-3 text-txt-muted ml-auto" />}
              </button>
            ))}
          </div>
        </div>

        {/* Dynamic Wallpaper Selection */}
        <div className="p-4 rounded-lg bg-surface-secondary border border-border">
          <h2 className="text-xs font-mono font-semibold uppercase text-txt-muted tracking-wider mb-2.5 flex items-center gap-2">
            <ImageIcon className="w-3.5 h-3.5 text-txt-muted" />
            <span>DESKTOP WALLPAPER</span>
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {[
              { id: 'cyber-mesh', label: 'Abstract Mesh', desc: 'Neutral node graph' },
              { id: 'minimalist', label: 'Minimalist', desc: 'Clean micro-grid' },
              { id: 'cosmic-grid', label: 'Technical Grid', desc: 'Perspective grid' },
              { id: 'aurora', label: 'Soft Gradient', desc: 'Ambient radial' },
            ].map((item) => (
              <button
                key={item.id}
                onClick={() => handleWallpaperChange(item.id as WallpaperId)}
                className={`flex flex-col items-start p-2.5 rounded-lg border text-left transition-all ${
                  wallpaper === item.id
                    ? 'bg-surface border-border-hover shadow-sm ring-1 ring-border'
                    : 'bg-surface/50 border-border text-txt-muted hover:text-txt-primary hover:bg-surface'
                }`}
              >
                <span className="font-medium text-xs text-txt-primary">{item.label}</span>
                <span className="text-[10px] text-txt-muted mt-0.5">{item.desc}</span>
                {wallpaper === item.id && (
                  <span className="mt-1.5 text-[9px] font-mono text-txt-secondary font-semibold">ACTIVE</span>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Animation Mode & Audio Feedback */}
        <div className="grid sm:grid-cols-2 gap-3.5">
          <div className="p-4 rounded-lg bg-surface-secondary border border-border">
            <h2 className="text-xs font-mono font-semibold uppercase text-txt-muted tracking-wider mb-2">
              ANIMATIONS
            </h2>
            <div className="space-y-1.5">
              <button
                onClick={() => handleAnimationChange('full')}
                className={`w-full flex items-center justify-between p-2 rounded-md border text-xs transition-colors ${
                  animations === 'full'
                    ? 'bg-surface border-border text-txt-primary shadow-xs'
                    : 'bg-transparent border-transparent text-txt-muted hover:text-txt-primary'
                }`}
              >
                <div className="flex items-center gap-2">
                  <Sparkles className="w-3.5 h-3.5 text-txt-muted" />
                  <span>Fluid Motions</span>
                </div>
                {animations === 'full' && <Check className="w-3.5 h-3.5 text-txt-primary" />}
              </button>

              <button
                onClick={() => handleAnimationChange('reduced')}
                className={`w-full flex items-center justify-between p-2 rounded-md border text-xs transition-colors ${
                  animations === 'reduced'
                    ? 'bg-surface border-border text-txt-primary shadow-xs'
                    : 'bg-transparent border-transparent text-txt-muted hover:text-txt-primary'
                }`}
              >
                <div className="flex items-center gap-2">
                  <Zap className="w-3.5 h-3.5 text-txt-muted" />
                  <span>Reduced Motion</span>
                </div>
                {animations === 'reduced' && <Check className="w-3.5 h-3.5 text-txt-primary" />}
              </button>
            </div>
          </div>

          <div className="p-4 rounded-lg bg-surface-secondary border border-border">
            <h2 className="text-xs font-mono font-semibold uppercase text-txt-muted tracking-wider mb-2">
              SYSTEM AUDIO SYNTHESIS
            </h2>
            <div className="space-y-2 text-xs">
              <button
                onClick={handleSoundToggle}
                className="w-full flex items-center justify-between p-2 rounded-md bg-surface border border-border hover:border-border-hover transition-colors"
              >
                <div className="flex items-center gap-2 text-txt-primary">
                  {soundEnabled ? (
                    <Volume2 className="w-3.5 h-3.5 text-txt-secondary" />
                  ) : (
                    <VolumeX className="w-3.5 h-3.5 text-txt-muted" />
                  )}
                  <span>Tactile Sound</span>
                </div>
                <span className="text-[10px] font-mono text-txt-muted">
                  {soundEnabled ? 'ENABLED' : 'MUTED'}
                </span>
              </button>
              <p className="text-[11px] text-txt-muted leading-relaxed">
                Native Web Audio synthesizer for tactile window operations.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
