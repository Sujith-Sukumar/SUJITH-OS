import React, { useEffect, useRef, useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import * as THREE from 'three';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import {
  ArrowLeft,
  MapPin,
  Sparkles,
  ArrowDown,
  ArrowUpRight,
  Compass
} from 'lucide-react';
import { experienceData } from '../../../data/experience';
import { workspaceSound } from '../../../utils/workspaceAudio';

gsap.registerPlugin(ScrollTrigger);

interface ExperienceRoomProps {
  onReturn: () => void;
}

export const ExperienceRoom: React.FC<ExperienceRoomProps> = ({ onReturn }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const canvasMountRef = useRef<HTMLDivElement>(null);

  const [activeStage, setActiveStage] = useState<number>(0); // 0 = Prologue, 1 = Ch 01 (ESTA), 2 = Ch 02 (Seclob)
  const [scrollProgress, setScrollProgress] = useState<number>(0);
  const [zCoordinate, setZCoordinate] = useState<string>('00.0');

  // Shared mutable state for the 60fps Three.js render loop
  const sceneStateRef = useRef({
    targetScroll: 0,
    currentScroll: 0,
    mouseX: 0,
    mouseY: 0,
    targetMouseX: 0,
    targetMouseY: 0,
    pulseEnergy: 0,
  });

  const sectionRefs = useRef<(HTMLElement | null)[]>([]);

  const triggerKineticPulse = useCallback(() => {
    sceneStateRef.current.pulseEnergy = 1.6;
    try {
      workspaceSound.playClick();
    } catch {}
  }, []);

  const scrollToStage = useCallback((index: number) => {
    const targetEl = sectionRefs.current[index];
    if (targetEl && scrollRef.current) {
      try {
        workspaceSound.playClick();
      } catch {}
      targetEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, []);

  // --- THREE.JS 3D SPATIAL CORRIDOR & KINETIC MONUMENTS ---
  useEffect(() => {
    const mount = canvasMountRef.current;
    if (!mount) return;

    const width = mount.clientWidth || window.innerWidth;
    const height = mount.clientHeight || window.innerHeight;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color('#050508');
    scene.fog = new THREE.FogExp2('#050508', 0.032);

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 120);
    camera.position.set(0, 0.8, 12);

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      powerPreference: 'high-performance',
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;
    mount.appendChild(renderer.domElement);

    // --- LIGHTING ---
    const ambientLight = new THREE.AmbientLight('#1e1b4b', 1.2);
    scene.add(ambientLight);

    const keyLight = new THREE.PointLight('#8b5cf6', 4.5, 32);
    keyLight.position.set(5, 4, 4);
    scene.add(keyLight);

    const rimLight = new THREE.PointLight('#c084fc', 3.5, 28);
    rimLight.position.set(-5, -2, -16);
    scene.add(rimLight);

    // --- ARCHITECTURAL CORRIDOR RIBS & FLOOR PERSPECTIVE ---
    const corridorGroup = new THREE.Group();
    corridorGroup.position.y = -1.2;
    scene.add(corridorGroup);

    const frameMaterial = new THREE.LineBasicMaterial({
      color: '#4c1d95',
      transparent: true,
      opacity: 0.22,
    });

    // Create perspective portal frames along Z-axis
    for (let i = 0; i < 14; i++) {
      const zPos = 8 - i * 3.2;
      const frameW = 14;
      const frameH = 8;
      const pts = [
        new THREE.Vector3(-frameW / 2, -frameH / 2, zPos),
        new THREE.Vector3(frameW / 2, -frameH / 2, zPos),
        new THREE.Vector3(frameW / 2, frameH / 2, zPos),
        new THREE.Vector3(-frameW / 2, frameH / 2, zPos),
        new THREE.Vector3(-frameW / 2, -frameH / 2, zPos),
      ];
      const geo = new THREE.BufferGeometry().setFromPoints(pts);
      const line = new THREE.Line(geo, frameMaterial);
      corridorGroup.add(line);
    }

    // Subtle floor longitudinal guide lines
    const floorLineMat = new THREE.LineBasicMaterial({
      color: '#6d28d9',
      transparent: true,
      opacity: 0.14,
    });
    for (let x = -12; x <= 12; x += 3) {
      const pts = [
        new THREE.Vector3(x, -4, 12),
        new THREE.Vector3(x, -4, -38),
      ];
      const geo = new THREE.BufferGeometry().setFromPoints(pts);
      corridorGroup.add(new THREE.Line(geo, floorLineMat));
    }

    // --- 3D CAREER TRAJECTORY SPLINE & TRAVELING PULSE ---
    const trajectoryCurve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(0, -3.2, 10),
      new THREE.Vector3(1.5, -2.4, -3.5),   // Station 01: Directly under the paragraph (right-center)
      new THREE.Vector3(-0.5, -3.6, -11),
      new THREE.Vector3(-2.5, -5.0, -19.5), // Station 02: Directly under the paragraph (left-center)
      new THREE.Vector3(0, -5.5, -30),
    ]);

    const tubeGeo = new THREE.TubeGeometry(trajectoryCurve, 120, 0.018, 8, false);
    const tubeMat = new THREE.MeshBasicMaterial({
      color: '#a855f7',
      transparent: true,
      opacity: 0.45,
    });
    const trajectoryMesh = new THREE.Mesh(tubeGeo, tubeMat);
    scene.add(trajectoryMesh);

    // Traveling light orb along the spline
    const pulseOrbGeo = new THREE.SphereGeometry(0.09, 16, 16);
    const pulseOrbMat = new THREE.MeshBasicMaterial({ color: '#f3e8ff' });
    const pulseOrb = new THREE.Mesh(pulseOrbGeo, pulseOrbMat);
    scene.add(pulseOrb);

    // --- MONUMENT 01: ESTA ENTERPRISES (May 2025 – Present) ---
    // Positioned at y = -2.4 so it projects into the lower half of the screen under the paragraph
    const monument1Group = new THREE.Group();
    monument1Group.position.set(1.5, -2.4, -3.5);
    scene.add(monument1Group);

    const coreDarkMat = new THREE.MeshStandardMaterial({
      color: '#0f0a1c',
      roughness: 0.2,
      metalness: 0.85,
    });
    const wireVioletMat = new THREE.MeshBasicMaterial({
      color: '#a855f7',
      wireframe: true,
      transparent: true,
      opacity: 0.65,
    });
    const wireLightMat = new THREE.MeshBasicMaterial({
      color: '#e9d5ff',
      wireframe: true,
      transparent: true,
      opacity: 0.35,
    });

    // Central crystalline octahedron core
    const octaGeo = new THREE.OctahedronGeometry(1.35, 0);
    const octaSolid = new THREE.Mesh(octaGeo, coreDarkMat);
    const octaWire = new THREE.Mesh(new THREE.OctahedronGeometry(1.38, 1), wireVioletMat);
    monument1Group.add(octaSolid);
    monument1Group.add(octaWire);

    // Concentric kinetic gyroscope rings
    const ring1Geo = new THREE.TorusGeometry(2.15, 0.018, 16, 100);
    const ring1 = new THREE.Mesh(ring1Geo, new THREE.MeshBasicMaterial({ color: '#c084fc', transparent: true, opacity: 0.7 }));
    ring1.rotation.x = Math.PI / 3;
    monument1Group.add(ring1);

    const ring2Geo = new THREE.TorusGeometry(2.65, 0.012, 16, 100);
    const ring2 = new THREE.Mesh(ring2Geo, wireLightMat);
    ring2.rotation.y = Math.PI / 4;
    monument1Group.add(ring2);

    // Orbiting satellite shards
    const satellites1 = new THREE.Group();
    const shardGeo = new THREE.OctahedronGeometry(0.14, 0);
    const shardMat = new THREE.MeshBasicMaterial({ color: '#e9d5ff' });
    for (let s = 0; s < 6; s++) {
      const angle = (s / 6) * Math.PI * 2;
      const shard = new THREE.Mesh(shardGeo, shardMat);
      shard.position.set(Math.cos(angle) * 2.15, Math.sin(angle) * 2.15, 0);
      satellites1.add(shard);
    }
    satellites1.rotation.x = Math.PI / 3;
    monument1Group.add(satellites1);

    // --- MONUMENT 02: SECLOB TECHNOLOGIES (Dec 2024 – May 2025) ---
    // Positioned at y = -5.0 in Prologue so it projects cleanly under the paragraph
    const monument2Group = new THREE.Group();
    monument2Group.position.set(-2.5, -5.0, -19.5);
    scene.add(monument2Group);

    // Precision architectural Icosahedron + Torus lattice
    const icosaSolid = new THREE.Mesh(new THREE.IcosahedronGeometry(1.25, 0), coreDarkMat);
    const icosaWire = new THREE.Mesh(new THREE.IcosahedronGeometry(1.3, 1), wireVioletMat);
    monument2Group.add(icosaSolid);
    monument2Group.add(icosaWire);

    const latticeGeo = new THREE.TorusKnotGeometry(1.85, 0.02, 120, 12, 2, 3);
    const latticeMesh = new THREE.Mesh(
      latticeGeo,
      new THREE.MeshBasicMaterial({ color: '#a855f7', wireframe: true, transparent: true, opacity: 0.45 })
    );
    monument2Group.add(latticeMesh);

    const outerHalo = new THREE.Mesh(
      new THREE.TorusGeometry(2.55, 0.015, 16, 100),
      new THREE.MeshBasicMaterial({ color: '#d8b4fe', transparent: true, opacity: 0.5 })
    );
    outerHalo.rotation.x = -Math.PI / 3.5;
    monument2Group.add(outerHalo);

    // --- STARFIELD / SPATIAL DUST PARTICLES ---
    const particleCount = 420;
    const positions = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 26;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 14;
      positions[i * 3 + 2] = 12 - Math.random() * 48;
    }
    const particleGeo = new THREE.BufferGeometry();
    particleGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    const particleMat = new THREE.PointsMaterial({
      color: '#c4b5fd',
      size: 0.055,
      transparent: true,
      opacity: 0.55,
    });
    const particles = new THREE.Points(particleGeo, particleMat);
    scene.add(particles);

    // --- POINTER PARALLAX LISTENER ---
    const handlePointerMove = (e: MouseEvent) => {
      const nx = (e.clientX / window.innerWidth) * 2 - 1;
      const ny = -(e.clientY / window.innerHeight) * 2 + 1;
      sceneStateRef.current.targetMouseX = nx;
      sceneStateRef.current.targetMouseY = ny;
    };
    window.addEventListener('mousemove', handlePointerMove, { passive: true });

    // --- RESIZE HANDLER ---
    const handleResize = () => {
      if (!mount) return;
      const w = mount.clientWidth || window.innerWidth;
      const h = mount.clientHeight || window.innerHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener('resize', handleResize);

    // --- 60FPS ANIMATION LOOP ---
    let reqId: number;
    const clock = new THREE.Clock();

    const animate = () => {
      reqId = requestAnimationFrame(animate);
      const elapsed = clock.getElapsedTime();
      const state = sceneStateRef.current;

      // Smoothly damp scroll progress & mouse coordinates
      state.currentScroll += (state.targetScroll - state.currentScroll) * 0.065;
      state.mouseX += (state.targetMouseX - state.mouseX) * 0.06;
      state.mouseY += (state.targetMouseY - state.mouseY) * 0.06;
      state.pulseEnergy *= 0.94;

      const p = THREE.MathUtils.clamp(state.currentScroll, 0, 1);

      // Camera flies from Z = 11.5 (Prologue) -> Z = 2.8 (Monument 1 at -3.5) -> Z = -13.2 (Monument 2 at -19.5)
      const targetCamZ = THREE.MathUtils.lerp(11.5, -13.2, p);
      const isNarrow = window.innerWidth < 768;

      // In Prologue (p=0), X is centered under the paragraph (1.4 and -2.4); as user scrolls, glides to the side columns
      monument1Group.position.x = isNarrow ? 0 : THREE.MathUtils.lerp(1.4, 3.1, Math.min(1, p * 2.5));
      monument2Group.position.x = isNarrow ? 0 : THREE.MathUtils.lerp(-2.4, -3.1, Math.min(1, p * 1.5));

      const swayX = Math.sin(p * Math.PI * 2) * (isNarrow ? 0 : 0.3);
      camera.position.z = targetCamZ;
      camera.position.x = swayX + state.mouseX * 0.45;
      camera.position.y = 0.8 + state.mouseY * 0.25;

      // Keep camera sightline horizontal at y = 0.8 so negative Y objects project cleanly into the bottom half of the viewport
      camera.lookAt(
        swayX * 0.5 + state.mouseX * 0.6,
        0.8 + state.mouseY * 0.25,
        targetCamZ - 9
      );

      // Move traveling pulse orb along trajectory
      const orbT = (elapsed * 0.11 + p * 0.5) % 1;
      const orbPos = trajectoryCurve.getPointAt(orbT);
      pulseOrb.position.copy(orbPos);

      // Animate Monument 01 (ESTA ENTERPRISES) — sits at y = -2.4 in Prologue (directly under paragraph)
      const speedBoost = 1 + state.pulseEnergy * 4;
      octaSolid.rotation.y += 0.006 * speedBoost;
      octaSolid.rotation.x += 0.004 * speedBoost;
      octaWire.rotation.y -= 0.008 * speedBoost;
      ring1.rotation.z += 0.01 * speedBoost;
      ring2.rotation.x -= 0.007 * speedBoost;
      satellites1.rotation.z -= 0.012 * speedBoost;
      const m1BaseY = THREE.MathUtils.lerp(-2.4, 0.5, Math.min(1, p * 2.2));
      monument1Group.position.y = m1BaseY + Math.sin(elapsed * 1.4) * 0.1;

      // Scale down slightly in Prologue so it fits comfortably between the paragraph and bottom bar
      const baseScale = THREE.MathUtils.lerp(0.72, 0.92, Math.min(1, p * 2));
      const mScale = baseScale + state.pulseEnergy * 0.12;
      monument1Group.scale.setScalar(mScale);
      monument2Group.scale.setScalar(mScale);

      // Animate Monument 02 (Seclob Technologies) — sits at y = -5.0 in Prologue (directly under paragraph)
      icosaSolid.rotation.y -= 0.007 * speedBoost;
      icosaWire.rotation.x += 0.006 * speedBoost;
      latticeMesh.rotation.z += 0.005 * speedBoost;
      latticeMesh.rotation.y += 0.004 * speedBoost;
      outerHalo.rotation.z -= 0.009 * speedBoost;
      const m2BaseY = THREE.MathUtils.lerp(-5.0, 0.5, Math.max(0, (p - 0.35) * 1.6));
      monument2Group.position.y = m2BaseY + Math.cos(elapsed * 1.3) * 0.1;

      // Dynamic key light follows camera depth
      keyLight.position.z = targetCamZ - 3;

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      cancelAnimationFrame(reqId);
      window.removeEventListener('mousemove', handlePointerMove);
      window.removeEventListener('resize', handleResize);
      renderer.dispose();
      if (mount.contains(renderer.domElement)) {
        mount.removeChild(renderer.domElement);
      }
    };
  }, []);

  // --- SCROLL CHOREOGRAPHY & TELEMETRY SYNC ---
  useEffect(() => {
    workspaceSound.playOpen();

    const scroller = scrollRef.current;
    if (!scroller) return;

    const handleScroll = () => {
      const maxScroll = scroller.scrollHeight - scroller.clientHeight;
      const ratio = maxScroll > 0 ? scroller.scrollTop / maxScroll : 0;
      sceneStateRef.current.targetScroll = ratio;
      setScrollProgress(ratio);

      // Map ratio to simulated Z-depth coordinate (-00.0m to -24.0m)
      const zVal = (ratio * -24).toFixed(1);
      setZCoordinate(zVal);

      if (ratio < 0.26) {
        setActiveStage(0);
      } else if (ratio < 0.72) {
        setActiveStage(1);
      } else {
        setActiveStage(2);
      }
    };

    scroller.addEventListener('scroll', handleScroll, { passive: true });

    const ctx = gsap.context(() => {
      gsap.fromTo(
        containerRef.current,
        { opacity: 0 },
        { opacity: 1, duration: 0.9, ease: 'power3.out' }
      );

      // Choreographed reveal for each chapter's architectural typography
      const chapters = gsap.utils.toArray<HTMLElement>('.spatial-chapter');
      chapters.forEach((chapter) => {
        const headline = chapter.querySelectorAll('.reveal-headline');
        const meta = chapter.querySelectorAll('.reveal-meta');
        const ledger = chapter.querySelectorAll('.reveal-ledger');

        gsap.fromTo(
          headline,
          { y: 70, opacity: 0, skewY: 2 },
          {
            y: 0,
            opacity: 1,
            skewY: 0,
            duration: 1,
            stagger: 0.1,
            ease: 'power4.out',
            scrollTrigger: {
              trigger: chapter,
              scroller,
              start: 'top 76%',
              toggleActions: 'play none none reverse',
            },
          }
        );

        gsap.fromTo(
          meta,
          { y: 30, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.8,
            stagger: 0.08,
            delay: 0.15,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: chapter,
              scroller,
              start: 'top 76%',
              toggleActions: 'play none none reverse',
            },
          }
        );

        gsap.fromTo(
          ledger,
          { x: -30, opacity: 0 },
          {
            x: 0,
            opacity: 1,
            duration: 0.85,
            stagger: 0.14,
            delay: 0.25,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: chapter,
              scroller,
              start: 'top 72%',
              toggleActions: 'play none none reverse',
            },
          }
        );
      });
    }, containerRef);

    return () => {
      scroller.removeEventListener('scroll', handleScroll);
      ctx.revert();
    };
  }, []);

  const handleReturn = () => {
    workspaceSound.playClose();
    onReturn();
  };

  const estaRole = experienceData[0];
  const seclobRole = experienceData[1];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      ref={containerRef}
      className="fixed inset-0 z-50 flex flex-col bg-[#050508] text-white overflow-hidden select-none font-sans"
    >
      {/* 1. REAL-TIME 3D WEBGL SPATIAL CORRIDOR CANVAS */}
      <div
        ref={canvasMountRef}
        onClick={triggerKineticPulse}
        className="absolute inset-0 z-0 cursor-crosshair"
        title="Click to pulse 3D kinetic field"
      />

      {/* Subtle cinematic vignette & film grain feel */}
      <div className="absolute inset-0 z-10 pointer-events-none bg-[radial-gradient(circle_at_center,transparent_35%,rgba(5,5,8,0.82)_100%)]" />

      {/* 2. DEDICATED TOP NAVIGATION BAR (Content scrolls strictly below this bar) */}
      <header className="relative z-30 shrink-0 flex items-center justify-between px-6 py-4 md:px-12 md:py-5 border-b border-purple-500/20 bg-[#050508]/85 backdrop-blur-xl">
        <button
          onClick={handleReturn}
          className="flex items-center gap-3 px-4 py-2 text-xs font-mono tracking-[0.2em] uppercase text-zinc-200 border border-white/15 bg-white/[0.03] rounded-full hover:border-purple-400 hover:text-white transition-all duration-300 group cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5 text-purple-400 transition-transform group-hover:-translate-x-1" />
          <span>Return to Nexus</span>
        </button>

        {/* Live Spatial Telemetry Strip */}
        <div className="hidden md:flex items-center gap-6 text-[11px] font-mono tracking-[0.25em] text-zinc-400">
          <span>CHAMBER 04 // SPATIAL CHRONOGRAPH</span>
          <span className="w-1.5 h-1.5 rounded-full bg-purple-400 animate-pulse" />
          <span className="text-purple-300">Z-AXIS: {zCoordinate}m</span>
        </div>

        <button
          onClick={triggerKineticPulse}
          className="flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-purple-500/30 bg-purple-950/30 text-[11px] font-mono tracking-[0.18em] text-purple-300 hover:bg-purple-500/20 hover:border-purple-400 transition-all cursor-pointer"
        >
          <Sparkles className="w-3 h-3 text-purple-400" />
          <span>PULSE 3D FIELD</span>
        </button>
      </header>

      {/* 3. FIXED RIGHT-EDGE SPATIAL COMPASS / CHAPTER SCRUBBER */}
      <aside
        aria-label="Career Chapter Navigation"
        className="fixed right-6 md:right-10 top-1/2 -translate-y-1/2 z-30 hidden sm:flex flex-col items-end gap-6"
      >
        {[
          { idx: 0, code: '00', label: 'HORIZON' },
          { idx: 1, code: '01', label: 'ESTA ENTERPRISES' },
          { idx: 2, code: '02', label: 'SECLOB TECH' },
        ].map((nav) => {
          const isCurrent = activeStage === nav.idx;
          return (
            <button
              key={nav.code}
              onClick={() => scrollToStage(nav.idx)}
              className="group flex items-center gap-3 text-right cursor-pointer focus:outline-none"
            >
              <span
                className={`text-[10px] font-mono tracking-[0.25em] uppercase transition-all duration-300 ${
                  isCurrent
                    ? 'text-white font-bold opacity-100 translate-x-0'
                    : 'text-zinc-500 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0'
                }`}
              >
                {nav.label}
              </span>
              <span
                className={`text-xs font-mono transition-colors ${
                  isCurrent ? 'text-purple-400 font-bold' : 'text-zinc-600 group-hover:text-zinc-300'
                }`}
              >
                {nav.code}
              </span>
              <span
                className={`h-[1.5px] transition-all duration-500 ${
                  isCurrent ? 'w-8 bg-purple-400 shadow-[0_0_10px_#a855f7]' : 'w-3 bg-zinc-700 group-hover:w-5 group-hover:bg-zinc-400'
                }`}
              />
            </button>
          );
        })}

        {/* Continuous Scroll Progress Bar */}
        <div className="w-[1.5px] h-24 bg-white/10 relative overflow-hidden mt-2">
          <div
            className="w-full bg-purple-400 transition-all duration-150"
            style={{ height: `${Math.min(100, Math.max(8, scrollProgress * 100))}%` }}
          />
        </div>
      </aside>

      {/* 4. SCROLL-DRIVEN SPATIAL STORYTELLING VIEWPORT (Strictly below header) */}
      <div
        ref={scrollRef}
        className="relative z-20 flex-1 w-full overflow-y-auto overflow-x-hidden scroll-smooth"
      >
        {/* =================================================================
            SCENE 00: PROLOGUE — THE SPATIAL HORIZON
        ================================================================== */}
        <section
          ref={(el) => {
            sectionRefs.current[0] = el;
          }}
          className="relative min-h-full w-full flex flex-col justify-between px-6 sm:px-12 md:px-20 pt-6 sm:pt-8 md:pt-10 pb-12"
        >
          <div className="max-w-7xl w-full mx-auto">
            <div className="flex items-center gap-3 mb-4">
              <Compass className="w-4 h-4 text-purple-400 animate-spin" style={{ animationDuration: '14s' }} />
              <span className="text-xs font-mono tracking-[0.35em] text-purple-300/90 uppercase">
                2024 — PRESENT // KERALA, INDIA
              </span>
            </div>

            {/* Monumental Asymmetric Split Display Title */}
            <div className="space-y-1 sm:space-y-2">
              <h1 className="text-[clamp(2.2rem,5.5vw,4.75rem)] font-black tracking-tighter leading-[0.92] uppercase text-white">
                ENGINEERING
              </h1>
              <div className="flex flex-col md:flex-row md:items-baseline gap-4 md:gap-10">
                <span
                  className="text-[clamp(2.2rem,5.5vw,4.75rem)] font-black tracking-tighter leading-[0.92] uppercase text-transparent"
                  style={{ WebkitTextStroke: '1.5px rgba(192, 132, 252, 0.75)' }}
                >
                  ODYSSEY
                </span>
                <p className="max-w-sm text-xs sm:text-sm font-mono text-zinc-400 tracking-wide leading-relaxed">
                  Scroll to fly through the 3D spatial corridor — tracing my evolution from foundational MERN architecture to production enterprise &amp; AI systems.
                </p>
              </div>
            </div>
          </div>

          {/* Bottom Prologue Scroll Cue & Quick Jump */}
          <div className="max-w-7xl w-full mx-auto flex items-end justify-between border-t border-white/10 pt-6 mt-12">
            <button
              onClick={() => scrollToStage(1)}
              className="group flex items-center gap-3 text-xs font-mono tracking-[0.25em] uppercase text-zinc-300 hover:text-purple-300 transition-colors cursor-pointer"
            >
              <span className="w-8 h-8 rounded-full border border-white/20 flex items-center justify-center group-hover:border-purple-400 transition-colors">
                <ArrowDown className="w-3.5 h-3.5 text-purple-400 animate-bounce" />
              </span>
              <span>Enter Chapter 01 // ESTA Enterprises</span>
            </button>

            <div className="text-right font-mono text-[11px] text-zinc-500 tracking-[0.2em]">
              02 PRODUCTION CHAPTERS
            </div>
          </div>
        </section>

        {/* =================================================================
            SCENE 01: CHAPTER 01 — ESTA ENTERPRISES (MAY 2025 TO PRESENT)
            Left-aligned architectural typography; 3D Neural Gyroscope hovers on the right
        ================================================================== */}
        <section
          ref={(el) => {
            sectionRefs.current[1] = el;
          }}
          className="spatial-chapter relative min-h-full w-full flex items-center px-6 sm:px-12 md:px-20 pt-8 sm:pt-10 md:pt-12 pb-16"
        >
          {/* Monumental Background Hollow Numeral */}
          <div
            aria-hidden="true"
            className="pointer-events-none select-none absolute left-4 sm:left-12 top-1/2 -translate-y-1/2 text-[clamp(12rem,28vw,26rem)] font-black font-mono leading-none text-transparent opacity-25"
            style={{ WebkitTextStroke: '1.5px rgba(168, 85, 247, 0.4)' }}
          >
            01
          </div>

          <div className="relative z-10 max-w-7xl w-full mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left 7 Columns: Editorial Typography & Minimal Ledger */}
            <div className="lg:col-span-7 space-y-8">
              {/* Dates & Coordinate Strip */}
              <div className="reveal-meta flex flex-wrap items-center gap-4">
                <span className="px-3 py-1 rounded-full bg-purple-500/15 border border-purple-400/40 text-xs font-mono font-semibold tracking-[0.2em] text-purple-200 uppercase">
                  {estaRole.period}
                </span>
                <span className="h-px w-10 bg-purple-500/40" />
                <span className="text-xs font-mono tracking-[0.25em] text-emerald-400 uppercase flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  PRESENT FRONTIER
                </span>
              </div>

              {/* Role & Company Lockup */}
              <div className="space-y-3">
                <h2 className="reveal-headline text-[clamp(1.75rem,3.6vw,3.25rem)] font-black tracking-tight leading-[1.02] text-white uppercase">
                  {estaRole.role}
                </h2>

                <div className="reveal-meta flex flex-wrap items-center gap-x-5 gap-y-2 pt-1">
                  <span className="text-xl sm:text-2xl md:text-3xl font-mono font-bold tracking-wide text-purple-300">
                    {estaRole.company}
                  </span>
                  <span className="text-zinc-600 font-mono">/</span>
                  <span className="inline-flex items-center gap-1.5 text-sm sm:text-base font-mono text-zinc-300">
                    <MapPin className="w-4 h-4 text-purple-400" />
                    <span>{estaRole.location}</span>
                  </span>
                </div>
              </div>

              {/* Minimal 2-Highlight Architectural Ledger (No boxes/cards) */}
              <div className="pt-4 border-t border-white/15 divide-y divide-white/10 max-w-2xl">
                {estaRole.responsibilities.slice(0, 2).map((highlight, idx) => (
                  <div
                    key={idx}
                    className="reveal-ledger py-5 flex items-baseline gap-6 group"
                  >
                    <span className="text-xs font-mono font-bold tracking-[0.2em] text-purple-400 shrink-0">
                      0{idx + 1} /
                    </span>
                    <p className="text-sm sm:text-base md:text-lg text-zinc-200 font-light leading-relaxed group-hover:text-white transition-colors">
                      {highlight}
                    </p>
                  </div>
                ))}
              </div>

              {/* Next Chapter Transition Trigger */}
              <div className="reveal-meta pt-2">
                <button
                  onClick={() => scrollToStage(2)}
                  className="inline-flex items-center gap-2 text-xs font-mono tracking-[0.22em] uppercase text-zinc-400 hover:text-purple-300 transition-colors cursor-pointer"
                >
                  <span>Proceed to Chapter 02 // Seclob Technologies</span>
                  <ArrowDown className="w-3.5 h-3.5 text-purple-400" />
                </button>
              </div>
            </div>

            {/* Right 5 Columns: Open Spatial Viewport Window for 3D Monument 01 */}
            <div className="lg:col-span-5 hidden lg:flex flex-col items-end justify-end h-full pointer-events-none">
              <div className="p-4 border-l border-purple-500/30 text-right space-y-1 bg-black/20 backdrop-blur-xs">
                <div className="text-[10px] font-mono tracking-[0.25em] text-purple-400 uppercase">
                  MONUMENT 01 // NEURAL GYROSCOPE
                </div>
                <div className="text-xs font-mono text-zinc-400">
                  {estaRole.systemLogCode}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* =================================================================
            SCENE 02: CHAPTER 02 — SECLOB TECHNOLOGIES (DEC 2024 TO MAY 2025)
            Right-aligned architectural typography; 3D Lattice Core hovers on the left
        ================================================================== */}
        <section
          ref={(el) => {
            sectionRefs.current[2] = el;
          }}
          className="spatial-chapter relative min-h-full w-full flex items-center px-6 sm:px-12 md:px-20 pt-8 sm:pt-10 md:pt-12 pb-16"
        >
          {/* Monumental Background Hollow Numeral on Right */}
          <div
            aria-hidden="true"
            className="pointer-events-none select-none absolute right-4 sm:right-12 top-1/2 -translate-y-1/2 text-[clamp(12rem,28vw,26rem)] font-black font-mono leading-none text-transparent opacity-25"
            style={{ WebkitTextStroke: '1.5px rgba(192, 132, 252, 0.4)' }}
          >
            02
          </div>

          <div className="relative z-10 max-w-7xl w-full mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left 5 Columns: Open Spatial Viewport Window for 3D Monument 02 */}
            <div className="lg:col-span-5 hidden lg:flex flex-col items-start justify-end h-full pointer-events-none">
              <div className="p-4 border-l border-purple-500/30 text-left space-y-1 bg-black/20 backdrop-blur-xs">
                <div className="text-[10px] font-mono tracking-[0.25em] text-purple-400 uppercase">
                  MONUMENT 02 // LATTICE CORE
                </div>
                <div className="text-xs font-mono text-zinc-400">
                  {seclobRole.systemLogCode}
                </div>
              </div>
            </div>

            {/* Right 7 Columns: Editorial Typography & Minimal Ledger */}
            <div className="lg:col-span-7 space-y-8">
              {/* Dates & Coordinate Strip */}
              <div className="reveal-meta flex flex-wrap items-center gap-4">
                <span className="px-3 py-1 rounded-full bg-purple-500/15 border border-purple-400/40 text-xs font-mono font-semibold tracking-[0.2em] text-purple-200 uppercase">
                  {seclobRole.period}
                </span>
                <span className="h-px w-10 bg-purple-500/40" />
                <span className="text-xs font-mono tracking-[0.25em] text-purple-300 uppercase">
                  FOUNDATIONAL CHAPTER
                </span>
              </div>

              {/* Role & Company Lockup */}
              <div className="space-y-3">
                <h2 className="reveal-headline text-[clamp(1.65rem,3.4vw,3rem)] font-black tracking-tight leading-[1.02] text-white uppercase">
                  {seclobRole.role}
                </h2>

                <div className="reveal-meta flex flex-wrap items-center gap-x-5 gap-y-2 pt-1">
                  <span className="text-xl sm:text-2xl md:text-3xl font-mono font-bold tracking-wide text-purple-300">
                    {seclobRole.company}
                  </span>
                  <span className="text-zinc-600 font-mono">/</span>
                  <span className="inline-flex items-center gap-1.5 text-sm sm:text-base font-mono text-zinc-300">
                    <MapPin className="w-4 h-4 text-purple-400" />
                    <span>{seclobRole.location}</span>
                  </span>
                </div>
              </div>

              {/* Minimal 2-Highlight Architectural Ledger (No boxes/cards) */}
              <div className="pt-4 border-t border-white/15 divide-y divide-white/10 max-w-2xl">
                {seclobRole.responsibilities.slice(0, 2).map((highlight, idx) => (
                  <div
                    key={idx}
                    className="reveal-ledger py-5 flex items-baseline gap-6 group"
                  >
                    <span className="text-xs font-mono font-bold tracking-[0.2em] text-purple-400 shrink-0">
                      0{idx + 1} /
                    </span>
                    <p className="text-sm sm:text-base md:text-lg text-zinc-200 font-light leading-relaxed group-hover:text-white transition-colors">
                      {highlight}
                    </p>
                  </div>
                ))}
              </div>

              {/* Horizon Footer Navigation */}
              <div className="reveal-meta pt-6 flex flex-wrap items-center justify-between gap-4 border-t border-white/10 max-w-2xl">
                <button
                  onClick={() => scrollToStage(0)}
                  className="text-xs font-mono tracking-[0.2em] uppercase text-zinc-400 hover:text-white transition-colors cursor-pointer"
                >
                  &uarr; Return to Horizon Top
                </button>

                <button
                  onClick={handleReturn}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-purple-600 hover:bg-purple-500 text-white text-xs font-mono font-bold tracking-[0.2em] uppercase transition-all shadow-[0_0_25px_rgba(147,51,234,0.4)] cursor-pointer"
                >
                  <span>Exit to 3D Nexus</span>
                  <ArrowUpRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </section>
      </div>
    </motion.div>
  );
};

export default ExperienceRoom;
