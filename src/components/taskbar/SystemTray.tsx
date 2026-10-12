import React from 'react';
import { Wifi, BatteryMedium, Volume2, VolumeX, Settings, Sparkles } from 'lucide-react';
import { ClockWidget } from './ClockWidget';
import { useSettingsStore } from '../../store/settingsStore';
import { useWindowStore } from '../../store/windowStore';
import { playSystemSound } from '../../utils/sound';

export const SystemTray: React.FC = () => {
  const { soundEnabled, setSoundEnabled } = useSettingsStore();
  const { openWindow } = useWindowStore();

  const handleAudioToggle = () => {
    setSoundEnabled(!soundEnabled);
    playSystemSound('click');
  };

  return (
    <div className="flex items-center gap-1.5 sm:gap-2.5 h-full pl-2">
      {/* Quick audio toggle */}
      <button
        onClick={handleAudioToggle}
        className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-[var(--os-surface-hover)] text-[var(--os-text-secondary)] hover:text-[var(--os-text-primary)] transition-colors"
        title={`Audio: ${soundEnabled ? 'Enabled' : 'Muted'}`}
      >
        {soundEnabled ? (
          <Volume2 className="w-4 h-4 text-cyan-500 dark:text-cyan-400" />
        ) : (
          <VolumeX className="w-4 h-4 text-[var(--os-text-muted)]" />
        )}
      </button>

      {/* Network status */}
      <div
        className="w-8 h-8 rounded-lg flex items-center justify-center text-emerald-500 dark:text-emerald-400 hover:bg-[var(--os-surface-hover)] transition-colors hidden sm:flex cursor-default"
        title="Network: 1.0 Gbps / Online"
      >
        <Wifi className="w-4 h-4" />
      </div>

      {/* Battery indicator */}
      <div
        className="items-center gap-1 text-[11px] font-mono text-[var(--os-text-secondary)] hidden md:flex cursor-default px-1"
        title="Battery: AC Connected (100%)"
      >
        <BatteryMedium className="w-4 h-4 text-cyan-500 dark:text-cyan-400" />
        <span>100%</span>
      </div>

      {/* Settings Quick Launch */}
      <button
        onClick={() => openWindow('settings')}
        className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-[var(--os-surface-hover)] text-[var(--os-text-secondary)] hover:text-[var(--os-text-primary)] transition-colors"
        title="System Settings"
      >
        <Settings className="w-4 h-4" />
      </button>

      <div className="w-px h-6 bg-[var(--os-border)] mx-0.5" />

      {/* Clock & Date Widget */}
      <ClockWidget />
    </div>
  );
};
