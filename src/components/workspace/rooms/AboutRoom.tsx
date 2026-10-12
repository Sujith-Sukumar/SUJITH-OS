import React, { useEffect, useRef, useState, useCallback } from 'react';
import * as THREE from 'three';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowLeft, ArrowUpRight, Sparkles, Compass, Layers, Cpu } from 'lucide-react';
import { portfolioConfig } from '../../../data/portfolioData';

gsap.registerPlugin(ScrollTrigger);

interface AboutRoomProps {
  onReturn: () => void;
}

interface JourneyPhase {
  id: string;
  index: string;
  period: string;
  title: string;
  organization: string;
  summary: string;
}

interface CraftLayer {
  id: string;
  index: string;
  name: string;
  architectureRole: string;
  description: string;
  layerIndex: number;
}

interface MindsetPillar {
  id: string;
  index: string;
  title: string;
  reflection: string;
}

const JOURNEY_PHASES: JourneyPhase[] = [
  {
    id: 'foundation',
    index: '01',
    period: 'EDUCATION',
    title: 'Computer Science Foundation',
    organization: 'Calicut University · Kerala',
    summary: 'Core grounding in algorithms, data structures, and software engineering.',
  },
  {
    id: 'internship',
    index: '02',
    period: 'DEC 2024 — MAY 2025',
    title: 'Full Stack Developer Intern',
    organization: 'Seclob Technologies · Kozhikode',
    summary: 'Built production React interfaces and modular REST APIs in agile sprints.',
  },
  {
    id: 'professional',
    index: '03',
    period: 'MAY 2025 — PRESENT',
    title: 'Full Stack Developer',
    organization: 'ESTA Enterprises · Kozhikode',
    summary: 'Architecting and scaling end-to-end production platforms and enterprise systems.',
  },
];

const CRAFT_LAYERS: CraftLayer[] = [
  {
    id: 'react',
    index: '01',
    name: 'React.js',
    architectureRole: 'UI & State Architecture',
    description: 'Modular component systems, custom hooks, and responsive 60fps interfaces.',
    layerIndex: 4,
  },
  {
    id: 'nextjs',
    index: '02',
    name: 'Next.js',
    architectureRole: 'Hybrid SSR & Edge Delivery',
    description: 'Server Components, dynamic routing, and fast production web performance.',
    layerIndex: 3,
  },
  {
    id: 'nodejs',
    index: '03',
    name: 'Node.js',
    architectureRole: 'Async Server Runtime',
    description: 'Non-blocking backend services and real-time WebSocket architectures.',
    layerIndex: 2,
  },
  {
    id: 'express',
    index: '04',
    name: 'Express.js',
    architectureRole: 'REST APIs & Security',
    description: 'Clean service controllers, JWT authentication, and RBAC middleware.',
    layerIndex: 1,
  },
  {
    id: 'mongodb',
    index: '05',
    name: 'MongoDB',
    architectureRole: 'Document Data Engine',
    description: 'Scalable Mongoose schemas, compound indexing, and fast aggregations.',
    layerIndex: 0,
  },
];

const MINDSET_PILLARS: MindsetPillar[] = [
  {
    id: 'problem-solving',
    index: '01',
    title: 'Solve Real Problems First',
    reflection: 'Focusing on user bottlenecks and clean architecture over unnecessary complexity.',
  },
  {
    id: 'continuous-learning',
    index: '02',
    title: 'Relentless Curiosity',
    reflection: 'Continuously exploring modern frameworks, system design, and web performance.',
  },
  {
    id: 'useful-experiences',
    index: '03',
    title: 'Useful Digital Experiences',
    reflection: 'Crafting fast, intuitive software that feels effortless and reliable.',
  },
];

const CHAPTER_LABELS = [
  { id: 'who-i-am', code: '01', label: 'WHO I AM', stateName: 'IDENTITY MONOLITH' },
  { id: 'my-journey', code: '02', label: 'MY JOURNEY', stateName: 'ASCENDING HELIX' },
  { id: 'my-craft', code: '03', label: 'MY CRAFT', stateName: 'STACK ENGINE' },
  { id: 'my-mindset', code: '04', label: 'MY MINDSET', stateName: 'SYNTHESIS MATRIX' },
];

