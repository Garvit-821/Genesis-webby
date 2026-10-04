import React, { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { GALLERY_PHOTOS } from "@shared/data/mediaAssets";
import { fragmentShader, vertexShader } from "./shaders";
import { createPlayGate } from "@infra/performance/utils/createPlayGate";

const CELL_SIZE = 1.15;
const MIN_ZOOM = 0.55;
const MAX_ZOOM = 2.8;
const FRICTION_DESKTOP = 0.94;
const FRICTION_TOUCH = 0.92;
const LERP_DESKTOP = 0.14;
const LERP_TOUCH = 0.22;

function isCoarsePointer() {
  if (typeof window === "undefined") return false;
  return (
    window.matchMedia("(pointer: coarse)").matches ||
    window.matchMedia("(max-width: 768px)").matches ||
    navigator.maxTouchPoints > 0
  );
}

function loadImage(src) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
}

// CanvasTexture uploads with flipY, so canvas row 0 lands at the top of the
// texture while the shader counts atlas rows from the bottom. Draw rows
// bottom-up so tile i in the canvas is tile i in the shader.
function atlasTileOrigin(index, atlasGrid, tileSize) {
  const col = index % atlasGrid;
  const row = Math.floor(index / atlasGrid);
  return { x: col * tileSize, y: (atlasGrid - 1 - row) * tileSize };
}

async function buildImageAtlas(photos, tileSize = 512) {
  const count = photos.length;
  const atlasGrid = Math.ceil(Math.sqrt(count));
  const canvas = document.createElement("canvas");
  canvas.width = atlasGrid * tileSize;
  canvas.height = atlasGrid * tileSize;
  const ctx = canvas.getContext("2d", { willReadFrequently: false });
  ctx.fillStyle = "#111018";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  const images = await Promise.all(
    photos.map((p) => loadImage(p.src).catch(() => null)),
  );

  images.forEach((img, i) => {
    if (!img) return;
    const { x, y } = atlasTileOrigin(i, atlasGrid, tileSize);

    // Centre square crop, so wide photos don't spill into neighbouring tiles
    const side = Math.min(img.width, img.height);
    ctx.drawImage(
      img,
      (img.width - side) / 2,
      (img.height - side) / 2,
      side,
      side,
      x,
      y,
      tileSize,
      tileSize,
    );
  });

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.minFilter = THREE.LinearFilter;
  texture.magFilter = THREE.LinearFilter;
  texture.generateMipmaps = false;
  texture.needsUpdate = true;
  return texture;
}

async function buildTextAtlas(photos, tileSize = 512) {
  const count = photos.length;
  const atlasGrid = Math.ceil(Math.sqrt(count));
  const canvas = document.createElement("canvas");
  canvas.width = atlasGrid * tileSize;
  canvas.height = atlasGrid * tileSize;
  const ctx = canvas.getContext("2d", { willReadFrequently: false });
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  photos.forEach((photo, i) => {
    const { x, y } = atlasTileOrigin(i, atlasGrid, tileSize);

    ctx.fillStyle = "rgba(0,0,0,0)";
    ctx.fillRect(x, y, tileSize, tileSize);

    ctx.fillStyle = "rgba(245,240,255,0.92)";
    ctx.font = `600 ${Math.floor(tileSize * 0.055)}px Aeonik, sans-serif`;
    ctx.textBaseline = "middle";
    ctx.fillText(photo.caption || "", x + tileSize * 0.06, y + tileSize * 0.45);

    ctx.fillStyle = "rgba(245,240,255,0.45)";
    ctx.font = `400 ${Math.floor(tileSize * 0.04)}px Aeonik, sans-serif`;
    ctx.fillText(photo.meta || "", x + tileSize * 0.06, y + tileSize * 0.68);
  });

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.minFilter = THREE.LinearFilter;
  texture.magFilter = THREE.LinearFilter;
  texture.generateMipmaps = false;
  texture.needsUpdate = true;
  return texture;
}

