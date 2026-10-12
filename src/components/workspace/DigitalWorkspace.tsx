import React, { useEffect } from 'react';
import { AnimatePresence } from 'framer-motion';
import { WorkspaceCanvas } from './WorkspaceCanvas';
import { WorkspaceArtisticLoader } from './WorkspaceArtisticLoader';
import { WorkspaceHUD } from './WorkspaceHUD';
import NexusRoom from './NexusRoom';
import { AboutRoom } from './rooms/AboutRoom';
import { ProjectsRoom } from './rooms/ProjectsRoom';
import { SkillsRoom } from './rooms/SkillsRoom';
import { ExperienceRoom } from './rooms/ExperienceRoom';
import { ContactRoom } from './rooms/ContactRoom';
import { useWorkspaceStore } from '../../store/workspaceStore';
import { workspaceSound } from '../../utils/workspaceAudio';

export const DigitalWorkspace: React.FC = () => {
  const {
    isLoaded,
    finishLoading,
    activeRoom,
    navigateToRoom,
    setNexusTransitioning,
  } = useWorkspaceStore();

  // Navigate directly once NexusRoom finishes its physical portal opening choreography
  const handleEnterSectionRoom = (
    room: 'about' | 'projects' | 'skills' | 'experience' | 'contact'
  ) => {
    setNexusTransitioning(true);
    navigateToRoom(room);
  };

  // Return from nexus back to the 3D workspace
  const handleReturnFromNexus = () => {
    window.dispatchEvent(new CustomEvent('sujith_return_to_workspace'));
  };

  // Return from a section room back to the nexus
  const handleReturnToNexus = () => {
    workspaceSound.playReturn();
    navigateToRoom('nexus');
  };

  // Keyboard shortcut: ESC to navigate back
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (['about', 'projects', 'skills', 'experience', 'contact'].includes(activeRoom)) {
          handleReturnToNexus();
        } else if (activeRoom === 'nexus') {
          handleReturnFromNexus();
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeRoom]);

  const renderSectionRoom = () => {
    switch (activeRoom) {
      case 'about':
        return <AboutRoom key="about" onReturn={handleReturnToNexus} />;
      case 'projects':
        return <ProjectsRoom key="projects" onReturn={handleReturnToNexus} />;
      case 'skills':
        return <SkillsRoom key="skills" onReturn={handleReturnToNexus} />;
      case 'experience':
        return <ExperienceRoom key="experience" onReturn={handleReturnToNexus} />;
      case 'contact':
        return <ContactRoom key="contact" onReturn={handleReturnToNexus} />;
      default:
        return null;
    }
  };

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-[#07080c] text-zinc-100 select-none">
      {/* 3D Three.js Studio Scene */}
      <WorkspaceCanvas />

      {/* Ambient Studio HUD */}
      {isLoaded && <WorkspaceHUD />}

      {/* Initial Architectural Portal Loader */}
      <AnimatePresence>
        {!isLoaded && <WorkspaceArtisticLoader onComplete={finishLoading} />}
      </AnimatePresence>

      {/* Nexus Hub — Interactive Architectural Portals */}
      <AnimatePresence mode="wait">
        {activeRoom === 'nexus' && (
          <NexusRoom
            key="nexus"
            onEnterRoom={handleEnterSectionRoom}
            onReturn={handleReturnFromNexus}
          />
        )}
      </AnimatePresence>

      {/* Section Chambers */}
      <AnimatePresence mode="wait">{renderSectionRoom()}</AnimatePresence>
    </div>
  );
};

export default DigitalWorkspace;