export const AboutRoom: React.FC<AboutRoomProps> = ({ onReturn }) => {
  const { personal } = portfolioConfig;

  const containerRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const [activeChapter, setActiveChapter] = useState<number>(0);
  const [scrollProgress, setScrollProgress] = useState<number>(0);
  const [selectedJourneyIdx, setSelectedJourneyIdx] = useState<number>(2);
  const [hoveredCraftIdx, setHoveredCraftIdx] = useState<number>(0);
  const [selectedMindsetIdx, setSelectedMindsetIdx] = useState<number>(0);

  const scrollProgressRef = useRef<number>(0);
  const activeChapterRef = useRef<number>(0);
  const selectedJourneyRef = useRef<number>(2);
  const hoveredCraftRef = useRef<number>(0);
  const selectedMindsetRef = useRef<number>(0);
  const pointerRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });

  useEffect(() => {
    selectedJourneyRef.current = selectedJourneyIdx;
  }, [selectedJourneyIdx]);

  useEffect(() => {
    hoveredCraftRef.current = hoveredCraftIdx;
  }, [hoveredCraftIdx]);

  useEffect(() => {
    selectedMindsetRef.current = selectedMindsetIdx;
  }, [selectedMindsetIdx]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onReturn();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onReturn]);

  const scrollToChapter = useCallback((index: number) => {
    const scroller = scrollRef.current;
    if (!scroller) return;
    const target = scroller.querySelector(`#about-chapter-${index}`) as HTMLElement | null;
    if (target) {
      scroller.scrollTo({
        top: target.offsetTop - 24,
        behavior: 'smooth',
      });
    }
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    const scroller = scrollRef.current;
    if (!canvas || !scroller) return;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x06070a, 0.032);

    const camera = new THREE.PerspectiveCamera(
      42,
      window.innerWidth / window.innerHeight,
      0.1,
      120
    );
    camera.position.set(0, 0, 14);

    const renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance',
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;

    const ambientLight = new THREE.AmbientLight(0xd9e2ec, 0.65);
    scene.add(ambientLight);

    const keyLight = new THREE.PointLight(0xf59e0b, 3.8, 38);
    keyLight.position.set(6, 5, 9);
    scene.add(keyLight);

    const rimLight = new THREE.PointLight(0x38bdf8, 1.9, 34);
    rimLight.position.set(-7, -4, 6);
    scene.add(rimLight);

    const coreLight = new THREE.PointLight(0xfbbf24, 2.4, 20);
    coreLight.position.set(2.5, -1, 4);
    scene.add(coreLight);

    const floorGroup = new THREE.Group();
    floorGroup.position.set(0, -4.6, 0);
    scene.add(floorGroup);

    const gridHelper = new THREE.GridHelper(64, 48, 0xf59e0b, 0x1e293b);
    const gridMat = gridHelper.material as THREE.Material;
    gridMat.transparent = true;
    gridMat.opacity = 0.14;
    floorGroup.add(gridHelper);

    const dustCount = 220;
    const dustPositions = new Float32Array(dustCount * 3);
    for (let i = 0; i < dustCount; i++) {
      dustPositions[i * 3] = (Math.random() - 0.5) * 34;
      dustPositions[i * 3 + 1] = (Math.random() - 0.5) * 22;
      dustPositions[i * 3 + 2] = (Math.random() - 0.5) * 18 - 4;
    }
    const dustGeo = new THREE.BufferGeometry();
    dustGeo.setAttribute('position', new THREE.BufferAttribute(dustPositions, 3));
    const dustMat = new THREE.PointsMaterial({
      color: 0xfbbf24,
      size: 0.045,
      transparent: true,
      opacity: 0.28,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
    const dustField = new THREE.Points(dustGeo, dustMat);
    scene.add(dustField);

    const stageGroup = new THREE.Group();
    const isDesktopInit = window.innerWidth >= 1024;
    stageGroup.position.set(isDesktopInit ? 3.3 : 0, isDesktopInit ? -0.35 : -2.1, 0);
    scene.add(stageGroup);

    const darkMetalMat = new THREE.MeshStandardMaterial({
      color: 0x0c1018,
      roughness: 0.22,
      metalness: 0.88,
    });

    // STATE 01: WHO I AM
    const state1Group = new THREE.Group();
    stageGroup.add(state1Group);

    const monolithGeo = new THREE.OctahedronGeometry(1.65, 0);
    monolithGeo.scale(0.85, 1.45, 0.85);
    const monolithMesh = new THREE.Mesh(monolithGeo, darkMetalMat);
    state1Group.add(monolithMesh);

    const monolithEdgesGeo = new THREE.EdgesGeometry(monolithGeo);
    const monolithWireMat = new THREE.LineBasicMaterial({
      color: 0xf59e0b,
      transparent: true,
      opacity: 0.72,
    });
    const monolithWire = new THREE.LineSegments(monolithEdgesGeo, monolithWireMat);
    monolithWire.scale.setScalar(1.015);
    state1Group.add(monolithWire);

    const ring1Geo = new THREE.TorusGeometry(2.45, 0.012, 16, 120);
    const ring1Mat = new THREE.MeshBasicMaterial({
      color: 0xfbbf24,
      transparent: true,
      opacity: 0.42,
    });
    const ring1 = new THREE.Mesh(ring1Geo, ring1Mat);
    ring1.rotation.set(Math.PI / 2.6, 0.3, 0);
    state1Group.add(ring1);

    const ring2Geo = new THREE.TorusGeometry(2.95, 0.009, 16, 120);
    const ring2Mat = new THREE.MeshBasicMaterial({
      color: 0x94a3b8,
      transparent: true,
      opacity: 0.25,
    });
    const ring2 = new THREE.Mesh(ring2Geo, ring2Mat);
    ring2.rotation.set(-Math.PI / 3.2, -0.4, 0.2);
    state1Group.add(ring2);

    const satellitesGroup = new THREE.Group();
    state1Group.add(satellitesGroup);
    for (let i = 0; i < 3; i++) {
      const angle = (i / 3) * Math.PI * 2;
      const satGeo = new THREE.OctahedronGeometry(0.14, 0);
      const satMat = new THREE.MeshBasicMaterial({
        color: 0xfbbf24,
        wireframe: true,
        transparent: true,
        opacity: 0.8,
      });
      const sat = new THREE.Mesh(satGeo, satMat);
      sat.position.set(Math.cos(angle) * 2.45, Math.sin(angle) * 0.45, Math.sin(angle) * 2.45);
      satellitesGroup.add(sat);
    }

    // STATE 02: MY JOURNEY
    const state2Group = new THREE.Group();
    state2Group.scale.setScalar(0.001);
    stageGroup.add(state2Group);

    const journeyNodes: {
      group: THREE.Group;
      wireMat: THREE.LineBasicMaterial;
      ringMat: THREE.MeshBasicMaterial;
    }[] = [];

    const nodePositions = [
      new THREE.Vector3(-1.15, -1.55, -0.4),
      new THREE.Vector3(0.0, -0.1, 0.3),
      new THREE.Vector3(1.15, 1.45, 0.6),
    ];

    nodePositions.forEach((pos, idx) => {
      const nodeGroup = new THREE.Group();
      nodeGroup.position.copy(pos);

      const size = 0.55 + idx * 0.16;
      const boxGeo = new THREE.BoxGeometry(size * 1.4, size * 0.55, size * 1.4);
      const boxMesh = new THREE.Mesh(boxGeo, darkMetalMat);
      nodeGroup.add(boxMesh);

      const edgesGeo = new THREE.EdgesGeometry(boxGeo);
      const wireMat = new THREE.LineBasicMaterial({
        color: idx === 2 ? 0xfbbf24 : 0xf59e0b,
        transparent: true,
        opacity: 0.6,
      });
      const wire = new THREE.LineSegments(edgesGeo, wireMat);
      wire.scale.setScalar(1.02);
      nodeGroup.add(wire);

      const haloGeo = new THREE.RingGeometry(size * 1.15, size * 1.2, 48);
      const ringMat = new THREE.MeshBasicMaterial({
        color: 0xfbbf24,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.3,
      });
      const halo = new THREE.Mesh(haloGeo, ringMat);
      halo.rotation.x = Math.PI / 2;
      nodeGroup.add(halo);

      state2Group.add(nodeGroup);
      journeyNodes.push({ group: nodeGroup, wireMat, ringMat });
    });

    const curve = new THREE.CatmullRomCurve3(nodePositions);
    const tubeGeo = new THREE.TubeGeometry(curve, 48, 0.02, 8, false);
    const tubeMat = new THREE.MeshBasicMaterial({
      color: 0xf59e0b,
      transparent: true,
      opacity: 0.45,
    });
    const trajectoryTube = new THREE.Mesh(tubeGeo, tubeMat);
    state2Group.add(trajectoryTube);

    // STATE 03: MY CRAFT
    const state3Group = new THREE.Group();
    state3Group.scale.setScalar(0.001);
    stageGroup.add(state3Group);

    const craftPlates: {
      group: THREE.Group;
      wireMat: THREE.LineBasicMaterial;
      coreMat: THREE.MeshStandardMaterial;
      baseY: number;
    }[] = [];

    for (let i = 0; i < 5; i++) {
      const plateGroup = new THREE.Group();
      const baseY = (i - 2) * 0.72;
      plateGroup.position.set(0, baseY, 0);

      const slabGeo = new THREE.CylinderGeometry(1.55 - i * 0.06, 1.55 - i * 0.06, 0.16, 8);
      const coreMat = new THREE.MeshStandardMaterial({
        color: 0x0e131d,
        roughness: 0.25,
        metalness: 0.85,
        emissive: 0xf59e0b,
        emissiveIntensity: 0.04,
      });
      const slabMesh = new THREE.Mesh(slabGeo, coreMat);
      plateGroup.add(slabMesh);

      const slabEdges = new THREE.EdgesGeometry(slabGeo);
      const wireMat = new THREE.LineBasicMaterial({
        color: 0xf59e0b,
        transparent: true,
        opacity: 0.45,
      });
      const slabWire = new THREE.LineSegments(slabEdges, wireMat);
      slabWire.scale.setScalar(1.015);
      plateGroup.add(slabWire);

      state3Group.add(plateGroup);
      craftPlates.push({ group: plateGroup, wireMat, coreMat, baseY });
    }

    const conduitGeo = new THREE.CylinderGeometry(0.06, 0.06, 3.6, 16);
    const conduitMat = new THREE.MeshBasicMaterial({
      color: 0xfbbf24,
      transparent: true,
      opacity: 0.35,
      wireframe: true,
    });
    const conduitMesh = new THREE.Mesh(conduitGeo, conduitMat);
    state3Group.add(conduitMesh);

    // STATE 04: MY MINDSET
    const state4Group = new THREE.Group();
    state4Group.scale.setScalar(0.001);
    stageGroup.add(state4Group);

    const geoSphereGeo = new THREE.IcosahedronGeometry(1.95, 1);
    const geoEdges = new THREE.EdgesGeometry(geoSphereGeo);
    const geoWireMat = new THREE.LineBasicMaterial({
      color: 0xfbbf24,
      transparent: true,
      opacity: 0.55,
    });
    const geoWire = new THREE.LineSegments(geoEdges, geoWireMat);
    state4Group.add(geoWire);

    const innerCoreGeo = new THREE.DodecahedronGeometry(0.95, 0);
    const innerCoreMesh = new THREE.Mesh(innerCoreGeo, darkMetalMat);
    state4Group.add(innerCoreMesh);

    const innerCoreEdges = new THREE.EdgesGeometry(innerCoreGeo);
    const innerCoreWireMat = new THREE.LineBasicMaterial({
      color: 0x38bdf8,
      transparent: true,
      opacity: 0.65,
    });
    const innerCoreWire = new THREE.LineSegments(innerCoreEdges, innerCoreWireMat);
    innerCoreWire.scale.setScalar(1.03);
    state4Group.add(innerCoreWire);

    const handleScroll = () => {
      const maxScroll = Math.max(1, scroller.scrollHeight - scroller.clientHeight);
      const progress = Math.min(1, Math.max(0, scroller.scrollTop / maxScroll));
      scrollProgressRef.current = progress;
      setScrollProgress(progress);

      const chapters = [0, 1, 2, 3].map((idx) =>
        scroller.querySelector(`#about-chapter-${idx}`) as HTMLElement | null
      );
      const viewportCenter = scroller.scrollTop + scroller.clientHeight * 0.42;

      let currentIdx = 0;
      chapters.forEach((el, idx) => {
        if (el && viewportCenter >= el.offsetTop) {
          currentIdx = idx;
        }
      });

      if (currentIdx !== activeChapterRef.current) {
        activeChapterRef.current = currentIdx;
        setActiveChapter(currentIdx);
      }
    };

    scroller.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    const handlePointerMove = (e: MouseEvent) => {
      pointerRef.current.x = (e.clientX / window.innerWidth - 0.5) * 2;
      pointerRef.current.y = -(e.clientY / window.innerHeight - 0.5) * 2;
    };
    window.addEventListener('mousemove', handlePointerMove, { passive: true });

    const gsapCtx = gsap.context(() => {
      if (prefersReducedMotion) return;

      const revealBlocks = scroller.querySelectorAll('.about-reveal-block');
      revealBlocks.forEach((block) => {
        gsap.fromTo(
          block,
          { opacity: 0, y: 32 },
          {
            opacity: 1,
            y: 0,
            duration: 0.85,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: block,
              scroller: scroller,
              start: 'top 86%',
              toggleActions: 'play none none reverse',
            },
          }
        );
      });
    }, scroller);

    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);

      const isDesktop = window.innerWidth >= 1024;
      stageGroup.position.x = isDesktop ? 3.3 : 0;
      stageGroup.position.y = isDesktop ? -0.35 : -2.1;
    };
    window.addEventListener('resize', handleResize);

    const clock = new THREE.Clock();
    let reqId: number;

    const animate = () => {
      reqId = requestAnimationFrame(animate);
      const elapsed = clock.getElapsedTime();
      const ch = activeChapterRef.current;

      const targetRotY = pointerRef.current.x * 0.28;
      const targetRotX = -pointerRef.current.y * 0.18;
      stageGroup.rotation.y += (targetRotY - stageGroup.rotation.y) * 0.05;
      stageGroup.rotation.x += (targetRotX - stageGroup.rotation.x) * 0.05;

      const targetScales = [
        ch === 0 ? 1 : 0.001,
        ch === 1 ? 1 : 0.001,
        ch === 2 ? 1 : 0.001,
        ch === 3 ? 1 : 0.001,
      ];

      state1Group.scale.setScalar(
        THREE.MathUtils.lerp(state1Group.scale.x, targetScales[0], 0.07)
      );
      state2Group.scale.setScalar(
        THREE.MathUtils.lerp(state2Group.scale.x, targetScales[1], 0.07)
      );
      state3Group.scale.setScalar(
        THREE.MathUtils.lerp(state3Group.scale.x, targetScales[2], 0.07)
      );
      state4Group.scale.setScalar(
        THREE.MathUtils.lerp(state4Group.scale.x, targetScales[3], 0.07)
      );

      state1Group.visible = state1Group.scale.x > 0.01;
      state2Group.visible = state2Group.scale.x > 0.01;
      state3Group.visible = state3Group.scale.x > 0.01;
      state4Group.visible = state4Group.scale.x > 0.01;

      if (!prefersReducedMotion) {
        if (state1Group.visible) {
          monolithMesh.rotation.y = elapsed * 0.35;
          monolithWire.rotation.y = elapsed * 0.35;
          monolithMesh.position.y = Math.sin(elapsed * 1.4) * 0.14;
          monolithWire.position.y = monolithMesh.position.y;
          ring1.rotation.z = elapsed * 0.25;
          ring2.rotation.z = -elapsed * 0.18;
          satellitesGroup.rotation.y = -elapsed * 0.45;
        }

        if (state2Group.visible) {
          state2Group.rotation.y = Math.sin(elapsed * 0.4) * 0.25;
          const activeJ = selectedJourneyRef.current;
          journeyNodes.forEach((node, idx) => {
            const isSelected = idx === activeJ;
            const targetScale = isSelected ? 1.28 : 0.92;
            node.group.scale.setScalar(
              THREE.MathUtils.lerp(node.group.scale.x, targetScale, 0.1)
            );
            node.group.rotation.y = elapsed * (isSelected ? 0.65 : 0.2);
            node.wireMat.opacity = THREE.MathUtils.lerp(
              node.wireMat.opacity,
              isSelected ? 0.95 : 0.32,
              0.1
            );
            node.ringMat.opacity = THREE.MathUtils.lerp(
              node.ringMat.opacity,
              isSelected ? 0.75 : 0.15,
              0.1
            );
          });
        }

        if (state3Group.visible) {
          const activeCraftLayer = CRAFT_LAYERS[hoveredCraftRef.current]?.layerIndex ?? 4;
          craftPlates.forEach((plate, idx) => {
            const isFocused = idx === activeCraftLayer;
            const offset =
              idx > activeCraftLayer ? 0.22 : idx < activeCraftLayer ? -0.22 : 0;
            const targetY = plate.baseY + offset;
            plate.group.position.y = THREE.MathUtils.lerp(
              plate.group.position.y,
              targetY,
              0.1
            );
            const targetZ = isFocused ? 0.48 : 0;
            plate.group.position.z = THREE.MathUtils.lerp(
              plate.group.position.z,
              targetZ,
              0.1
            );
            plate.group.rotation.y = elapsed * (isFocused ? 0.45 : 0.15);
            plate.wireMat.opacity = THREE.MathUtils.lerp(
              plate.wireMat.opacity,
              isFocused ? 0.95 : 0.28,
              0.12
            );
            plate.coreMat.emissiveIntensity = THREE.MathUtils.lerp(
              plate.coreMat.emissiveIntensity,
              isFocused ? 0.35 : 0.03,
              0.12
            );
          });
        }

        if (state4Group.visible) {
          const pulseBoost = 1 + selectedMindsetRef.current * 0.08;
          geoWire.rotation.y = elapsed * 0.22 * pulseBoost;
          geoWire.rotation.x = elapsed * 0.14;
          innerCoreMesh.rotation.y = -elapsed * 0.45;
          innerCoreWire.rotation.y = -elapsed * 0.45;
          const breathe = 1 + Math.sin(elapsed * 2.2) * 0.05;
          innerCoreMesh.scale.setScalar(breathe);
          innerCoreWire.scale.setScalar(breathe * 1.03);
        }

        dustField.rotation.y = elapsed * 0.02;
      }

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      cancelAnimationFrame(reqId);
      scroller.removeEventListener('scroll', handleScroll);
      window.removeEventListener('mousemove', handlePointerMove);
      window.removeEventListener('resize', handleResize);
      gsapCtx.revert();
      renderer.dispose();
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-50 flex flex-col bg-[#06070a] text-[#f3f4f6] overflow-hidden select-none"
    >
      {/* ─── LAYER 1: THREE.JS 4-STATE ARCHITECTURAL UNIVERSE ─── */}
      <canvas
        ref={canvasRef}
        className="fixed inset-0 w-full h-full pointer-events-none z-0"
      />

      <div
        className="fixed inset-0 pointer-events-none z-10"
        style={{
          background:
            'radial-gradient(circle at 74% 52%, rgba(245, 158, 11, 0.06) 0%, rgba(6, 7, 10, 0.78) 58%, rgba(6, 7, 10, 0.95) 100%)',
        }}
      />

      {/* ─── LAYER 2: TOP NAVIGATION BAR ─── */}
      <header className="relative z-30 shrink-0 w-full bg-[#06070a]/90 backdrop-blur-md border-b border-white/[0.07] px-6 sm:px-10 md:px-14 py-3.5 flex items-center justify-between">
        <button
          onClick={onReturn}
          className="group flex items-center gap-3 text-left focus:outline-none"
          aria-label="Return to Nexus"
        >
          <span className="w-8 h-8 rounded-full border border-white/15 bg-white/[0.03] flex items-center justify-center transition-all duration-300 group-hover:border-amber-400/60 group-hover:bg-amber-400/10 group-hover:-translate-x-0.5">
            <ArrowLeft className="w-3.5 h-3.5 text-zinc-300 group-hover:text-amber-300 transition-colors" />
          </span>
          <div className="flex flex-col">
            <span className="font-mono text-[10px] tracking-[0.24em] text-zinc-200 group-hover:text-amber-300 transition-colors">
              RETURN TO NEXUS
            </span>
            <span className="font-mono text-[8px] tracking-[0.2em] text-zinc-500">
              ESC // CHAMBER 01
            </span>
          </div>
        </button>

        <nav
          aria-label="About chapters"
          className="hidden md:flex items-center gap-1.5 bg-white/[0.02] border border-white/[0.07] rounded-full p-1"
        >
          {CHAPTER_LABELS.map((chap, idx) => {
            const isActive = activeChapter === idx;
            return (
              <button
                key={chap.id}
                onClick={() => scrollToChapter(idx)}
                className={`px-3.5 py-1.5 rounded-full font-mono text-[10px] tracking-[0.18em] transition-all duration-300 ${
                  isActive
                    ? 'bg-amber-500/20 text-amber-300 border border-amber-400/40'
                    : 'text-zinc-400 hover:text-zinc-200 border border-transparent'
                }`}
              >
                <span className="opacity-60 mr-1.5">{chap.code}</span>
                {chap.label}
              </button>
            );
          })}
        </nav>

        <div className="flex items-center gap-4">
          <span className="hidden sm:inline-block font-mono text-[9px] tracking-[0.22em] text-amber-400/90 uppercase">
            {CHAPTER_LABELS[activeChapter]?.stateName}
          </span>
          <div className="w-14 h-[2px] bg-white/10 overflow-hidden rounded-full">
            <div
              className="h-full bg-amber-400 transition-all duration-150"
              style={{ width: `${Math.max(6, scrollProgress * 100)}%` }}
            />
          </div>
        </div>
      </header>

      {/* ─── LAYER 3: MINIMAL SCROLL-DRIVEN STORY STREAM ─── */}
      <div
        ref={scrollRef}
        className="relative z-20 flex-1 overflow-y-auto overflow-x-hidden scroll-smooth"
      >
        <div className="max-w-7xl mx-auto px-6 sm:px-10 md:px-14 pt-6 sm:pt-8 md:pt-10 pb-24">
          {/* =====================================================================
              01 / WHO I AM
             ===================================================================== */}
          <section
            id="about-chapter-0"
            className="min-h-[76vh] flex flex-col justify-between pb-16 border-b border-white/[0.07]"
          >
            <div className="max-w-xl">
              <div className="inline-flex items-center gap-2.5 mb-4">
                <span className="w-2 h-2 rounded-full bg-amber-400 shadow-[0_0_12px_#f59e0b]" />
                <span className="font-mono text-[10px] tracking-[0.28em] text-amber-300 uppercase">
                  01 / WHO I AM
                </span>
              </div>

              <h1 className="font-display font-bold tracking-[-0.03em] text-white leading-[1.05] text-[clamp(2.1rem,4.6vw,4rem)]">
                {personal.fullName}
                <span className="block font-light text-zinc-400 text-[clamp(1.25rem,2.4vw,2rem)] mt-1.5">
                  Full Stack Developer
                </span>
              </h1>

              <p className="mt-5 text-zinc-300 text-sm sm:text-base leading-relaxed max-w-lg">
                Full Stack Developer based in <span className="text-white">{personal.location}</span>{' '}
                with <span className="text-amber-300 font-medium">{personal.experienceYears}</span>{' '}
                of experience building modern web applications across the MERN &amp; Next.js stack.
              </p>

              <div className="mt-8 pt-6 border-t border-white/10 grid grid-cols-3 gap-5 max-w-md">
                <div>
                  <span className="block font-mono text-[9px] tracking-[0.22em] text-zinc-500 uppercase">
                    EXPERIENCE
                  </span>
                  <span className="mt-1 block font-display text-lg sm:text-xl font-bold text-white">
                    1.5+ Years
                  </span>
                </div>

                <div className="border-l border-white/10 pl-4">
                  <span className="block font-mono text-[9px] tracking-[0.22em] text-zinc-500 uppercase">
                    STACK
                  </span>
                  <span className="mt-1 block font-display text-lg sm:text-xl font-bold text-white">
                    MERN + Next
                  </span>
                </div>

                <div className="border-l border-white/10 pl-4">
                  <span className="block font-mono text-[9px] tracking-[0.22em] text-zinc-500 uppercase">
                    LOCATION
                  </span>
                  <span className="mt-1 block font-display text-lg sm:text-xl font-bold text-white">
                    Kerala, IN
                  </span>
                </div>
              </div>
            </div>

            <div className="mt-10 pt-4 flex items-center gap-2.5 text-[11px] font-mono text-zinc-500">
              <Compass className="w-3.5 h-3.5 text-amber-400/80" />
              <span className="tracking-[0.2em] uppercase">SCROLL TO EXPLORE</span>
            </div>
          </section>

          {/* =====================================================================
              02 / MY JOURNEY
             ===================================================================== */}
          <section
            id="about-chapter-1"
            className="about-reveal-block min-h-[74vh] py-16 sm:py-20 border-b border-white/[0.07] flex flex-col justify-center"
          >
            <div className="max-w-xl">
              <div className="inline-flex items-center gap-2.5 mb-3">
                <span className="w-2 h-2 rounded-full bg-amber-400" />
                <span className="font-mono text-[10px] tracking-[0.28em] text-amber-300 uppercase">
                  02 / MY JOURNEY
                </span>
              </div>

              <h2 className="font-display font-bold tracking-[-0.025em] text-white leading-[1.1] text-[clamp(1.6rem,3.2vw,2.65rem)]">
                Education, internship &amp; growth.
              </h2>

              <div className="mt-7 divide-y divide-white/10 border-y border-white/10">
                {JOURNEY_PHASES.map((phase, idx) => {
                  const isSelected = selectedJourneyIdx === idx;
                  return (
                    <div
                      key={phase.id}
                      onMouseEnter={() => setSelectedJourneyIdx(idx)}
                      onClick={() => setSelectedJourneyIdx(idx)}
                      className={`cursor-pointer py-4 transition-all duration-300 ${
                        isSelected
                          ? 'pl-4 border-l-2 border-amber-400 bg-amber-500/[0.03]'
                          : 'pl-0 hover:pl-2'
                      }`}
                    >
                      <div className="flex flex-wrap items-baseline justify-between gap-2">
                        <div className="flex items-center gap-2.5">
                          <span
                            className={`font-mono text-[10px] tracking-[0.2em] ${
                              isSelected ? 'text-amber-300' : 'text-zinc-500'
                            }`}
                          >
                            /{phase.index}
                          </span>
                          <h3 className="font-display text-base sm:text-lg font-bold text-white">
                            {phase.title}
                          </h3>
                        </div>
                        <span className="font-mono text-[10px] tracking-[0.18em] text-zinc-400">
                          {phase.period}
                        </span>
                      </div>

                      <div className="mt-0.5 font-mono text-[11px] text-amber-300/80">
                        {phase.organization}
                      </div>

                      {isSelected && (
                        <p className="mt-2 text-xs sm:text-sm text-zinc-300 leading-relaxed max-w-lg">
                          {phase.summary}
                        </p>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </section>

          {/* =====================================================================
              03 / MY CRAFT
             ===================================================================== */}
          <section
            id="about-chapter-2"
            className="about-reveal-block min-h-[74vh] py-16 sm:py-20 border-b border-white/[0.07] flex flex-col justify-center"
          >
            <div className="max-w-xl">
              <div className="inline-flex items-center gap-2.5 mb-3">
                <Layers className="w-3.5 h-3.5 text-amber-400" />
                <span className="font-mono text-[10px] tracking-[0.28em] text-amber-300 uppercase">
                  03 / MY CRAFT
                </span>
              </div>

              <h2 className="font-display font-bold tracking-[-0.025em] text-white leading-[1.1] text-[clamp(1.6rem,3.2vw,2.65rem)]">
                Full-stack engineering stack.
              </h2>

              <div className="mt-7 divide-y divide-white/10 border-y border-white/10">
                {CRAFT_LAYERS.map((layer, idx) => {
                  const isActive = hoveredCraftIdx === idx;
                  return (
                    <div
                      key={layer.id}
                      onMouseEnter={() => setHoveredCraftIdx(idx)}
                      onClick={() => setHoveredCraftIdx(idx)}
                      className={`cursor-pointer py-3.5 transition-all duration-300 ${
                        isActive
                          ? 'border-l-2 border-amber-400 bg-amber-500/[0.04] pl-4'
                          : 'pl-0 hover:pl-2'
                      }`}
                    >
                      <div className="flex items-center justify-between gap-4">
                        <div className="flex items-baseline gap-3">
                          <span
                            className={`font-mono text-[10px] tracking-[0.2em] ${
                              isActive ? 'text-amber-300' : 'text-zinc-500'
                            }`}
                          >
                            /{layer.index}
                          </span>
                          <span className="font-display text-base sm:text-lg font-bold text-white">
                            {layer.name}
                          </span>
                        </div>

                        <span className="font-mono text-[10px] tracking-[0.18em] text-amber-300/80 uppercase">
                          {layer.architectureRole}
                        </span>
                      </div>

                      {isActive && (
                        <p className="mt-2 text-xs sm:text-sm text-zinc-300 leading-relaxed max-w-lg">
                          {layer.description}
                        </p>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </section>

          {/* =====================================================================
              04 / MY MINDSET
             ===================================================================== */}
          <section
            id="about-chapter-3"
            className="about-reveal-block min-h-[68vh] pt-16 sm:pt-20 flex flex-col justify-between"
          >
            <div className="max-w-xl">
              <div className="inline-flex items-center gap-2.5 mb-3">
                <Cpu className="w-3.5 h-3.5 text-amber-400" />
                <span className="font-mono text-[10px] tracking-[0.28em] text-amber-300 uppercase">
                  04 / MY MINDSET
                </span>
              </div>

              <h2 className="font-display font-bold tracking-[-0.025em] text-white leading-[1.1] text-[clamp(1.6rem,3.2vw,2.65rem)]">
                Problem-solving &amp; digital craft.
              </h2>

              <div className="mt-7 space-y-5">
                {MINDSET_PILLARS.map((pillar, idx) => {
                  const isActive = selectedMindsetIdx === idx;
                  return (
                    <div
                      key={pillar.id}
                      onMouseEnter={() => setSelectedMindsetIdx(idx)}
                      onClick={() => setSelectedMindsetIdx(idx)}
                      className={`cursor-pointer border-l-2 pl-4 transition-all duration-300 ${
                        isActive ? 'border-amber-400' : 'border-white/15 hover:border-white/40'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <span className="font-mono text-[10px] tracking-[0.22em] text-amber-300">
                          /{pillar.index}
                        </span>
                        <h3 className="font-display text-base sm:text-lg font-bold text-white">
                          {pillar.title}
                        </h3>
                      </div>

                      <p className="mt-1 text-xs sm:text-sm text-zinc-300 leading-relaxed max-w-lg">
                        {pillar.reflection}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="mt-14 pt-8 border-t border-white/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-center gap-2 font-mono text-[10px] tracking-[0.22em] text-zinc-400 uppercase">
                <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                <span>SUJITH K · FULL STACK DEVELOPER</span>
              </div>

              <button
                onClick={onReturn}
                className="group inline-flex items-center gap-2.5 px-5 py-2.5 rounded-full border border-amber-400/40 bg-amber-400/10 hover:bg-amber-400/20 text-amber-200 font-mono text-[11px] tracking-[0.2em] uppercase transition-all duration-300"
              >
                <span>EXIT TO NEXUS</span>
                <ArrowUpRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </button>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default AboutRoom;