function cellIndexFromOffset(offset, zoom, resolution, samplePos, cellSize) {
  if (resolution.x <= 0 || resolution.y <= 0) return 0;

  const sx = samplePos.x >= 0 ? samplePos.x : resolution.x * 0.5;
  const sy = samplePos.y >= 0 ? samplePos.y : resolution.y * 0.5;

  const screenUV = new THREE.Vector2(
    (sx / resolution.x) * 2 - 1,
    -((sy / resolution.y) * 2 - 1),
  );
  const radius = screenUV.length();
  const distortion = 1 - 0.08 * radius * radius;
  const distorted = screenUV.clone().multiplyScalar(distortion);
  const aspect = resolution.x / resolution.y;
  const world = new THREE.Vector2(distorted.x * aspect, distorted.y);
  world.multiplyScalar(zoom);
  world.add(offset);

  const cellIdX = Math.floor(world.x / cellSize);
  const cellIdY = Math.floor(world.y / cellSize);
  const count = GALLERY_PHOTOS.length;
  let texIndex = (cellIdX + cellIdY * 3) % count;
  if (texIndex < 0) texIndex += count;
  return texIndex;
}

function pointerDistance(a, b) {
  const dx = a.x - b.x;
  const dy = a.y - b.y;
  return Math.hypot(dx, dy);
}

function pointerMidpoint(a, b) {
  return { x: (a.x + b.x) * 0.5, y: (a.y + b.y) * 0.5 };
}

