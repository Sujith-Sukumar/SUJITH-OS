import React, { useEffect, useRef, useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import gsap from 'gsap';
import { ArrowLeft, ArrowUpRight, User, Code, Cpu, Clock, Radio } from 'lucide-react';
import { workspaceSound } from '../../utils/workspaceAudio';

interface NexusRoomProps {
  onEnterRoom: (room: 'about' | 'projects' | 'skills' | 'experience' | 'contact') => void;
  onReturn: () => void;
}

const DOORS = [
  {
    id: 'about',
    label: 'ABOUT ME',
    sub: 'Architect Identity',
    preview: '4-State 3D Core',
    color: '#f59e0b',
    icon: User,
    num: '01',
  },
  {
    id: 'projects',
    label: 'PROJECTS',
    sub: 'Selected Systems',
    preview: '04 Production Builds',
    color: '#3b82f6',
    icon: Code,
    num: '02',
  },
  {
    id: 'skills',
    label: 'SKILLS',
    sub: 'Technical Matrix',
    preview: '05 Stack Domains',
    color: '#10b981',
    icon: Cpu,
    num: '03',
  },
  {
    id: 'experience',
    label: 'EXPERIENCE',
    sub: 'Engineering Odyssey',
    preview: '02 Career Chapters',
    color: '#8b5cf6',
    icon: Clock,
    num: '04',
  },
  {
    id: 'contact',
    label: 'CONTACT',
    sub: 'Direct Dispatch',
    preview: 'Comms & Resume',
    color: '#f43f5e',
    icon: Radio,
    num: '05',
  },
] as const;

export default function NexusRoom({ onEnterRoom, onReturn }: NexusRoomProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [openingDoorId, setOpeningDoorId] = useState<string | null>(null);

  // Door ordering state: card IDs in current stack order (index 0 is frontmost / active center)
  const [doorOrder, setDoorOrder] = useState<string[]>(() => DOORS.map((d) => d.id));
  const [hoveredCardId, setHoveredCardId] = useState<string | null>(null);

  const [dragState, setDragState] = useState<{
    cardId: string;
    dragX: number;
    dragY: number;
    targetSlot: number;
  } | null>(null);

  const dragRef = useRef<{
    activeCardId: string | null;
    startX: number;
    startY: number;
    currentX: number;
    currentY: number;
    hasMoved: boolean;
    initialIndex: number;
    targetSlot: number;
  }>({
    activeCardId: null,
    startX: 0,
    startY: 0,
    currentX: 0,
    currentY: 0,
    hasMoved: false,
    initialIndex: 0,
    targetSlot: 0,
  });

  const cardsRef = useRef<Map<string, HTMLDivElement>>(new Map());

  const activeFrontId = doorOrder[0];
  const activeFrontDoor = DOORS.find((d) => d.id === activeFrontId) || DOORS[0];

  const bringDoorToFront = useCallback((cardId: string) => {
    setDoorOrder((prev) => {
      const idx = prev.indexOf(cardId);
      if (idx <= 0) return prev;
      const next = [...prev];
      const [picked] = next.splice(idx, 1);
      next.unshift(picked);
      return next;
    });
    try {
      workspaceSound?.playHover?.();
    } catch {}
  }, []);

  const handleDoorClick = useCallback(
    (cardId: string) => {
      if (isTransitioning) return;
      setIsTransitioning(true);
      setOpeningDoorId(cardId);

      try {
        workspaceSound?.playDoorOpen?.();
      } catch {}

      const el = cardsRef.current.get(cardId);
      const isMobile = window.innerWidth < 768;

      const otherElements = Array.from(cardsRef.current.entries())
        .filter(([id]) => id !== cardId)
        .map(([, node]) => node)
        .filter(Boolean);

      gsap
        .timeline({
          onComplete: () => {
            onEnterRoom(cardId as any);
          },
        })
        .to(
          otherElements,
          {
            opacity: 0,
            scale: 0.82,
            z: -260,
            duration: 0.42,
            ease: 'power2.inOut',
          },
          0
        )
        .to(
          el || {},
          {
            scale: isMobile ? 1.55 : 2.35,
            z: 520,
            opacity: 0,
            duration: 0.62,
            ease: 'power3.in',
          },
          0.08
        );
    },
    [isTransitioning, onEnterRoom]
  );

  // Keyboard navigation: ArrowLeft/Right cycles portals, Enter opens front portal, 1-5 selects portal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isTransitioning) return;
      if (e.key === 'ArrowRight') {
        setDoorOrder((prev) => [...prev.slice(1), prev[0]]);
        try {
          workspaceSound?.playHover?.();
        } catch {}
      } else if (e.key === 'ArrowLeft') {
        setDoorOrder((prev) => [prev[prev.length - 1], ...prev.slice(0, -1)]);
        try {
          workspaceSound?.playHover?.();
        } catch {}
      } else if (e.key === 'Enter') {
        handleDoorClick(doorOrder[0]);
      } else if (['1', '2', '3', '4', '5'].includes(e.key)) {
        const idx = parseInt(e.key, 10) - 1;
        const targetDoor = DOORS[idx];
        if (targetDoor) {
          if (doorOrder[0] === targetDoor.id) {
            handleDoorClick(targetDoor.id);
          } else {
            bringDoorToFront(targetDoor.id);
          }
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isTransitioning, doorOrder, handleDoorClick, bringDoorToFront]);

  const getSlotTransform = (slot: number, isMobile: boolean) => {
    if (isMobile) {
      const offsetY = slot * 22;
      const offsetX = (slot % 2 === 1 ? -1 : 1) * slot * 10;
      const scale = Math.max(0.76, 1 - slot * 0.065);
      const rotZ = (slot % 2 === 1 ? -1 : 1) * slot * 2.2;
      const z = -slot * 40;
      return {
        x: offsetX,
        y: offsetY,
        z,
        scale,
        rotY: 0,
        rotZ,
        opacity: Math.max(0.45, 1 - slot * 0.14),
      };
    }

    if (slot === 0) {
      return { x: 0, y: 0, z: 70, scale: 1.04, rotY: 0, rotZ: 0, opacity: 1 };
    }

    const side = slot % 2 === 1 ? 1 : -1;
    const tier = Math.ceil(slot / 2);
    const spacingX = 185;
    const x = side * (tier * spacingX - (tier > 1 ? 25 : 0));
    const y = tier * 6;
    const z = -tier * 85;
    const rotY = -side * (11 + tier * 4);
    const rotZ = side * (1.2 + tier * 1.2);
    const scale = Math.max(0.8, 1 - tier * 0.075);
    const opacity = Math.max(0.62, 1 - tier * 0.12);

    return { x, y, z, scale, rotY, rotZ, opacity };
  };

  const handlePointerDown = (cardId: string, e: React.PointerEvent) => {
    if (isTransitioning) return;
    if (e.button !== 0) return;

    const target = e.currentTarget as HTMLElement;
    try {
      target.setPointerCapture(e.pointerId);
    } catch {}

    const currentIndex = doorOrder.indexOf(cardId);
    if (currentIndex === -1) return;

    dragRef.current = {
      activeCardId: cardId,
      startX: e.clientX,
      startY: e.clientY,
      currentX: e.clientX,
      currentY: e.clientY,
      hasMoved: false,
      initialIndex: currentIndex,
      targetSlot: currentIndex,
    };

    setDragState({
      cardId,
      dragX: 0,
      dragY: 0,
      targetSlot: currentIndex,
    });
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    const { activeCardId, startX, startY } = dragRef.current;
    if (!activeCardId || isTransitioning) return;

    const deltaX = e.clientX - startX;
    const deltaY = e.clientY - startY;
    const dist = Math.hypot(deltaX, deltaY);

    if (!dragRef.current.hasMoved && dist > 6) {
      dragRef.current.hasMoved = true;
    }

    dragRef.current.currentX = e.clientX;
    dragRef.current.currentY = e.clientY;

    const isMobile = window.innerWidth < 768;
    const currentIndex = dragRef.current.initialIndex;
    const total = doorOrder.length;

    let computedSlot = currentIndex;
    const initialSlotX = isMobile
      ? (currentIndex % 2 === 1 ? -1 : 1) * currentIndex * 10
      : currentIndex === 0
      ? 0
      : (currentIndex % 2 === 1 ? 1 : -1) * Math.ceil(currentIndex / 2) * 165;

    const projectedX = initialSlotX + deltaX;

    if (isMobile) {
      const pullMagnitude = Math.hypot(deltaX, deltaY);
      if (pullMagnitude > 45) {
        if (deltaY < -25 || Math.abs(deltaX) > 45) {
          const stepsForward = Math.min(currentIndex, Math.max(1, Math.round(pullMagnitude / 60)));
          computedSlot = Math.max(0, currentIndex - stepsForward);
        } else if (deltaY > 45) {
          computedSlot = Math.min(total - 1, currentIndex + Math.max(1, Math.round(deltaY / 60)));
        }
      }
    } else {
      if (Math.abs(projectedX) < 95) {
        computedSlot = 0;
      } else {
        const sign = projectedX > 0 ? 1 : -1;
        const tier = Math.min(2, Math.max(1, Math.round(Math.abs(projectedX) / 165)));
        computedSlot = sign > 0 ? tier * 2 - 1 : tier * 2;
        computedSlot = Math.max(0, Math.min(total - 1, computedSlot));
      }

      if (-deltaY > 75 && Math.abs(deltaX) < 140) {
        computedSlot = 0;
      }
    }

    if (dragRef.current.targetSlot !== computedSlot) {
      dragRef.current.targetSlot = computedSlot;
      try {
        workspaceSound?.playHover?.();
      } catch {}
    }

    setDragState({
      cardId: activeCardId,
      dragX: deltaX,
      dragY: deltaY,
      targetSlot: computedSlot,
    });
  };

  const handlePointerUp = (cardId: string, e: React.PointerEvent) => {
    const { activeCardId, hasMoved, initialIndex, targetSlot } = dragRef.current;
    if (activeCardId !== cardId) return;

    try {
      (e.currentTarget as HTMLElement).releasePointerCapture(e.pointerId);
    } catch {}

    dragRef.current.activeCardId = null;

    if (hasMoved) {
      if (targetSlot !== initialIndex) {
        setDoorOrder((prev) => {
          const newOrder = [...prev];
          const [movedCard] = newOrder.splice(initialIndex, 1);
          newOrder.splice(targetSlot, 0, movedCard);
          return newOrder;
        });
        try {
          workspaceSound?.playHover?.();
        } catch {}
      }
    } else {
      if (initialIndex === 0) {
        handleDoorClick(cardId);
      } else {
        bringDoorToFront(cardId);
      }
    }

    setDragState(null);
  };

  const handleReturnClick = () => {
    if (isTransitioning) return;
    try {
      workspaceSound?.playReturn?.();
    } catch {}
    onReturn();
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
      className="fixed inset-0 bg-[#06070a] overflow-hidden flex flex-col justify-between items-center text-white select-none"
      style={{ perspective: '1300px' }}
      ref={containerRef}
    >
      {/* Restrained Atmospheric Lighting Linked to Active Front Portal */}
      <div
        className="absolute inset-0 pointer-events-none transition-all duration-700 z-0"
        style={{
          background: `radial-gradient(circle at 50% 48%, ${activeFrontDoor.color}14 0%, rgba(6, 7, 10, 0.92) 56%, #06070a 100%)`,
        }}
      />

      {/* Architectural Perspective Grid Floor */}
      <div
        className="absolute inset-x-0 bottom-0 h-[42vh] pointer-events-none z-0 opacity-25"
        style={{
          backgroundImage: `
            linear-gradient(to right, rgba(255,255,255,0.05) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(255,255,255,0.05) 1px, transparent 1px)
          `,
          backgroundSize: '64px 64px',
          transform: 'perspective(600px) rotateX(68deg) translateY(20%)',
          transformOrigin: 'bottom center',
          maskImage: 'linear-gradient(to top, black 20%, transparent 95%)',
          WebkitMaskImage: 'linear-gradient(to top, black 20%, transparent 95%)',
        }}
      />

      {/* Dedicated Top Navigation Header */}
      <header className="relative z-30 w-full px-6 sm:px-10 md:px-14 py-4 border-b border-white/[0.06] bg-[#06070a]/80 backdrop-blur-md flex items-center justify-between">
        <button
          onClick={handleReturnClick}
          className="group flex items-center gap-3 text-left cursor-pointer focus:outline-none"
        >
          <span className="w-8 h-8 rounded-full border border-white/15 bg-white/[0.03] flex items-center justify-center transition-all duration-300 group-hover:border-amber-400/60 group-hover:bg-amber-400/10 group-hover:-translate-x-0.5">
            <ArrowLeft className="w-3.5 h-3.5 text-zinc-300 group-hover:text-amber-300 transition-colors" />
          </span>
          <div className="flex flex-col">
            <span className="font-mono text-[10px] tracking-[0.24em] text-zinc-200 group-hover:text-amber-300 transition-colors">
              RETURN TO STUDIO
            </span>
            <span className="font-mono text-[8px] tracking-[0.2em] text-zinc-500">
              ESC // WORKSPACE OVERVIEW
            </span>
          </div>
        </button>

        <div className="text-right font-mono">
          <div className="text-zinc-500 text-[9px] tracking-[0.26em] uppercase">
            NEXUS CORRIDOR // 05 CHAMBERS
          </div>
          <div className="text-zinc-300 text-[11px] tracking-[0.2em] mt-0.5">
            DRAG OR SELECT PORTAL TO ENTER
          </div>
        </div>
      </header>

      {/* 3D Interactive Architectural Portal Stage */}
      <div className="relative z-10 w-full flex-1 max-w-7xl flex justify-center items-center transform-style-3d">
        {doorOrder.map((cardId) => {
          const door = DOORS.find((d) => d.id === cardId)!;
          const currentSlot = doorOrder.indexOf(cardId);
          const isFront = currentSlot === 0;
          const isDraggingThis = dragState?.cardId === cardId;
          const isHovered = hoveredCardId === cardId;
          const isOpening = openingDoorId === cardId;
          const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;

          let projectedSlot = currentSlot;
          if (dragState && !isDraggingThis) {
            const dragInit = dragRef.current.initialIndex;
            const dragTarget = dragState.targetSlot;
            if (dragInit < dragTarget) {
              if (currentSlot > dragInit && currentSlot <= dragTarget) {
                projectedSlot = currentSlot - 1;
              }
            } else if (dragInit > dragTarget) {
              if (currentSlot >= dragTarget && currentSlot < dragInit) {
                projectedSlot = currentSlot + 1;
              }
            }
          }

          const slotTransform = getSlotTransform(projectedSlot, isMobile);

          let x = slotTransform.x;
          let y = slotTransform.y;
          let z = slotTransform.z;
          let rotX = 0;
          let rotY = slotTransform.rotY;
          let rotZ = slotTransform.rotZ;
          let scale = slotTransform.scale;
          let opacity = slotTransform.opacity;
          let zIndex = doorOrder.length - projectedSlot;

          if (isDraggingThis && dragState) {
            zIndex = 100;
            x += dragState.dragX;
            y += dragState.dragY;
            z = 160;
            scale = isMobile ? 1.05 : 1.12;
            rotZ = Math.max(-14, Math.min(14, dragState.dragX * 0.06));
            rotX = Math.max(-12, Math.min(12, -dragState.dragY * 0.06));
            rotY = Math.max(-16, Math.min(16, dragState.dragX * 0.04));
            opacity = 1;
          } else if (isHovered && !dragState) {
            z += 28;
            scale *= 1.03;
          }

          // Physical inner door leaf angle: swings ajar on front/hover, swings wide open on entry
          const innerDoorLeafAngle = isOpening
            ? -72
            : isFront && isHovered
            ? -24
            : isFront
            ? -12
            : isHovered
            ? -10
            : 0;

          return (
            <motion.div
              key={door.id}
              ref={(el) => {
                if (el) cardsRef.current.set(door.id, el);
                else cardsRef.current.delete(door.id);
              }}
              onPointerDown={(e) => handlePointerDown(door.id, e)}
              onPointerMove={handlePointerMove}
              onPointerUp={(e) => handlePointerUp(door.id, e)}
              onPointerCancel={(e) => handlePointerUp(door.id, e)}
              onMouseEnter={() => {
                if (!dragState) {
                  setHoveredCardId(door.id);
                  try {
                    workspaceSound?.playHover?.();
                  } catch {}
                }
              }}
              onMouseLeave={() => {
                if (!dragState) setHoveredCardId(null);
              }}
              animate={{
                x,
                y,
                z,
                rotateX: rotX,
                rotateY: rotY,
                rotateZ: rotZ,
                scale,
                opacity,
              }}
              transition={
                isDraggingThis
                  ? { type: 'spring', damping: 38, stiffness: 550, mass: 0.12 }
                  : { type: 'spring', damping: 28, stiffness: 230, mass: 0.75 }
              }
              style={{
                zIndex,
                transformStyle: 'preserve-3d',
                touchAction: 'none',
              }}
              className="absolute w-64 h-[350px] md:w-72 md:h-[400px] rounded-t-2xl rounded-b-lg p-6 flex flex-col justify-between cursor-grab active:cursor-grabbing select-none"
            >
              {/* Outer Architectural Portal Architrave / Frame */}
              <div
                className="absolute inset-0 rounded-t-2xl rounded-b-lg bg-[#0b0d13]/95 border transition-colors duration-300 overflow-hidden"
                style={{
                  borderColor:
                    isDraggingThis || isHovered || isFront
                      ? `${door.color}66`
                      : 'rgba(255,255,255,0.09)',
                  boxShadow:
                    isDraggingThis || isHovered
                      ? `0 24px 48px -12px rgba(0,0,0,0.85), 0 0 28px -8px ${door.color}40`
                      : '0 16px 36px -10px rgba(0,0,0,0.8)',
                }}
              >
                {/* Inner Chamber Depth Aperture (Revealed as inner door leaf swings open) */}
                <div
                  className="absolute inset-3 rounded-t-xl rounded-b bg-[#050609] border border-white/[0.05] flex flex-col items-center justify-center overflow-hidden"
                  style={{
                    background: `radial-gradient(circle at 65% 50%, ${door.color}22 0%, #050609 75%)`,
                  }}
                >
                  {/* Vertical light seam inside chamber */}
                  <div
                    className="absolute right-3 top-4 bottom-4 w-[2px] rounded-full transition-opacity duration-500"
                    style={{
                      backgroundColor: door.color,
                      opacity: isFront || isHovered ? 0.75 : 0.15,
                      boxShadow: `0 0 12px ${door.color}`,
                    }}
                  />
                </div>

                {/* Physical Hinged Door Slab (Pivots from left jamb in 3D perspective) */}
                <div
                  className="absolute inset-3 rounded-t-xl rounded-b bg-[#0f121a] border border-white/[0.07] origin-left transition-transform duration-500 ease-out pointer-events-none"
                  style={{
                    transform: `perspective(700px) rotateY(${innerDoorLeafAngle}deg)`,
                    boxShadow:
                      innerDoorLeafAngle < 0
                        ? `12px 0 24px -6px rgba(0,0,0,0.85), 2px 0 10px ${door.color}30`
                        : 'none',
                  }}
                >
                  {/* Subtle architectural door handle bar on right edge of slab */}
                  <div
                    className="absolute right-3 top-1/2 -translate-y-1/2 w-1 h-10 rounded-full transition-colors duration-300"
                    style={{
                      backgroundColor:
                        isFront || isHovered ? door.color : 'rgba(255,255,255,0.18)',
                    }}
                  />
                </div>
              </div>

              {/* Top Portal Telemetry Header */}
              <div className="relative z-10 flex items-center justify-between pointer-events-none">
                <span className="font-mono text-xs tracking-[0.24em] text-zinc-400">
                  PORTAL {door.num}
                </span>
                <span
                  className="font-mono text-[9px] tracking-[0.2em] px-2.5 py-0.5 rounded-full border transition-colors duration-300"
                  style={{
                    color: isFront || isHovered ? door.color : 'rgba(255,255,255,0.35)',
                    borderColor:
                      isFront || isHovered ? `${door.color}55` : 'rgba(255,255,255,0.08)',
                    backgroundColor:
                      isFront || isHovered ? `${door.color}14` : 'transparent',
                  }}
                >
                  {isFront ? 'THRESHOLD READY' : `SLOT 0${currentSlot + 1}`}
                </span>
              </div>

              {/* Center Emblem & Architectural Typography */}
              <div className="relative z-10 my-auto flex flex-col items-center text-center pointer-events-none px-2">
                <div
                  className="w-14 h-14 rounded-2xl border flex items-center justify-center mb-6 transition-all duration-300"
                  style={{
                    borderColor:
                      isFront || isHovered ? `${door.color}55` : 'rgba(255,255,255,0.1)',
                    backgroundColor:
                      isFront || isHovered ? `${door.color}12` : 'rgba(255,255,255,0.02)',
                  }}
                >
                  <door.icon
                    className="w-7 h-7 transition-transform duration-300"
                    style={{
                      color: isFront || isHovered ? door.color : 'rgba(255,255,255,0.55)',
                      transform: isFront || isHovered ? 'scale(1.1)' : 'scale(1)',
                    }}
                    strokeWidth={1.4}
                  />
                </div>

                <h2 className="font-display text-xl md:text-2xl font-bold tracking-[0.14em] text-white">
                  {door.label}
                </h2>
                <p className="mt-1.5 text-[11px] font-mono tracking-[0.18em] text-zinc-400 uppercase">
                  {door.sub}
                </p>
                <span
                  className="mt-3 text-[10px] font-mono tracking-[0.16em] transition-opacity duration-300"
                  style={{
                    color: door.color,
                    opacity: isFront || isHovered ? 0.9 : 0.45,
                  }}
                >
                  {door.preview}
                </span>
              </div>

              {/* Bottom Threshold Sill & Action Cue */}
              <div className="relative z-10 flex flex-col gap-2.5 pointer-events-none">
                <div className="w-full h-[1.5px] bg-white/10 overflow-hidden rounded-full">
                  <div
                    className="h-full transition-all duration-500 ease-out"
                    style={{
                      backgroundColor: door.color,
                      width: isFront || isHovered ? '100%' : '22%',
                    }}
                  />
                </div>
                <div className="flex items-center justify-between text-[9px] font-mono tracking-[0.2em] text-zinc-400 uppercase">
                  <span>{isFront ? 'CLICK TO STEP INSIDE' : 'CLICK TO ALIGN'}</span>
                  <ArrowUpRight
                    className="w-3.5 h-3.5 transition-transform duration-300"
                    style={{
                      color: isFront ? door.color : 'rgba(255,255,255,0.35)',
                      transform:
                        isFront || isHovered ? 'translate(1px, -1px)' : 'translate(0, 0)',
                    }}
                  />
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Bottom Quick-Select Chamber Index Bar */}
      <footer className="relative z-30 w-full px-6 pb-6 pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
        <div className="flex items-center gap-1.5 p-1 rounded-full bg-white/[0.03] border border-white/[0.08] backdrop-blur-md">
          {DOORS.map((door) => {
            const isActive = activeFrontId === door.id;
            return (
              <button
                key={door.id}
                onClick={() => {
                  if (isActive) {
                    handleDoorClick(door.id);
                  } else {
                    bringDoorToFront(door.id);
                  }
                }}
                className={`px-3 sm:px-4 py-1.5 rounded-full font-mono text-[10px] tracking-[0.18em] transition-all duration-300 cursor-pointer ${
                  isActive
                    ? 'text-white bg-white/10 border border-white/20'
                    : 'text-zinc-500 hover:text-zinc-300 border border-transparent'
                }`}
              >
                <span className="opacity-60 mr-1.5">{door.num}</span>
                <span className="hidden sm:inline">{door.label}</span>
              </button>
            );
          })}
        </div>
      </footer>
    </motion.div>
  );
}
