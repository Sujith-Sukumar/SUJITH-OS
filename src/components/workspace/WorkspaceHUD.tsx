import React, { useState } from 'react';
import { Volume2, VolumeX, Lightbulb, Compass, Terminal, Bug, ArrowUpRight } from 'lucide-react';
import { useWorkspaceStore } from '../../store/workspaceStore';
import { workspaceSound } from '../../utils/workspaceAudio';

export const WorkspaceHUD: React.FC = () => {
  const {
    activeRoom,
    cameraMode,
    hoveredTarget,
    deskLampOn,
    soundEnabled,
    toggleSound,
  } = useWorkspaceStore();

  const [isAudioMuted, setIsAudioMuted] = useState(!soundEnabled);

  const handleToggleSound = () => {
    const nextMuted = !isAudioMuted;
    setIsAudioMuted(nextMuted);
    workspaceSound.setMuted(nextMuted);
    toggleSound();
    if (!nextMuted) {
      workspaceSound.playHover();
    }
  };

  if (activeRoom !== 'workspace' || cameraMode === 'inside_work') {
    return null;
  }

  let secondaryHint: string | null = null;
  let HintIcon = Compass;

  if (hoveredTarget === 'door_work') {
    secondaryHint = 'Click portal to enter Nexus chambers';
    HintIcon = ArrowUpRight;
  } else if (hoveredTarget === 'desk_lamp') {
    secondaryHint = `Click to switch studio lamp ${deskLampOn ? 'off' : 'on'}`;
    HintIcon = Lightbulb;
  } else if (hoveredTarget === 'laptop') {
    secondaryHint = 'Click terminal to trigger live production build';
    HintIcon = Terminal;
  } else if (hoveredTarget === 'bug') {
    secondaryHint = 'Click roaming beetle to patch bug';
    HintIcon = Bug;
  } else if (hoveredTarget === 'plant') {
    secondaryHint = 'Monstera deliciosa · Studio flora';
    HintIcon = Compass;
  }

  return (
    <div className="absolute inset-0 pointer-events-none z-20 flex flex-col justify-between p-6 sm:p-10 select-none">
      {/* Top Architectural Header */}
      <div className="flex items-start justify-between">
        <div className="flex flex-col gap-1 pointer-events-auto">
          <div className="flex items-center gap-2.5">
            <span className="w-2 h-2 rounded-full bg-amber-400 shadow-[0_0_10px_#f59e0b]" />
            <span className="text-xs font-semibold tracking-[0.22em] font-mono text-zinc-100">
              SUJITH K // DIGITAL WORKSPACE
            </span>
          </div>
          <div className="text-[10px] font-mono tracking-[0.2em] text-zinc-500 pl-4.5">
            CHAMBER 00 · ARCHITECTURAL STUDIO
          </div>
        </div>

        {/* Sound Control */}
        <div className="flex items-center gap-2 pointer-events-auto">
          <button
            onClick={handleToggleSound}
            title={isAudioMuted ? 'Unmute Sound Effects' : 'Mute Sound Effects'}
            aria-label={isAudioMuted ? 'Unmute Sound Effects' : 'Mute Sound Effects'}
            className="p-2.5 rounded-full bg-white/[0.03] hover:bg-white/[0.08] border border-white/10 text-zinc-300 hover:text-white backdrop-blur-md transition-colors cursor-pointer"
          >
            {isAudioMuted ? (
              <VolumeX className="w-3.5 h-3.5 text-zinc-500" />
            ) : (
              <Volume2 className="w-3.5 h-3.5 text-amber-400" />
            )}
          </button>
        </div>
      </div>

      {/* Bottom Whisper Cue */}
      <div className="flex items-end justify-between text-[10px] font-mono tracking-[0.2em] text-zinc-500 uppercase">
        <div>
          {secondaryHint ? (
            <div className="flex items-center gap-2 text-amber-300/90 transition-opacity duration-200">
              <HintIcon className="w-3.5 h-3.5 shrink-0 text-amber-400" />
              <span>{secondaryHint}</span>
            </div>
          ) : (
            <span>STEP THROUGH PORTAL 01 OR EXPLORE WORKSTATION</span>
          )}
        </div>

        <div className="hidden sm:block text-zinc-600">
          FULL STACK DEVELOPER · KERALA, IN
        </div>
      </div>
    </div>
  );
};