export default function InfiniteGallery() {
  const mountRef = useRef(null);
  const [activeCaption, setActiveCaption] = useState(GALLERY_PHOTOS[0]);
  const [isDragging, setIsDragging] = useState(false);
  const [ready, setReady] = useState(false);
  const [touchUi, setTouchUi] = useState(() => isCoarsePointer());

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    let cancelled = false;
    let rafId = 0;
    const coarse = isCoarsePointer();
    setTouchUi(coarse);

    const startZoom = coarse ? 2.05 : 1.55;
    const friction = coarse ? FRICTION_TOUCH : FRICTION_DESKTOP;
    const lerp = coarse ? LERP_TOUCH : LERP_DESKTOP;
    const maxDpr = coarse ? 1.5 : 2;
    const atlasTile = coarse ? 384 : 512;

    const scene = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0.1, 10);
    camera.position.z = 1;

    const renderer = new THREE.WebGLRenderer({
      antialias: !coarse,
      alpha: false,
      powerPreference: coarse ? "default" : "high-performance",
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, maxDpr));
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    Object.assign(renderer.domElement.style, {
      width: "100%",
      height: "100%",
      display: "block",
      touchAction: "none",
      cursor: "grab",
      WebkitUserSelect: "none",
      userSelect: "none",
    });
    container.appendChild(renderer.domElement);

    const uniforms = {
      uOffset: { value: new THREE.Vector2(0, 0) },
      uResolution: {
        value: new THREE.Vector2(container.clientWidth, container.clientHeight),
      },
      uBorderColor: { value: new THREE.Vector4(1, 1, 1, 0.08) },
      uHoverColor: { value: new THREE.Vector4(0.88, 0.94, 0.73, 0.12) },
      uBackgroundColor: { value: new THREE.Vector4(0.08, 0.08, 0.08, 1) },
      uMousePos: { value: new THREE.Vector2(-1, -1) },
      uZoom: { value: startZoom },
      uCellSize: { value: CELL_SIZE },
      uTextureCount: { value: GALLERY_PHOTOS.length },
      uImageAtlas: { value: null },
      uTextAtlas: { value: null },
      uHasTextAtlas: { value: 0 },
    };

    // Prefer center cell for captions on touch devices
    if (coarse) {
      uniforms.uMousePos.value.set(
        container.clientWidth * 0.5,
        container.clientHeight * 0.5,
      );
    }

    const material = new THREE.ShaderMaterial({
      uniforms,
      vertexShader,
      fragmentShader,
    });
    const mesh = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), material);
    scene.add(mesh);

    const offset = new THREE.Vector2(0, 0);
    const target = new THREE.Vector2(0, 0);
    const velocity = new THREE.Vector2(0, 0);
    let zoom = startZoom;
    let targetZoom = startZoom;

    /** @type {Map<number, { x: number, y: number }>} */
    const activePointers = new Map();
    let pinchStartDist = 0;
    let pinchStartZoom = startZoom;
    let isPinching = false;
    let dragActive = false;

    const syncCaption = () => {
      const idx = cellIndexFromOffset(
        offset,
        zoom,
        uniforms.uResolution.value,
        uniforms.uMousePos.value,
        CELL_SIZE,
      );
      const photo = GALLERY_PHOTOS[idx] || GALLERY_PHOTOS[0];
      setActiveCaption(photo);
    };

    Promise.all([
      buildImageAtlas(GALLERY_PHOTOS, atlasTile),
      buildTextAtlas(GALLERY_PHOTOS, atlasTile),
    ])
      .then(([imageAtlas, textAtlas]) => {
        if (cancelled) {
          imageAtlas.dispose();
          textAtlas.dispose();
          return;
        }
        uniforms.uImageAtlas.value = imageAtlas;
        uniforms.uTextAtlas.value = textAtlas;
        uniforms.uHasTextAtlas.value = 1;
        material.needsUpdate = true;
        setReady(true);
      })
      .catch(() => {
        if (!cancelled) setReady(true);
      });

    const updateSampleFromEvent = (event) => {
      const rect = renderer.domElement.getBoundingClientRect();
      uniforms.uMousePos.value.set(
        event.clientX - rect.left,
        event.clientY - rect.top,
      );
    };

    const applyPanDelta = (dx, dy, rect) => {
      const aspect = rect.width / Math.max(rect.height, 1);
      const worldScale = (zoom * 2) / Math.max(rect.height, 1);
      // Slightly stronger pan on touch so one finger feels snappy
      const gain = coarse ? 1.15 : 1;
      target.x -= dx * worldScale * aspect * gain;
      target.y += dy * worldScale * gain;
      velocity.x = -dx * worldScale * aspect * gain;
      velocity.y = dy * worldScale * gain;
    };

    const onPointerDown = (event) => {
      event.preventDefault();
      activePointers.set(event.pointerId, {
        x: event.clientX,
        y: event.clientY,
      });

      try {
        renderer.domElement.setPointerCapture(event.pointerId);
      } catch {
        /* ignore capture failures on some browsers */
      }

      updateSampleFromEvent(event);

      if (activePointers.size === 2) {
        const [a, b] = [...activePointers.values()];
        pinchStartDist = Math.max(pointerDistance(a, b), 1);
        pinchStartZoom = targetZoom;
        isPinching = true;
        dragActive = false;
        velocity.set(0, 0);
        setIsDragging(true);
        return;
      }

      if (activePointers.size === 1) {
        isPinching = false;
        dragActive = true;
        velocity.set(0, 0);
        renderer.domElement.style.cursor = "grabbing";
        setIsDragging(true);
      }
    };

    const onPointerMove = (event) => {
      if (!activePointers.has(event.pointerId)) {
        // Hover tracking for desktop only
        if (!coarse && activePointers.size === 0) {
          updateSampleFromEvent(event);
        }
        return;
      }

      event.preventDefault();
      const prev = activePointers.get(event.pointerId);
      activePointers.set(event.pointerId, {
        x: event.clientX,
        y: event.clientY,
      });

      const rect = renderer.domElement.getBoundingClientRect();

      if (activePointers.size >= 2 && isPinching) {
        const [a, b] = [...activePointers.values()];
        const dist = Math.max(pointerDistance(a, b), 1);
        const mid = pointerMidpoint(a, b);
        uniforms.uMousePos.value.set(mid.x - rect.left, mid.y - rect.top);

        // Match trackpad: pinch out → zoom in (lower uZoom = larger cells)
        const ratio = dist / pinchStartDist;
        targetZoom = THREE.MathUtils.clamp(
          pinchStartZoom / ratio,
          MIN_ZOOM,
          MAX_ZOOM,
        );
        return;
      }

      if (!dragActive || activePointers.size !== 1) return;

      updateSampleFromEvent(event);
      const dx = event.clientX - prev.x;
      const dy = event.clientY - prev.y;
      applyPanDelta(dx, dy, rect);
    };

    const endPointer = (event) => {
      if (!activePointers.has(event.pointerId)) return;
      activePointers.delete(event.pointerId);

      try {
        renderer.domElement.releasePointerCapture(event.pointerId);
      } catch {
        /* ignore */
      }

      if (activePointers.size === 0) {
        isPinching = false;
        dragActive = false;
        renderer.domElement.style.cursor = "grab";
        setIsDragging(false);
        if (coarse) {
          const res = uniforms.uResolution.value;
          uniforms.uMousePos.value.set(res.x * 0.5, res.y * 0.5);
        }
        return;
      }

      if (activePointers.size === 1) {
        // Drop from pinch → continue single-finger drag
        isPinching = false;
        dragActive = true;
        const remaining = [...activePointers.values()][0];
        // Reset so next move doesn't jump
        activePointers.set([...activePointers.keys()][0], {
          x: remaining.x,
          y: remaining.y,
        });
      }
    };

    const onWheel = (event) => {
      event.preventDefault();
      if (event.ctrlKey || event.metaKey) {
        targetZoom = THREE.MathUtils.clamp(
          targetZoom * (1 + event.deltaY * 0.0015),
          MIN_ZOOM,
          MAX_ZOOM,
        );
      } else {
        const rect = renderer.domElement.getBoundingClientRect();
        const aspect = rect.width / Math.max(rect.height, 1);
        const worldScale = (zoom * 2) / Math.max(rect.height, 1);
        target.x += event.deltaX * worldScale * aspect * 0.85;
        target.y -= event.deltaY * worldScale * 0.85;
        velocity.x = event.deltaX * worldScale * aspect * 0.2;
        velocity.y = -event.deltaY * worldScale * 0.2;
      }
    };

    const onResize = () => {
      if (!container) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      if (!w || !h) return;
      renderer.setSize(w, h);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, maxDpr));
      uniforms.uResolution.value.set(w, h);
      if (coarse && activePointers.size === 0) {
        uniforms.uMousePos.value.set(w * 0.5, h * 0.5);
      }
    };

    // Block browser gestures (swipe-back, overscroll) on the canvas
    const onTouchStart = (event) => {
      if (event.cancelable) event.preventDefault();
    };
    const onTouchMove = (event) => {
      if (event.cancelable) event.preventDefault();
    };

    const el = renderer.domElement;
    el.addEventListener("pointerdown", onPointerDown);
    el.addEventListener("pointermove", onPointerMove);
    el.addEventListener("pointerup", endPointer);
    el.addEventListener("pointercancel", endPointer);
    // Don't end drag on leave — mobile browsers fire this inconsistently
    el.addEventListener("lostpointercapture", endPointer);
    el.addEventListener("wheel", onWheel, { passive: false });
    el.addEventListener("touchstart", onTouchStart, { passive: false });
    el.addEventListener("touchmove", onTouchMove, { passive: false });
    window.addEventListener("resize", onResize);
    window.visualViewport?.addEventListener("resize", onResize);
    window.visualViewport?.addEventListener("scroll", onResize);

    let captionTick = 0;
    let lastCaptionIdx = -1;
    let playing = true;
    let animate = () => {};

    const gate = createPlayGate(container, { rootMargin: "0px" });
    const unsubGate = gate.subscribe((active) => {
      playing = active;
      if (active && !cancelled && !rafId) {
        rafId = requestAnimationFrame(animate);
      }
    });

    animate = () => {
      if (cancelled) return;
      if (!playing || !gate.active) {
        rafId = 0;
        return;
      }
      rafId = requestAnimationFrame(animate);

      if (!dragActive && !isPinching) {
        target.x += velocity.x;
        target.y += velocity.y;
        velocity.multiplyScalar(friction);
        if (Math.abs(velocity.x) < 0.00001) velocity.x = 0;
        if (Math.abs(velocity.y) < 0.00001) velocity.y = 0;
      }

      offset.x += (target.x - offset.x) * lerp;
      offset.y += (target.y - offset.y) * lerp;
      zoom += (targetZoom - zoom) * (coarse ? 0.18 : 0.1);

      uniforms.uOffset.value.copy(offset);
      uniforms.uZoom.value = zoom;

      captionTick += 1;
      if (captionTick % 10 === 0) {
        const idx = cellIndexFromOffset(
          offset,
          zoom,
          uniforms.uResolution.value,
          uniforms.uMousePos.value,
          CELL_SIZE,
        );
        if (idx !== lastCaptionIdx) {
          lastCaptionIdx = idx;
          syncCaption();
        }
      }

      renderer.render(scene, camera);
    };

    if (gate.active) {
      rafId = requestAnimationFrame(animate);
    }

    return () => {
      cancelled = true;
      unsubGate();
      gate.destroy();
      cancelAnimationFrame(rafId);
      el.removeEventListener("pointerdown", onPointerDown);
      el.removeEventListener("pointermove", onPointerMove);
      el.removeEventListener("pointerup", endPointer);
      el.removeEventListener("pointercancel", endPointer);
      el.removeEventListener("lostpointercapture", endPointer);
      el.removeEventListener("wheel", onWheel);
      el.removeEventListener("touchstart", onTouchStart);
      el.removeEventListener("touchmove", onTouchMove);
      window.removeEventListener("resize", onResize);
      window.visualViewport?.removeEventListener("resize", onResize);
      window.visualViewport?.removeEventListener("scroll", onResize);

      uniforms.uImageAtlas.value?.dispose();
      uniforms.uTextAtlas.value?.dispose();
      material.dispose();
      mesh.geometry.dispose();
      renderer.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <div className="relative h-[100dvh] w-full overflow-hidden overscroll-none bg-[#141414] touch-none select-none">
      <div ref={mountRef} className="absolute inset-0 touch-none" />

      {!ready && (
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
          <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-white/40">
            Loading frames…
          </p>
        </div>
      )}

      <div
        className="pointer-events-none absolute inset-x-0 bottom-0 z-10 flex flex-col items-center gap-1.5 px-4 pt-16 sm:gap-2 sm:px-6 sm:pt-24 sm:pb-8"
        style={{
          paddingBottom: "max(1.25rem, env(safe-area-inset-bottom, 0px))",
          background:
            "linear-gradient(to top, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.35) 45%, transparent 100%)",
        }}
      >
        <p className="max-w-[18rem] text-center font-display text-xl leading-tight text-[var(--heading)] sm:max-w-none sm:text-3xl">
          {activeCaption?.caption}
        </p>
        <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-white/55 sm:text-[11px]">
          {activeCaption?.meta}
        </p>
        <p className="mt-2 font-mono text-[9px] uppercase tracking-[0.2em] text-white/35 sm:mt-3 sm:text-[10px] sm:tracking-[0.22em]">
          {isDragging
            ? touchUi
              ? "Moving"
              : "Dragging"
            : touchUi
              ? "Drag · Pinch to zoom"
              : "Drag · Scroll · Ctrl+Scroll zoom"}
        </p>
      </div>
    </div>
  );
}
