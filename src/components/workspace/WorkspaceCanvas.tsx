import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import gsap from 'gsap';
import { useWorkspaceStore } from '../../store/workspaceStore';
import { workspaceSound } from '../../utils/workspaceAudio';

export const WorkspaceCanvas: React.FC = () => {
  const mountRef = useRef<HTMLDivElement>(null);
  const {
    activeRoom,
    cameraMode,
    deskLampOn,
    setHoveredTarget,
    setDoorProximity,
    setActiveRoom,
    setCameraMode,
    toggleDeskLamp,
  } = useWorkspaceStore();

  const stateRef = useRef({
    activeRoom,
    cameraMode,
    deskLampOn,
  });
  const hoveredTargetRef = useRef<string | null>(null);
  const lastDispatchedHoverRef = useRef<string | null>(null);

  useEffect(() => {
    stateRef.current = { activeRoom, cameraMode, deskLampOn };
  }, [activeRoom, cameraMode, deskLampOn]);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    // --- SCENE SETUP ---
    const scene = new THREE.Scene();
    scene.background = new THREE.Color('#0b0d12');
    scene.fog = new THREE.FogExp2('#0b0d12', 0.036);

    const width = container.clientWidth;
    const height = container.clientHeight;

    const camera = new THREE.PerspectiveCamera(38, width / height, 0.1, 100);

    // Studio camera target & balanced framing
    const overviewLookAt = new THREE.Vector3(-0.25, 1.25, 0.2);
    const baseOverviewPos = new THREE.Vector3(5.3, 4.25, 6.1);
    const overviewPos = baseOverviewPos.clone();
    let isArriving = true;

    const updateCameraDistance = () => {
      const aspect = container.clientWidth / container.clientHeight;
      camera.aspect = aspect;
      const zoomFactor = aspect < 1.0 ? Math.max(1.18, 0.95 / aspect) : 1.0;
      overviewPos.copy(baseOverviewPos).multiplyScalar(zoomFactor);
      if (stateRef.current.cameraMode === 'overview' && !isArriving) {
        camera.position.copy(overviewPos);
        camera.lookAt(overviewLookAt);
      }
      camera.updateProjectionMatrix();
    };
    updateCameraDistance();

    // Start slightly elevated for the kinematic arrival glide when loader opens
    camera.position.set(overviewPos.x * 1.22, overviewPos.y * 1.25, overviewPos.z * 1.22);
    camera.lookAt(overviewLookAt);

    const renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: 'high-performance' });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.12;
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    container.appendChild(renderer.domElement);

    // --- LIGHTING ---
    const ambientLight = new THREE.AmbientLight('#b8c4d4', 0.55);
    scene.add(ambientLight);

    // Warm architectural key light casting soft studio shadows
    const sunLight = new THREE.DirectionalLight('#ffe4c4', 1.9);
    sunLight.position.set(6.5, 11.5, 5.5);
    sunLight.castShadow = true;
    sunLight.shadow.mapSize.width = 2048;
    sunLight.shadow.mapSize.height = 2048;
    sunLight.shadow.camera.near = 1;
    sunLight.shadow.camera.far = 25;
    sunLight.shadow.camera.left = -7;
    sunLight.shadow.camera.right = 7;
    sunLight.shadow.camera.top = 7;
    sunLight.shadow.camera.bottom = -7;
    sunLight.shadow.bias = -0.0005;
    scene.add(sunLight);

    // Subtle cool rim fill from right
    const coolRim = new THREE.PointLight('#38bdf8', 0.45, 16);
    coolRim.position.set(4.5, 3.2, -1.5);
    scene.add(coolRim);

    // Warm ambient fill near door & left wall
    const warmFill = new THREE.PointLight('#f59e0b', 0.75, 14);
    warmFill.position.set(-2.2, 2.8, 1.8);
    scene.add(warmFill);

    // --- MATERIALS ---
    const floorMat = new THREE.MeshStandardMaterial({
      color: '#151820',
      roughness: 0.82,
      metalness: 0.08,
    });

    const wallMat = new THREE.MeshStandardMaterial({
      color: '#12151c',
      roughness: 0.9,
    });

    const woodMat = new THREE.MeshStandardMaterial({
      color: '#43291d',
      roughness: 0.58,
      metalness: 0.05,
    });

    const darkMetalMat = new THREE.MeshStandardMaterial({
      color: '#222631',
      roughness: 0.38,
      metalness: 0.68,
    });

    const brassMat = new THREE.MeshStandardMaterial({
      color: '#d4af37',
      roughness: 0.28,
      metalness: 0.82,
    });

    // --- ROOM ARCHITECTURE ---
    const floor = new THREE.Mesh(new THREE.PlaneGeometry(20, 20), floorMat);
    floor.rotation.x = -Math.PI / 2;
    floor.receiveShadow = true;
    scene.add(floor);

    // Subtle architectural floor grid lines near desk
    const studioGrid = new THREE.GridHelper(12, 24, 0x2a303c, 0x1c2029);
    const gridMat = studioGrid.material as THREE.Material;
    gridMat.transparent = true;
    gridMat.opacity = 0.25;
    studioGrid.position.set(0, 0.001, 0);
    scene.add(studioGrid);

    // Back Wall
    const backWall = new THREE.Mesh(new THREE.BoxGeometry(18, 8, 0.4), wallMat);
    backWall.position.set(0, 4, -4.2);
    backWall.receiveShadow = true;
    scene.add(backWall);

    // Left Wall
    const leftWall = new THREE.Mesh(new THREE.BoxGeometry(0.4, 8, 18), wallMat);
    leftWall.position.set(-6.5, 4, 0);
    leftWall.receiveShadow = true;
    scene.add(leftWall);

    // Baseboards (Back & Left)
    const baseboardBack = new THREE.Mesh(new THREE.BoxGeometry(18, 0.18, 0.08), darkMetalMat);
    baseboardBack.position.set(0, 0.09, -3.96);
    scene.add(baseboardBack);

    const baseboardLeft = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.18, 18), darkMetalMat);
    baseboardLeft.position.set(-6.26, 0.09, 0);
    scene.add(baseboardLeft);

    // --- ARCHITECTURAL BLUEPRINT SCHEMATIC ON BACK WALL ---
    const frameGroup = new THREE.Group();
    frameGroup.position.set(2.15, 3.15, -3.96);
    scene.add(frameGroup);

    const artFrame = new THREE.Mesh(
      new THREE.BoxGeometry(2.5, 1.45, 0.05),
      new THREE.MeshStandardMaterial({ color: '#1e222d', roughness: 0.4, metalness: 0.5 })
    );
    artFrame.castShadow = true;
    frameGroup.add(artFrame);

    // Procedural architectural blueprint canvas
    const bpCanvas = document.createElement('canvas');
    bpCanvas.width = 640;
    bpCanvas.height = 360;
    const bpCtx = bpCanvas.getContext('2d')!;
    bpCtx.fillStyle = '#0d111a';
    bpCtx.fillRect(0, 0, 640, 360);

    // Fine blueprint grid
    bpCtx.strokeStyle = 'rgba(148, 163, 184, 0.08)';
    bpCtx.lineWidth = 1;
    for (let gx = 0; gx < 640; gx += 32) {
      bpCtx.beginPath();
      bpCtx.moveTo(gx, 0);
      bpCtx.lineTo(gx, 360);
      bpCtx.stroke();
    }
    for (let gy = 0; gy < 360; gy += 32) {
      bpCtx.beginPath();
      bpCtx.moveTo(0, gy);
      bpCtx.lineTo(640, gy);
      bpCtx.stroke();
    }

    // Technical border & schematic diagram
    bpCtx.strokeStyle = 'rgba(245, 158, 11, 0.35)';
    bpCtx.lineWidth = 1.5;
    bpCtx.strokeRect(20, 20, 600, 320);

    // Isometric wireframe schematic nodes inside blueprint
    bpCtx.strokeStyle = 'rgba(56, 189, 248, 0.45)';
    bpCtx.beginPath();
    bpCtx.arc(190, 180, 64, 0, Math.PI * 2);
    bpCtx.stroke();
    bpCtx.beginPath();
    bpCtx.arc(190, 180, 36, 0, Math.PI * 2);
    bpCtx.stroke();

    // Connecting architecture lines
    bpCtx.strokeStyle = 'rgba(245, 158, 11, 0.55)';
    bpCtx.beginPath();
    bpCtx.moveTo(254, 180);
    bpCtx.lineTo(360, 120);
    bpCtx.lineTo(490, 120);
    bpCtx.moveTo(254, 180);
    bpCtx.lineTo(360, 180);
    bpCtx.lineTo(490, 180);
    bpCtx.moveTo(254, 180);
    bpCtx.lineTo(360, 240);
    bpCtx.lineTo(490, 240);
    bpCtx.stroke();

    bpCtx.fillStyle = '#94a3b8';
    bpCtx.font = '13px monospace';
    bpCtx.fillText('ARCH // FULL-STACK SYSTEM TOPOLOGY', 38, 48);
    bpCtx.fillStyle = '#f59e0b';
    bpCtx.fillText('REACT · NEXT.JS · NODE · MONGODB', 38, 320);
    bpCtx.fillStyle = '#cbd5e1';
    bpCtx.fillText('[CLIENT UI]', 500, 124);
    bpCtx.fillText('[REST / WS]', 500, 184);
    bpCtx.fillText('[DATA CORE]', 500, 244);

    const bpTex = new THREE.CanvasTexture(bpCanvas);
    const artCanvas = new THREE.Mesh(
      new THREE.PlaneGeometry(2.36, 1.32),
      new THREE.MeshBasicMaterial({ map: bpTex })
    );
    artCanvas.position.z = 0.028;
    frameGroup.add(artCanvas);

    // --- DOOR PORTAL TO NEXUS ("01 // ENTER") ---
    const doorX = -2.2;
    const doorZ = -3.9;
    const doorGroup = new THREE.Group();
    doorGroup.position.set(doorX, 0, doorZ);
    scene.add(doorGroup);

    const frameWidth = 2.0;
    const frameHeight = 3.5;
    const frameThickness = 0.22;

    const doorArchitrave = new THREE.Mesh(
      new THREE.BoxGeometry(frameWidth, frameHeight, frameThickness),
      new THREE.MeshStandardMaterial({ color: '#241b16', roughness: 0.65 })
    );
    doorArchitrave.position.set(0, frameHeight / 2, 0);
    doorArchitrave.castShadow = true;
    doorGroup.add(doorArchitrave);

    // Inner dark chamber cutout
    const portalChamber = new THREE.Mesh(
      new THREE.BoxGeometry(1.6, 3.1, 2.5),
      new THREE.MeshBasicMaterial({ color: '#06070a', side: THREE.BackSide })
    );
    portalChamber.position.set(0, 1.55, -1.2);
    doorGroup.add(portalChamber);

    // Warm Interior Light Source inside the chamber
    const doorInteriorLight = new THREE.PointLight('#f59e0b', 0.35, 7);
    doorInteriorLight.position.set(0, 1.6, -0.9);
    doorGroup.add(doorInteriorLight);

    // Volumetric Glow Plane inside doorway
    const lightBeamMat = new THREE.MeshBasicMaterial({
      color: '#f59e0b',
      transparent: true,
      opacity: 0.0,
      side: THREE.DoubleSide,
      blending: THREE.AdditiveBlending,
    });
    const lightBeam = new THREE.Mesh(new THREE.PlaneGeometry(1.56, 3.08), lightBeamMat);
    lightBeam.position.set(0, 1.55, -0.04);
    doorGroup.add(lightBeam);

    // True Rectangular Perimeter Light Seam (Left jamb, Right jamb, Top lintel)
    const seamGlowMat = new THREE.MeshBasicMaterial({
      color: '#fbbf24',
      transparent: true,
      opacity: 0.08,
      blending: THREE.AdditiveBlending,
    });
    const seamGroup = new THREE.Group();
    seamGroup.position.set(0, 0, 0.115);
    doorGroup.add(seamGroup);

    const leftSeam = new THREE.Mesh(new THREE.PlaneGeometry(0.025, 3.12), seamGlowMat);
    leftSeam.position.set(-0.79, 1.56, 0);
    const rightSeam = new THREE.Mesh(new THREE.PlaneGeometry(0.025, 3.12), seamGlowMat);
    rightSeam.position.set(0.79, 1.56, 0);
    const topSeam = new THREE.Mesh(new THREE.PlaneGeometry(1.6, 0.025), seamGlowMat);
    topSeam.position.set(0, 3.11, 0);
    seamGroup.add(leftSeam, rightSeam, topSeam);

    // Warm Floor Light Spill in front of threshold when door cracks open on hover
    const spillCanvas = document.createElement('canvas');
    spillCanvas.width = 256;
    spillCanvas.height = 256;
    const sctx = spillCanvas.getContext('2d')!;
    const sGrad = sctx.createRadialGradient(128, 30, 8, 128, 110, 120);
    sGrad.addColorStop(0, 'rgba(245, 158, 11, 0.55)');
    sGrad.addColorStop(0.5, 'rgba(245, 158, 11, 0.18)');
    sGrad.addColorStop(1, 'rgba(245, 158, 11, 0)');
    sctx.fillStyle = sGrad;
    sctx.fillRect(0, 0, 256, 256);
    const spillTex = new THREE.CanvasTexture(spillCanvas);
    const floorSpillMat = new THREE.MeshBasicMaterial({
      map: spillTex,
      transparent: true,
      opacity: 0.12,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
    const floorSpill = new THREE.Mesh(new THREE.PlaneGeometry(2.1, 1.8), floorSpillMat);
    floorSpill.rotation.x = -Math.PI / 2;
    floorSpill.position.set(0, 0.004, 0.9);
    doorGroup.add(floorSpill);

    // Door Signage Plaque above door: "01 // ENTER"
    const plaque = new THREE.Mesh(
      new THREE.BoxGeometry(1.3, 0.34, 0.06),
      new THREE.MeshStandardMaterial({ color: '#161922', metalness: 0.7, roughness: 0.3 })
    );
    plaque.position.set(0, 3.72, 0.11);
    doorGroup.add(plaque);

    const plaqueCanvas = document.createElement('canvas');
    plaqueCanvas.width = 512;
    plaqueCanvas.height = 128;
    const pctx = plaqueCanvas.getContext('2d')!;
    pctx.fillStyle = '#0c0e14';
    pctx.fillRect(0, 0, 512, 128);
    pctx.strokeStyle = 'rgba(212, 175, 55, 0.65)';
    pctx.lineWidth = 3;
    pctx.strokeRect(6, 6, 500, 116);
    pctx.fillStyle = '#f59e0b';
    pctx.font = 'bold 34px monospace';
    pctx.textAlign = 'center';
    pctx.textBaseline = 'middle';
    pctx.fillText('01 // PORTAL', 256, 46);
    pctx.font = '20px monospace';
    pctx.fillStyle = '#94a3b8';
    pctx.fillText('ENTER NEXUS HUB', 256, 88);

    const plaqueTex = new THREE.CanvasTexture(plaqueCanvas);
    const plaqueTextPlane = new THREE.Mesh(
      new THREE.PlaneGeometry(1.24, 0.29),
      new THREE.MeshBasicMaterial({ map: plaqueTex })
    );
    plaqueTextPlane.position.set(0, 3.72, 0.145);
    doorGroup.add(plaqueTextPlane);

    // Door Panel & Hinge Pivot
    const doorHingePivot = new THREE.Group();
    doorHingePivot.position.set(-0.78, 0, 0.02);
    doorGroup.add(doorHingePivot);

    const doorPanelWidth = 1.56;
    const doorPanelHeight = 3.08;
    const doorPanelDepth = 0.09;
    const doorPanel = new THREE.Mesh(
      new THREE.BoxGeometry(doorPanelWidth, doorPanelHeight, doorPanelDepth),
      new THREE.MeshStandardMaterial({
        color: '#2e1f18',
        roughness: 0.55,
        metalness: 0.15,
      })
    );
    doorPanel.position.set(doorPanelWidth / 2, doorPanelHeight / 2, 0);
    doorPanel.castShadow = true;
    doorHingePivot.add(doorPanel);

    // Subtle inset architectural groove on door panel
    const doorInset = new THREE.Mesh(
      new THREE.BoxGeometry(1.22, 2.65, 0.096),
      new THREE.MeshStandardMaterial({ color: '#241812', roughness: 0.65 })
    );
    doorInset.position.set(doorPanelWidth / 2, doorPanelHeight / 2, 0);
    doorHingePivot.add(doorInset);

    // Brass Lever Handle on door
    const handlePivot = new THREE.Group();
    handlePivot.position.set(doorPanelWidth - 0.18, 1.45, 0.06);
    doorHingePivot.add(handlePivot);

    const handleBase = new THREE.Mesh(
      new THREE.CylinderGeometry(0.035, 0.035, 0.04, 16),
      brassMat
    );
    handleBase.rotation.x = Math.PI / 2;
    handlePivot.add(handleBase);

    const handleLever = new THREE.Mesh(new THREE.BoxGeometry(0.18, 0.028, 0.028), brassMat);
    handleLever.position.set(0.06, 0, 0.03);
    handlePivot.add(handleLever);

    doorPanel.userData = { id: 'door_work', label: 'Door to Work' };
    doorInset.userData = { id: 'door_work', label: 'Door to Work' };

    // Floating In-World Door Hover Prompt ("enter nexus →")
    const doorHoverCanvas = document.createElement('canvas');
    doorHoverCanvas.width = 420;
    doorHoverCanvas.height = 88;
    const dhctx = doorHoverCanvas.getContext('2d')!;
    dhctx.clearRect(0, 0, 420, 88);
    dhctx.font = 'bold 30px "JetBrains Mono", monospace';
    dhctx.textAlign = 'center';
    dhctx.textBaseline = 'middle';
    dhctx.fillStyle = '#fde68a';
    dhctx.fillText('enter nexus →', 210, 44);

    const doorHoverTex = new THREE.CanvasTexture(doorHoverCanvas);
    const doorHoverMat = new THREE.MeshBasicMaterial({
      map: doorHoverTex,
      transparent: true,
      opacity: 0,
      depthWrite: false,
    });
    const doorHoverPlane = new THREE.Mesh(new THREE.PlaneGeometry(1.05, 0.22), doorHoverMat);
    doorHoverPlane.position.set(doorX + 0.55, 2.05, doorZ + 0.45);
    scene.add(doorHoverPlane);

    // --- STUDIO DESK & WORKSTATION COMPOSITION ---
    const deskGroup = new THREE.Group();
    deskGroup.position.set(0, 0, 0.45);
    scene.add(deskGroup);

    // 1. Woven Studio Floor Rug beneath Desk (grounds the furniture composition)
    const rugGroup = new THREE.Group();
    rugGroup.position.set(0, 0.003, 0.15);
    deskGroup.add(rugGroup);

    const rugOuter = new THREE.Mesh(
      new THREE.PlaneGeometry(3.1, 2.1),
      new THREE.MeshStandardMaterial({ color: '#1e222b', roughness: 0.95 })
    );
    rugOuter.rotation.x = -Math.PI / 2;
    rugOuter.receiveShadow = true;
    rugGroup.add(rugOuter);

    const rugInner = new THREE.Mesh(
      new THREE.PlaneGeometry(2.92, 1.92),
      new THREE.MeshStandardMaterial({ color: '#181b23', roughness: 0.95 })
    );
    rugInner.rotation.x = -Math.PI / 2;
    rugInner.position.y = 0.001;
    rugInner.receiveShadow = true;
    rugGroup.add(rugInner);

    // 2. Desk Tabletop (Walnut wood with beveled underside)
    const deskTop = new THREE.Mesh(new THREE.BoxGeometry(2.35, 0.09, 1.25), woodMat);
    deskTop.position.set(0, 1.15, 0);
    deskTop.castShadow = true;
    deskTop.receiveShadow = true;
    deskGroup.add(deskTop);

    // Matte Dark Leather Desk Mat
    const deskMat = new THREE.Mesh(
      new THREE.BoxGeometry(1.18, 0.008, 0.68),
      new THREE.MeshStandardMaterial({ color: '#14171f', roughness: 0.75 })
    );
    deskMat.position.set(0, 1.198, 0.06);
    deskMat.receiveShadow = true;
    deskGroup.add(deskMat);

    // Desk Legs & Structural Crossbar
    const legGeo = new THREE.CylinderGeometry(0.038, 0.038, 1.12, 12);
    const legPositions = [
      [-0.98, 0.56, -0.48],
      [0.98, 0.56, -0.48],
      [-0.98, 0.56, 0.48],
      [0.98, 0.56, 0.48],
    ];
    legPositions.forEach(([lx, ly, lz]) => {
      const leg = new THREE.Mesh(legGeo, darkMetalMat);
      leg.position.set(lx, ly, lz);
      leg.castShadow = true;
      deskGroup.add(leg);
    });

    const crossbar = new THREE.Mesh(new THREE.BoxGeometry(1.96, 0.03, 0.03), darkMetalMat);
    crossbar.position.set(0, 0.32, -0.48);
    deskGroup.add(crossbar);

    // 3. Ergonomic Studio Chair (Tucked slightly angled in front of desk)
    const chairGroup = new THREE.Group();
    chairGroup.position.set(0.08, 0, 0.72);
    chairGroup.rotation.y = -0.24;
    deskGroup.add(chairGroup);

    const chairSeat = new THREE.Mesh(
      new THREE.BoxGeometry(0.56, 0.06, 0.52),
      new THREE.MeshStandardMaterial({ color: '#1b1f29', roughness: 0.7 })
    );
    chairSeat.position.set(0, 0.68, 0);
    chairSeat.castShadow = true;
    chairGroup.add(chairSeat);

    const chairBack = new THREE.Mesh(
      new THREE.BoxGeometry(0.52, 0.54, 0.05),
      new THREE.MeshStandardMaterial({ color: '#1b1f29', roughness: 0.7 })
    );
    chairBack.position.set(0, 1.0, 0.24);
    chairBack.rotation.x = 0.1;
    chairBack.castShadow = true;
    chairGroup.add(chairBack);

    const chairPost = new THREE.Mesh(
      new THREE.CylinderGeometry(0.03, 0.03, 0.52, 10),
      darkMetalMat
    );
    chairPost.position.set(0, 0.38, 0);
    chairGroup.add(chairPost);

    for (let c = 0; c < 5; c++) {
      const cAngle = (c / 5) * Math.PI * 2;
      const spoke = new THREE.Mesh(new THREE.BoxGeometry(0.03, 0.025, 0.28), darkMetalMat);
      spoke.position.set(Math.sin(cAngle) * 0.13, 0.1, Math.cos(cAngle) * 0.13);
      spoke.rotation.y = cAngle;
      chairGroup.add(spoke);
    }

    // 4. Developer Laptop on Desk Stand
    const laptopGroup = new THREE.Group();
    laptopGroup.position.set(0, 1.21, -0.06);
    deskGroup.add(laptopGroup);

    const laptopBase = new THREE.Mesh(new THREE.BoxGeometry(0.66, 0.022, 0.45), darkMetalMat);
    laptopBase.castShadow = true;
    laptopGroup.add(laptopBase);

    const laptopScreen = new THREE.Mesh(
      new THREE.BoxGeometry(0.66, 0.44, 0.018),
      new THREE.MeshStandardMaterial({ color: '#0f1117', roughness: 0.25 })
    );
    laptopScreen.position.set(0, 0.22, -0.22);
    laptopScreen.rotation.x = -0.16;
    laptopScreen.castShadow = true;
    laptopGroup.add(laptopScreen);

    // Subtle screen glow illuminating the keyboard/desk pad
    const screenGlow = new THREE.PointLight('#38bdf8', 0.35, 1.4);
    screenGlow.position.set(0, 0.24, 0.05);
    laptopGroup.add(screenGlow);

    // Animated Code Screen Display (Only repaints when needed)
    const codeCanvas = document.createElement('canvas');
    codeCanvas.width = 512;
    codeCanvas.height = 320;
    const codeCtx = codeCanvas.getContext('2d')!;
    const codeTexture = new THREE.CanvasTexture(codeCanvas);
    const codeDisplayPlane = new THREE.Mesh(
      new THREE.PlaneGeometry(0.61, 0.39),
      new THREE.MeshBasicMaterial({ map: codeTexture })
    );
    codeDisplayPlane.position.set(0, 0.22, -0.208);
    codeDisplayPlane.rotation.x = -0.16;
    laptopGroup.add(codeDisplayPlane);

    laptopBase.userData = { id: 'laptop', label: 'Developer Terminal' };
    laptopScreen.userData = { id: 'laptop', label: 'Developer Terminal' };
    codeDisplayPlane.userData = { id: 'laptop', label: 'Developer Terminal' };

    // Tactile wireless mouse & ceramic mug beside laptop
    const mouseMesh = new THREE.Mesh(
      new THREE.BoxGeometry(0.08, 0.022, 0.13),
      new THREE.MeshStandardMaterial({ color: '#262b38', roughness: 0.4 })
    );
    mouseMesh.position.set(0.45, 1.21, 0.08);
    deskGroup.add(mouseMesh);

    const mugGroup = new THREE.Group();
    mugGroup.position.set(-0.52, 1.2, 0.18);
    deskGroup.add(mugGroup);
    const mugBody = new THREE.Mesh(
      new THREE.CylinderGeometry(0.055, 0.048, 0.11, 16),
      new THREE.MeshStandardMaterial({ color: '#e2e8f0', roughness: 0.3 })
    );
    mugBody.position.y = 0.055;
    mugBody.castShadow = true;
    mugGroup.add(mugBody);

    // --- INTERACTIVE DESK LAMP ---
    const lampGroup = new THREE.Group();
    lampGroup.position.set(-0.86, 1.2, -0.3);
    deskGroup.add(lampGroup);

    const lampBase = new THREE.Mesh(
      new THREE.CylinderGeometry(0.12, 0.14, 0.03, 16),
      darkMetalMat
    );
    lampGroup.add(lampBase);

    const lampArm1 = new THREE.Mesh(
      new THREE.CylinderGeometry(0.015, 0.015, 0.46, 8),
      brassMat
    );
    lampArm1.position.set(0, 0.22, 0);
    lampArm1.rotation.z = -0.25;
    lampGroup.add(lampArm1);

    const shade = new THREE.Mesh(
      new THREE.ConeGeometry(0.14, 0.22, 16, 1, true),
      new THREE.MeshStandardMaterial({
        color: '#222631',
        side: THREE.DoubleSide,
        roughness: 0.4,
      })
    );
    shade.position.set(0.12, 0.45, 0);
    shade.rotation.z = Math.PI - 0.4;
    lampGroup.add(shade);

    const deskSpotLight = new THREE.SpotLight('#fef3c7', 2.8, 4.8, Math.PI / 3.8, 0.45, 1.2);
    deskSpotLight.position.set(0.12, 0.45, 0);
    deskSpotLight.target = deskTop;
    deskSpotLight.castShadow = true;
    lampGroup.add(deskSpotLight);

    lampBase.userData = { id: 'desk_lamp', label: 'Desk Lamp (Click to Toggle)' };
    shade.userData = { id: 'desk_lamp', label: 'Desk Lamp (Click to Toggle)' };

    // --- POTTED STUDIO PLANT ---
    const plantGroup = new THREE.Group();
    plantGroup.position.set(0.86, 1.2, -0.3);
    deskGroup.add(plantGroup);

    const pot = new THREE.Mesh(
      new THREE.CylinderGeometry(0.12, 0.09, 0.22, 16),
      new THREE.MeshStandardMaterial({ color: '#8d6e63', roughness: 0.8 })
    );
    pot.position.set(0, 0.11, 0);
    pot.castShadow = true;
    plantGroup.add(pot);

    const plantLeaves = new THREE.Group();
    const leafGeo = new THREE.SphereGeometry(0.18, 8, 8);
    leafGeo.scale(1, 0.2, 1.5);
    const leafMat = new THREE.MeshStandardMaterial({ color: '#2d6a4f', roughness: 0.6 });

    for (let i = 0; i < 5; i++) {
      const leaf = new THREE.Mesh(leafGeo, leafMat);
      const angle = (i * Math.PI * 2) / 5;
      leaf.position.set(Math.cos(angle) * 0.12, 0.24 + (i % 2) * 0.03, Math.sin(angle) * 0.12);
      leaf.rotation.y = angle;
      leaf.rotation.x = 0.32;
      leaf.castShadow = true;
      plantLeaves.add(leaf);
    }
    plantGroup.add(plantLeaves);
    pot.userData = { id: 'plant', label: 'Studio Plant' };

    // =========================================================================
    // --- ARTICULATED WORKSPACE BEETLE WITH CURSOR AWARENESS & SOFT SHADOW ---
    // =========================================================================
    const bugGroup = new THREE.Group();
    {
      const edge = Math.floor(Math.random() * 4);
      const along = (Math.random() - 0.5) * 3.6;
      const spawnPos: [number, number, number] =
        edge === 0 ? [-2.4, 0.0, along + 2.1] :
        edge === 1 ? [2.4, 0.0, along + 2.1] :
        edge === 2 ? [along, 0.0, 1.5] :
                     [along, 0.0, 3.1];
      bugGroup.position.set(...spawnPos);
    }
    scene.add(bugGroup);

    const beetleBody = new THREE.Group();
    bugGroup.add(beetleBody);

    // Warm bronze-obsidian carapace so the beetle has subtle specular contrast on the dark floor
    const chitinMat = new THREE.MeshStandardMaterial({
      color: '#2b241d',
      roughness: 0.22,
      metalness: 0.72,
    });
    const thoraxMat = new THREE.MeshStandardMaterial({
      color: '#211c17',
      roughness: 0.28,
      metalness: 0.65,
    });
    const sutureMat = new THREE.MeshBasicMaterial({ color: '#d97706' });
    const eyeMat = new THREE.MeshStandardMaterial({
      color: '#090b10',
      roughness: 0.08,
      metalness: 0.9,
    });
    const legChitinMat = new THREE.MeshStandardMaterial({
      color: '#1e1915',
      roughness: 0.4,
      metalness: 0.55,
    });

    // 1. ELYTRA
    const elytraGroup = new THREE.Group();
    elytraGroup.position.set(0, 0.034, -0.038);
    beetleBody.add(elytraGroup);

    const elytronGeo = new THREE.SphereGeometry(0.054, 16, 12);
    elytronGeo.scale(0.7, 0.56, 1.26);

    const leftElytron = new THREE.Mesh(elytronGeo, chitinMat);
    leftElytron.position.set(-0.03, 0, 0);
    leftElytron.castShadow = true;
    elytraGroup.add(leftElytron);

    const rightElytron = new THREE.Mesh(elytronGeo, chitinMat);
    rightElytron.position.set(0.03, 0, 0);
    rightElytron.castShadow = true;
    elytraGroup.add(rightElytron);

    const sutureMesh = new THREE.Mesh(new THREE.BoxGeometry(0.004, 0.031, 0.13), sutureMat);
    sutureMesh.position.set(0, 0.015, 0);
    elytraGroup.add(sutureMesh);

    // 2. PRONOTUM
    const pronotumGeo = new THREE.SphereGeometry(0.056, 14, 10);
    pronotumGeo.scale(1.15, 0.58, 0.72);
    const pronotum = new THREE.Mesh(pronotumGeo, thoraxMat);
    pronotum.position.set(0, 0.032, 0.035);
    pronotum.castShadow = true;
    beetleBody.add(pronotum);

    // 3. HEAD
    const headGroup = new THREE.Group();
    headGroup.position.set(0, 0.028, 0.082);
    beetleBody.add(headGroup);

    const headGeo = new THREE.SphereGeometry(0.034, 12, 10);
    headGeo.scale(1.0, 0.62, 0.88);
    const headMesh = new THREE.Mesh(headGeo, thoraxMat);
    headGroup.add(headMesh);

    const eyeGeo = new THREE.SphereGeometry(0.009, 8, 8);
    const leftEye = new THREE.Mesh(eyeGeo, eyeMat);
    leftEye.position.set(-0.028, 0.004, 0.005);
    headGroup.add(leftEye);

    const rightEye = new THREE.Mesh(eyeGeo, eyeMat);
    rightEye.position.set(0.028, 0.004, 0.005);
    headGroup.add(rightEye);

    // 4. ANTENNAE
    const antennaGeo = new THREE.CylinderGeometry(0.002, 0.0035, 0.088, 6);
    antennaGeo.translate(0, 0.044, 0);

    const leftAntennaPivot = new THREE.Group();
    leftAntennaPivot.position.set(-0.018, 0.006, 0.022);
    leftAntennaPivot.rotation.set(-0.35, 0, 0.45);
    headGroup.add(leftAntennaPivot);
    leftAntennaPivot.add(new THREE.Mesh(antennaGeo, legChitinMat));

    const rightAntennaPivot = new THREE.Group();
    rightAntennaPivot.position.set(0.018, 0.006, 0.022);
    rightAntennaPivot.rotation.set(-0.35, 0, -0.45);
    headGroup.add(rightAntennaPivot);
    rightAntennaPivot.add(new THREE.Mesh(antennaGeo, legChitinMat));

    // 5. SIX ARTICULATED LEGS
    const bugLegs: {
      pivot: THREE.Group;
      femur: THREE.Mesh;
      kneeGroup: THREE.Group;
      tibia: THREE.Mesh;
      baseAngleY: number;
      isLeft: boolean;
      tripodGroup: 0 | 1;
    }[] = [];

    const femurGeo = new THREE.CylinderGeometry(0.004, 0.0045, 0.052, 6);
    femurGeo.translate(0, 0.026, 0);
    const tibiaGeo = new THREE.CylinderGeometry(0.0025, 0.0035, 0.054, 6);
    tibiaGeo.translate(0, 0.027, 0);

    const legConfigs = [
      { x: -0.042, z: 0.048, angleY: 0.55, tripod: 0 as const, isLeft: true },
      { x: 0.042, z: 0.048, angleY: -0.55, tripod: 1 as const, isLeft: false },
      { x: -0.048, z: 0.005, angleY: 0.0, tripod: 1 as const, isLeft: true },
      { x: 0.048, z: 0.005, angleY: 0.0, tripod: 0 as const, isLeft: false },
      { x: -0.042, z: -0.045, angleY: -0.7, tripod: 0 as const, isLeft: true },
      { x: 0.042, z: -0.045, angleY: 0.7, tripod: 1 as const, isLeft: false },
    ];

    legConfigs.forEach((cfg) => {
      const pivot = new THREE.Group();
      pivot.position.set(cfg.x, 0.024, cfg.z);
      pivot.rotation.y = cfg.angleY;
      beetleBody.add(pivot);

      const femur = new THREE.Mesh(femurGeo, legChitinMat);
      const sideSign = cfg.isLeft ? -1 : 1;
      femur.rotation.z = sideSign * 0.95;
      pivot.add(femur);

      const kneeGroup = new THREE.Group();
      kneeGroup.position.set(sideSign * 0.044, 0.022, 0);
      pivot.add(kneeGroup);

      const tibia = new THREE.Mesh(tibiaGeo, legChitinMat);
      tibia.rotation.z = sideSign * -1.8;
      kneeGroup.add(tibia);

      bugLegs.push({
        pivot,
        femur,
        kneeGroup,
        tibia,
        baseAngleY: cfg.angleY,
        isLeft: cfg.isLeft,
        tripodGroup: cfg.tripod,
      });
    });

    // Soft Radial Contact Shadow beneath beetle (instead of hard rectangle)
    const bugShadowCanvas = document.createElement('canvas');
    bugShadowCanvas.width = 64;
    bugShadowCanvas.height = 64;
    const bsCtx = bugShadowCanvas.getContext('2d')!;
    const bsGrad = bsCtx.createRadialGradient(32, 32, 4, 32, 32, 28);
    bsGrad.addColorStop(0, 'rgba(0, 0, 0, 0.65)');
    bsGrad.addColorStop(0.6, 'rgba(0, 0, 0, 0.25)');
    bsGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
    bsCtx.fillStyle = bsGrad;
    bsCtx.fillRect(0, 0, 64, 64);

    const bugShadowTex = new THREE.CanvasTexture(bugShadowCanvas);
    const bugShadow = new THREE.Mesh(
      new THREE.PlaneGeometry(0.28, 0.34),
      new THREE.MeshBasicMaterial({
        map: bugShadowTex,
        transparent: true,
        depthWrite: false,
      })
    );
    bugShadow.rotation.x = -Math.PI / 2;
    bugShadow.position.set(0, 0.002, -0.01);
    bugGroup.add(bugShadow);

    // Hit-sphere for clicking
    const bugHitMesh = new THREE.Mesh(
      new THREE.SphereGeometry(0.36, 8, 8),
      new THREE.MeshBasicMaterial({ visible: false })
    );
    bugHitMesh.position.set(0, 0.035, 0);
    bugHitMesh.userData = { id: 'bug', label: 'Workspace Beetle' };
    bugGroup.add(bugHitMesh);

    // Repair band-aid patch & stars
    const bandageGroup = new THREE.Group();
    bandageGroup.position.set(0, 0.065, -0.035);
    bandageGroup.scale.set(0, 0, 0);
    beetleBody.add(bandageGroup);

    const bandMat = new THREE.MeshStandardMaterial({ color: '#d6b284', roughness: 0.9 });
    bandageGroup.add(
      new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.006, 0.028), bandMat),
      new THREE.Mesh(new THREE.BoxGeometry(0.028, 0.006, 0.08), bandMat)
    );

    const dizzyStarsGroup = new THREE.Group();
    dizzyStarsGroup.position.set(0, 0.16, 0.08);
    dizzyStarsGroup.scale.set(0, 0, 0);
    beetleBody.add(dizzyStarsGroup);

    const starGeo = new THREE.OctahedronGeometry(0.016, 0);
    const starMat = new THREE.MeshBasicMaterial({ color: '#fbbf24' });
    for (let i = 0; i < 3; i++) {
      const star = new THREE.Mesh(starGeo, starMat);
      const angle = (i / 3) * Math.PI * 2;
      star.position.set(Math.cos(angle) * 0.085, 0, Math.sin(angle) * 0.085);
      dizzyStarsGroup.add(star);
    }

    // Floating in-world "bug patched ✓" typography
    const textCanvas = document.createElement('canvas');
    textCanvas.width = 360;
    textCanvas.height = 96;
    const tctx = textCanvas.getContext('2d')!;
    tctx.clearRect(0, 0, 360, 96);
    tctx.font = 'bold 32px "JetBrains Mono", monospace';
    tctx.textAlign = 'center';
    tctx.textBaseline = 'middle';
    tctx.fillStyle = '#fde68a';
    tctx.fillText('bug patched ✓', 180, 48);

    const textTexture = new THREE.CanvasTexture(textCanvas);
    const fixedTextMat = new THREE.MeshBasicMaterial({
      map: textTexture,
      transparent: true,
      opacity: 0,
      depthWrite: false,
    });
    const fixedTextPlane = new THREE.Mesh(new THREE.PlaneGeometry(0.68, 0.18), fixedTextMat);
    scene.add(fixedTextPlane);

    let bugState: 'walking' | 'pausing' | 'squashed' | 'scrambling' = 'walking';
    let bugTarget = new THREE.Vector3(1.2, 0.0, 2.2);
    let bugPauseTimer = 0;
    let bugWalkCycle = 0;
    let scrambleTimer = 0;

    // Pick waypoints that avoid walking through desk legs or chair base
    const pickNewBugTarget = () => {
      let randX = 0;
      let randZ = 0;
      for (let attempt = 0; attempt < 6; attempt++) {
        randX = (Math.random() - 0.5) * 4.4;
        randZ = 1.45 + Math.random() * 1.85; // In front of chair/desk zone
        if (Math.hypot(randX - 0.08, randZ - 1.17) > 0.55) break;
      }
      bugTarget.set(randX, 0.0, randZ);
      bugState = 'walking';
    };

    const triggerBugSquashSequence = () => {
      if (bugState === 'squashed' || bugState === 'scrambling') return;
      bugState = 'squashed';

      workspaceSound.playBugSquish();

      gsap.to(bugGroup.scale, {
        x: 1.45,
        y: 0.22,
        z: 1.35,
        duration: 0.12,
        ease: 'power2.out',
      });

      bugLegs.forEach((leg) => {
        const sideSign = leg.isLeft ? -1 : 1;
        gsap.to(leg.femur.rotation, {
          z: sideSign * 1.4,
          duration: 0.12,
        });
      });

      gsap.to(bandageGroup.scale, {
        x: 1,
        y: 1,
        z: 1,
        duration: 0.22,
        delay: 0.05,
        ease: 'back.out(2.2)',
      });

      dizzyStarsGroup.scale.set(1, 1, 1);

      fixedTextPlane.position.copy(bugGroup.position);
      fixedTextPlane.position.y += 0.22;
      fixedTextMat.opacity = 1;
      gsap.to(fixedTextPlane.position, {
        y: '+=0.36',
        duration: 1.05,
        ease: 'power2.out',
      });
      gsap.to(fixedTextMat, {
        opacity: 0,
        duration: 0.85,
        delay: 0.25,
        ease: 'power2.in',
      });

      setTimeout(() => {
        workspaceSound.playBugSpring();
        dizzyStarsGroup.scale.set(0, 0, 0);

        gsap.to(bugGroup.scale, {
          x: 1,
          y: 1,
          z: 1,
          duration: 0.4,
          ease: 'elastic.out(2.0, 0.38)',
        });

        bugLegs.forEach((leg) => {
          const sideSign = leg.isLeft ? -1 : 1;
          gsap.to(leg.femur.rotation, {
            z: sideSign * 0.95,
            duration: 0.28,
          });
        });

        gsap.to(beetleBody.rotation, {
          z: '+=0.22',
          yoyo: true,
          repeat: 4,
          duration: 0.045,
        });

        setTimeout(() => {
          bugState = 'scrambling';
          scrambleTimer = 0;
          const awayAngle = bugGroup.rotation.y + Math.PI + (Math.random() - 0.5) * 0.6;
          gsap.to(bugGroup.rotation, {
            y: awayAngle,
            duration: 0.18,
            ease: 'power2.out',
          });
        }, 200);
      }, 620);
    };

    // --- SUBTLE ATMOSPHERIC DUST MOTES (Restrained count: 40) ---
    const particleCount = 40;
    const particleGeo = new THREE.BufferGeometry();
    const particlePos = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount; i++) {
      particlePos[i * 3] = (Math.random() - 0.5) * 7.5;
      particlePos[i * 3 + 1] = 0.4 + Math.random() * 4.0;
      particlePos[i * 3 + 2] = (Math.random() - 0.5) * 7.5;
    }
    particleGeo.setAttribute('position', new THREE.BufferAttribute(particlePos, 3));
    const dustParticles = new THREE.Points(
      particleGeo,
      new THREE.PointsMaterial({
        color: '#fbbf24',
        size: 0.038,
        transparent: true,
        opacity: 0.3,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      })
    );
    scene.add(dustParticles);

    // --- LAPTOP INTERACTIVE TERMINAL STATE ---
    let laptopBuildActive = false;
    let laptopBuildStep = 0;
    let lastCodeDrawKey = '';

    const drawLaptopScreen = (cursorVisible: boolean, buildStep: number) => {
      const key = `${cursorVisible ? 1 : 0}_${buildStep}`;
      if (key === lastCodeDrawKey) return;
      lastCodeDrawKey = key;

      codeCtx.fillStyle = '#0b0f19';
      codeCtx.fillRect(0, 0, 512, 320);

      // Top editor tab bar
      codeCtx.fillStyle = '#141b2d';
      codeCtx.fillRect(0, 0, 512, 32);
      codeCtx.font = '12px "JetBrains Mono", monospace';
      codeCtx.fillStyle = '#f59e0b';
      codeCtx.fillText('●', 16, 20);
      codeCtx.fillStyle = '#94a3b8';
      codeCtx.fillText('sujith-os // architecture.ts', 34, 20);

      codeCtx.font = '13px "JetBrains Mono", monospace';
      const baseLines = [
        { text: 'const architect = "Sujith K";', color: '#38bdf8' },
        { text: 'const stack = ["React", "Next", "Node", "Mongo"];', color: '#34d399' },
        { text: 'export async function deploySystem() {', color: '#e2e8f0' },
        { text: '  await verifyProductionTelemetry();', color: '#94a3b8' },
        { text: '  return { status: "ONLINE", fps: 60 };', color: '#e2e8f0' },
        { text: '}', color: '#e2e8f0' },
      ];

      baseLines.forEach((line, idx) => {
        codeCtx.fillStyle = line.color;
        codeCtx.fillText(line.text, 20, 62 + idx * 24);
      });

      // Bottom terminal output pane
      codeCtx.fillStyle = '#070a12';
      codeCtx.fillRect(0, 212, 512, 108);
      codeCtx.strokeStyle = 'rgba(255,255,255,0.08)';
      codeCtx.beginPath();
      codeCtx.moveTo(0, 212);
      codeCtx.lineTo(512, 212);
      codeCtx.stroke();

      if (buildStep === 0) {
        codeCtx.fillStyle = '#64748b';
        codeCtx.fillText('$ sujith-os --status', 20, 240);
        codeCtx.fillStyle = '#10b981';
        codeCtx.fillText('✓ All 5 chambers nominal [Click to run build]', 20, 266);
      } else if (buildStep === 1) {
        codeCtx.fillStyle = '#fbbf24';
        codeCtx.fillText('$ npm run build:production', 20, 240);
        codeCtx.fillStyle = '#94a3b8';
        codeCtx.fillText('→ Compiling TypeScript & WebGL shaders...', 20, 266);
      } else {
        codeCtx.fillStyle = '#38bdf8';
        codeCtx.fillText('$ npm run build:production', 20, 240);
        codeCtx.fillStyle = '#10b981';
        codeCtx.fillText('✓ Built 48 modules in 38ms · Ready', 20, 266);
      }

      if (cursorVisible) {
        codeCtx.fillStyle = '#f59e0b';
        codeCtx.fillRect(20, 280, 8, 14);
      }

      codeTexture.needsUpdate = true;
    };

    const triggerLaptopCompile = () => {
      if (laptopBuildActive) return;
      laptopBuildActive = true;
      laptopBuildStep = 1;
      workspaceSound.playClick();
      gsap.fromTo(
        screenGlow,
        { intensity: 0.9 },
        { intensity: 0.35, duration: 0.9, ease: 'power2.out' }
      );
      setTimeout(() => {
        laptopBuildStep = 2;
        workspaceSound.playResolveChime();
        setTimeout(() => {
          laptopBuildStep = 0;
          laptopBuildActive = false;
        }, 2800);
      }, 650);
    };

    // --- RAYCASTING & INTERACTION ---
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2(-999, -999);
    const targetMouseOffset = new THREE.Vector2(0, 0);
    const currentMouseOffset = new THREE.Vector2(0, 0);

    const interactableObjects = [
      doorPanel,
      doorInset,
      lampBase,
      shade,
      laptopBase,
      laptopScreen,
      codeDisplayPlane,
      pot,
      bugHitMesh,
    ];

    let doorTimeline: gsap.core.Timeline | null = null;
    let cameraTimeline: gsap.core.Timeline | null = null;
    let hasPlayedLatchSound = false;
    let targetDoorAjarAngle = 0;

    // Cinematic camera arrival glide when loader finishes
    const handleWorkspaceArrival = () => {
      isArriving = false;
      gsap.to(camera.position, {
        x: overviewPos.x,
        y: overviewPos.y,
        z: overviewPos.z,
        duration: 1.55,
        ease: 'power3.out',
      });
    };
    window.addEventListener('sujith_workspace_arrival', handleWorkspaceArrival);

    const handleResize = () => {
      if (!container) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      updateCameraDistance();
      renderer.setSize(w, h);
    };
    window.addEventListener('resize', handleResize);

    const handlePointerMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
      mouse.set(x, y);

      targetMouseOffset.set(x * 0.38, y * 0.2);

      if (stateRef.current.cameraMode !== 'overview') return;

      const doorWorldPos = new THREE.Vector3(doorX, 1.8, doorZ);
      const doorScreenPos = doorWorldPos.clone().project(camera);
      const screenDist = Math.hypot(x - doorScreenPos.x, y - doorScreenPos.y);

      const prox = Math.max(0, Math.min(1, 1 - screenDist / 0.75));
      setDoorProximity(prox);

      seamGlowMat.opacity = 0.08 + prox * 0.65;
      floorSpillMat.opacity = 0.1 + prox * 0.55;
      doorInteriorLight.intensity = 0.35 + prox * 1.15;
      handleLever.rotation.z = -prox * 0.22;
      targetDoorAjarAngle = -prox * 0.14;

      if (prox > 0.48 && !hasPlayedLatchSound) {
        workspaceSound.playDoorLatch();
        hasPlayedLatchSound = true;
      } else if (prox < 0.2) {
        hasPlayedLatchSound = false;
      }
    };
    container.addEventListener('mousemove', handlePointerMove, { passive: true });

    const handleInteraction = (clientX: number, clientY: number) => {
      if (stateRef.current.cameraMode !== 'overview') return;

      const rect = container.getBoundingClientRect();
      const x = ((clientX - rect.left) / rect.width) * 2 - 1;
      const y = -((clientY - rect.top) / rect.height) * 2 + 1;
      const clickCoord = new THREE.Vector2(x, y);

      raycaster.setFromCamera(clickCoord, camera);
      const intersects = raycaster.intersectObjects(interactableObjects, true);

      if (intersects.length > 0) {
        const topHit = intersects[0].object;
        const targetId = topHit.userData?.id;

        if (targetId === 'bug') {
          triggerBugSquashSequence();
        } else if (targetId === 'door_work') {
          triggerDoorEntry();
        } else if (targetId === 'desk_lamp') {
          const willBeOn = !stateRef.current.deskLampOn;
          toggleDeskLamp();
          workspaceSound.playSwitch(willBeOn);
          gsap.to(deskSpotLight, {
            intensity: willBeOn ? 2.8 : 0.04,
            duration: 0.25,
            ease: 'power2.out',
          });
        } else if (targetId === 'laptop') {
          triggerLaptopCompile();
        }
      }
    };

    const handleClick = (e: MouseEvent) => {
      handleInteraction(e.clientX, e.clientY);
    };
    container.addEventListener('click', handleClick);

    const handleTouchStart = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        handleInteraction(e.touches[0].clientX, e.touches[0].clientY);
      }
    };
    container.addEventListener('touchstart', handleTouchStart, { passive: true });

    // --- CINEMATIC DOOR ENTRY TRANSITION ---
    const triggerDoorEntry = () => {
      isArriving = false;
      setCameraMode('zooming_in');
      workspaceSound.playDoorOpen();

      if (doorTimeline) doorTimeline.kill();
      doorTimeline = gsap.timeline();
      doorTimeline.to(
        handleLever.rotation,
        {
          z: -0.38,
          duration: 0.2,
          yoyo: true,
          repeat: 1,
        },
        0
      );
      doorTimeline.to(
        doorHingePivot.rotation,
        {
          y: -Math.PI * 0.56,
          duration: 1.15,
          ease: 'power3.inOut',
        },
        0.05
      );

      doorTimeline.to(
        lightBeamMat,
        {
          opacity: 0.65,
          duration: 0.85,
          ease: 'power2.in',
        },
        0.2
      );
      doorTimeline.to(
        doorInteriorLight,
        {
          intensity: 4.8,
          duration: 0.9,
        },
        0.2
      );

      if (cameraTimeline) cameraTimeline.kill();
      cameraTimeline = gsap.timeline({
        onComplete: () => {
          setActiveRoom('nexus');
          setCameraMode('inside_work');
        },
      });

      cameraTimeline.to(camera.position, {
        x: doorX,
        y: 1.62,
        z: doorZ + 0.35,
        duration: 1.35,
        ease: 'power3.inOut',
      });

      const lookTarget = { x: overviewLookAt.x, y: overviewLookAt.y, z: overviewLookAt.z };
      cameraTimeline.to(
        lookTarget,
        {
          x: doorX,
          y: 1.62,
          z: -8,
          duration: 1.35,
          ease: 'power3.inOut',
          onUpdate: () => {
            camera.lookAt(lookTarget.x, lookTarget.y, lookTarget.z);
          },
        },
        0
      );
    };

    // Return to workspace animation
    const triggerReturnToWorkspace = () => {
      setCameraMode('zooming_out');
      workspaceSound.playReturn();

      if (cameraTimeline) cameraTimeline.kill();
      cameraTimeline = gsap.timeline({
        onComplete: () => {
          setActiveRoom('workspace');
          setCameraMode('overview');
        },
      });

      cameraTimeline.to(camera.position, {
        x: overviewPos.x,
        y: overviewPos.y,
        z: overviewPos.z,
        duration: 1.3,
        ease: 'power3.out',
      });

      const returnLook = { x: doorX, y: 1.62, z: -8 };
      cameraTimeline.to(
        returnLook,
        {
          x: overviewLookAt.x,
          y: overviewLookAt.y,
          z: overviewLookAt.z,
          duration: 1.3,
          ease: 'power3.out',
          onUpdate: () => {
            camera.lookAt(returnLook.x, returnLook.y, returnLook.z);
          },
        },
        0
      );

      if (doorTimeline) doorTimeline.kill();
      doorTimeline = gsap.timeline({ delay: 0.35 });
      doorTimeline.to(doorHingePivot.rotation, {
        y: 0,
        duration: 1.0,
        ease: 'power2.inOut',
        onComplete: () => {
          workspaceSound.playDoorLatch();
          lightBeamMat.opacity = 0;
        },
      });
      doorTimeline.to(
        doorInteriorLight,
        {
          intensity: 0.35,
          duration: 0.75,
        },
        0.15
      );
    };

    const handleReturnEvent = () => {
      triggerReturnToWorkspace();
    };
    window.addEventListener('sujith_return_to_workspace', handleReturnEvent);

    // --- ANIMATION LOOP ---
    let animationFrameId: number;
    const clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const delta = Math.min(clock.getDelta(), 0.1);
      const elapsedTime = clock.getElapsedTime();

      // 1. Smooth Pointer Parallax & Physical Door Ajar Response (in overview mode)
      if (stateRef.current.cameraMode === 'overview') {
        currentMouseOffset.x += (targetMouseOffset.x - currentMouseOffset.x) * 0.05;
        currentMouseOffset.y += (targetMouseOffset.y - currentMouseOffset.y) * 0.05;

        if (!isArriving) {
          camera.position.x = overviewPos.x + currentMouseOffset.x * 0.75;
          camera.position.y = overviewPos.y + currentMouseOffset.y * 0.45;
          camera.lookAt(overviewLookAt.x, overviewLookAt.y, overviewLookAt.z);
        }

        // Smoothly ease door slightly ajar when cursor approaches/hovers
        const desiredDoorAngle =
          hoveredTargetRef.current === 'door_work' ? -0.18 : targetDoorAjarAngle;
        doorHingePivot.rotation.y += (desiredDoorAngle - doorHingePivot.rotation.y) * 0.08;
      }

      // 2. Laptop Screen Update (throttled to state changes only)
      drawLaptopScreen(Math.sin(elapsedTime * 5) > 0, laptopBuildStep);

      // 3. Gentle Organic Sway on Studio Plant
      plantLeaves.rotation.z = Math.sin(elapsedTime * 1.4) * 0.018;
      plantLeaves.rotation.x = Math.cos(elapsedTime * 1.1) * 0.014;

      // 4. Restrained Dust Motes
      const positions = particleGeo.attributes.position.array as Float32Array;
      for (let i = 0; i < particleCount; i++) {
        positions[i * 3 + 1] += Math.sin(elapsedTime + i) * 0.0015;
        if (positions[i * 3 + 1] > 4.4) positions[i * 3 + 1] = 0.3;
      }
      particleGeo.attributes.position.needsUpdate = true;

      if (fixedTextMat.opacity > 0.01) {
        fixedTextPlane.quaternion.copy(camera.quaternion);
      }

      // 5. Beetle AI & Cursor Awareness
      const isBugHovered = hoveredTargetRef.current === 'bug';

      if (bugState === 'walking') {
        // If user hovers directly over the walking beetle, it pauses and perks its antennae!
        if (isBugHovered) {
          bugLegs.forEach((leg) => {
            leg.pivot.rotation.y = leg.baseAngleY;
            leg.femur.rotation.x = 0;
          });
          leftAntennaPivot.rotation.y = 0.45 + Math.sin(elapsedTime * 16) * 0.18;
          rightAntennaPivot.rotation.y = -0.45 + Math.cos(elapsedTime * 16) * 0.18;
          headGroup.rotation.x = -0.12;
        } else {
          headGroup.rotation.x = 0;
          bugWalkCycle += delta * 15;

          const toTarget = new THREE.Vector3().subVectors(bugTarget, bugGroup.position);
          toTarget.y = 0;
          const dist = toTarget.length();

          if (dist > 0.08) {
            toTarget.normalize();
            const speed = 0.48;
            bugGroup.position.x += toTarget.x * speed * delta;
            bugGroup.position.z += toTarget.z * speed * delta;
            bugGroup.position.y = 0.0;

            const targetHeading = Math.atan2(toTarget.x, toTarget.z);
            let diff = targetHeading - bugGroup.rotation.y;
            while (diff < -Math.PI) diff += Math.PI * 2;
            while (diff > Math.PI) diff -= Math.PI * 2;
            bugGroup.rotation.y += diff * 0.12;

            bugLegs.forEach((leg) => {
              const phase = leg.tripodGroup === 0 ? 0 : Math.PI;
              const cycle = Math.sin(bugWalkCycle + phase);
              const sideSign = leg.isLeft ? 1 : -1;
              leg.pivot.rotation.y = leg.baseAngleY + cycle * 0.35 * sideSign;
              leg.femur.rotation.x = Math.max(0, cycle) * 0.22 * sideSign;
            });

            beetleBody.rotation.z = Math.sin(bugWalkCycle) * 0.025;
            beetleBody.position.y = Math.abs(Math.sin(bugWalkCycle * 2)) * 0.003;

            leftAntennaPivot.rotation.y = 0.35 + Math.sin(elapsedTime * 9) * 0.1;
            rightAntennaPivot.rotation.y = -0.35 + Math.cos(elapsedTime * 9) * 0.1;
          } else {
            bugState = 'pausing';
            bugPauseTimer = 1.1 + Math.random() * 2.0;
            bugLegs.forEach((leg) => {
              leg.pivot.rotation.y = leg.baseAngleY;
              leg.femur.rotation.x = 0;
            });
            beetleBody.rotation.z = 0;
          }
        }
      } else if (bugState === 'pausing') {
        bugPauseTimer -= delta;
        leftAntennaPivot.rotation.y = 0.35 + Math.sin(elapsedTime * 5) * 0.12;
        rightAntennaPivot.rotation.y = -0.35 + Math.cos(elapsedTime * 5) * 0.12;
        headGroup.rotation.y = Math.sin(elapsedTime * 2.2) * 0.08;

        if (bugPauseTimer <= 0 && !isBugHovered) {
          pickNewBugTarget();
        }
      } else if (bugState === 'squashed') {
        dizzyStarsGroup.rotation.y += delta * 7;
        leftAntennaPivot.rotation.z = Math.sin(elapsedTime * 18) * 0.12;
        rightAntennaPivot.rotation.z = -Math.cos(elapsedTime * 18) * 0.12;
      } else if (bugState === 'scrambling') {
        bugWalkCycle += delta * 42;
        scrambleTimer += delta;

        const sprintSpeed = 1.45;
        bugGroup.position.x += Math.sin(bugGroup.rotation.y) * sprintSpeed * delta;
        bugGroup.position.z += Math.cos(bugGroup.rotation.y) * sprintSpeed * delta;
        bugGroup.position.y = 0.0;

        bugLegs.forEach((leg) => {
          const phase = leg.tripodGroup === 0 ? 0 : Math.PI;
          const cycle = Math.sin(bugWalkCycle + phase);
          const sideSign = leg.isLeft ? 1 : -1;
          leg.pivot.rotation.y = leg.baseAngleY + cycle * 0.5 * sideSign;
          leg.femur.rotation.x = Math.max(0, cycle) * 0.35 * sideSign;
        });

        beetleBody.rotation.z = Math.sin(bugWalkCycle * 1.5) * 0.06;

        const isOutOfBounds =
          Math.abs(bugGroup.position.x) > 3.6 ||
          bugGroup.position.z > 3.6 ||
          bugGroup.position.z < 0.8 ||
          scrambleTimer > 2.2;

        if (isOutOfBounds) {
          bugState = 'pausing';
          gsap.to(bugGroup.scale, {
            x: 0,
            y: 0,
            z: 0,
            duration: 0.25,
            ease: 'power2.in',
            onComplete: () => {
              bandageGroup.scale.set(0, 0, 0);
              setTimeout(() => {
                bugGroup.position.set((Math.random() - 0.5) * 3.4, 0.0, 2.2 + Math.random() * 0.8);
                pickNewBugTarget();
                gsap.to(bugGroup.scale, {
                  x: 1,
                  y: 1,
                  z: 1,
                  duration: 0.4,
                  ease: 'back.out(2)',
                });
              }, 6500);
            },
          });
        }
      }

      // 6. Raycasting for Hover Detection (only updates React store when target changes)
      if (stateRef.current.cameraMode === 'overview') {
        raycaster.setFromCamera(mouse, camera);
        const intersects = raycaster.intersectObjects(interactableObjects, true);
        const hitId = intersects.length > 0 ? intersects[0].object.userData?.id || null : null;

        hoveredTargetRef.current = hitId;
        if (hitId !== lastDispatchedHoverRef.current) {
          lastDispatchedHoverRef.current = hitId;
          setHoveredTarget(hitId);
          container.style.cursor = hitId ? 'pointer' : 'default';
          if (hitId) {
            workspaceSound.playHover();
          }
        }
      }

      // 7. Door hover floating text
      {
        const isDoorHovered = hoveredTargetRef.current === 'door_work';
        const targetOpacity = isDoorHovered ? 1 : 0;
        doorHoverMat.opacity += (targetOpacity - doorHoverMat.opacity) * 0.14;
        doorHoverPlane.lookAt(camera.position);
      }

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('sujith_workspace_arrival', handleWorkspaceArrival);
      window.removeEventListener('sujith_return_to_workspace', handleReturnEvent);
      container.removeEventListener('mousemove', handlePointerMove);
      container.removeEventListener('click', handleClick);
      container.removeEventListener('touchstart', handleTouchStart);
      if (doorTimeline) doorTimeline.kill();
      if (cameraTimeline) cameraTimeline.kill();
      renderer.dispose();
      if (renderer.domElement.parentNode) {
        renderer.domElement.parentNode.removeChild(renderer.domElement);
      }
    };
  }, []);

  return <div ref={mountRef} className="w-full h-full relative" />;
};
