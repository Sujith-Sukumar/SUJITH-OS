import { create } from 'zustand';

export type WorkspaceCameraMode = 'overview' | 'zooming_in' | 'inside_work' | 'zooming_out';
export type WorkspaceRoom = 'workspace' | 'nexus' | 'about' | 'projects' | 'skills' | 'experience' | 'contact';

interface WorkspaceState {
  isEntered: boolean;
  isLoaded: boolean;
  activeRoom: WorkspaceRoom;
  previousRoom: WorkspaceRoom | null;
  cameraMode: WorkspaceCameraMode;
  hoveredTarget: string | null;
  doorProximity: number; // 0 (far) to 1 (directly near)
  doorOpenProgress: number; // 0 (closed) to 1 (fully open)
  deskLampOn: boolean;
  soundEnabled: boolean;
  inspectedItem: string | null;
  nexusTransitioning: boolean;

  // Actions
  setEntered: (entered: boolean) => void;
  setLoaded: (loaded: boolean) => void;
  finishLoading: () => void;
  setActiveRoom: (room: WorkspaceRoom) => void;
  navigateToRoom: (room: WorkspaceRoom) => void;
  setCameraMode: (mode: WorkspaceCameraMode) => void;
  setHoveredTarget: (target: string | null) => void;
  setDoorProximity: (val: number) => void;
  setDoorOpenProgress: (val: number) => void;
  toggleDeskLamp: () => void;
  toggleSound: () => void;
  setInspectedItem: (item: string | null) => void;
  setNexusTransitioning: (val: boolean) => void;
  returnToPreviousRoom: () => void;
  resetToOverview: () => void;
}

const checkInitialLoaded = () => {
  try {
    return sessionStorage.getItem('sujith_intro_completed') === 'true';
  } catch {
    return false;
  }
};

export const useWorkspaceStore = create<WorkspaceState>((set, get) => ({
  isEntered: checkInitialLoaded(),
  isLoaded: checkInitialLoaded(),
  activeRoom: 'workspace',
  previousRoom: null,
  cameraMode: 'overview',
  hoveredTarget: null,
  doorProximity: 0,
  doorOpenProgress: 0,
  deskLampOn: true,
  soundEnabled: true,
  inspectedItem: null,
  nexusTransitioning: false,

  setEntered: (entered) => set({ isEntered: entered }),
  setLoaded: (loaded) => set({ isLoaded: loaded }),
  finishLoading: () => {
    try {
      sessionStorage.setItem('sujith_intro_completed', 'true');
    } catch {}
    set({ isLoaded: true, isEntered: true });
  },
  setActiveRoom: (room) => set({ activeRoom: room }),
  navigateToRoom: (room) => {
    const current = get().activeRoom;
    set({ previousRoom: current, activeRoom: room, nexusTransitioning: false });
  },
  setCameraMode: (mode) => set({ cameraMode: mode }),
  setHoveredTarget: (target) => set({ hoveredTarget: target }),
  setDoorProximity: (val) => set({ doorProximity: Math.max(0, Math.min(1, val)) }),
  setDoorOpenProgress: (val) => set({ doorOpenProgress: Math.max(0, Math.min(1, val)) }),
  toggleDeskLamp: () => set((state) => ({ deskLampOn: !state.deskLampOn })),
  toggleSound: () => set((state) => ({ soundEnabled: !state.soundEnabled })),
  setInspectedItem: (item) => set({ inspectedItem: item }),
  setNexusTransitioning: (val) => set({ nexusTransitioning: val }),
  returnToPreviousRoom: () => {
    const prev = get().previousRoom;
    if (prev) {
      set({ activeRoom: prev, previousRoom: null, nexusTransitioning: false });
    } else {
      // Default: go back to nexus, or workspace if already in nexus
      const current = get().activeRoom;
      if (current === 'nexus') {
        // Dispatch event for 3D camera return
        window.dispatchEvent(new CustomEvent('sujith_return_to_workspace'));
      } else {
        set({ activeRoom: 'nexus', previousRoom: null, nexusTransitioning: false });
      }
    }
  },
  resetToOverview: () => set({ activeRoom: 'workspace', previousRoom: null, cameraMode: 'overview', doorOpenProgress: 0, inspectedItem: null, nexusTransitioning: false }),
}));
