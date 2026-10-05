import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { prefersReducedMotion } from "@shared/hooks/useAnimationLifecycle";

gsap.registerPlugin(ScrollTrigger);

/**
 * Sui sequence with a repeatable state machine.
 *
 * Phases: idle → forward → exited → reverse → idle → …
 *
 * A slim progress line at the bottom edge is scrubbed by a dedicated
 * ScrollTrigger; the canvas waits fully off-screen and only slides up to
 * cover the viewport once the line fills.
 */
export default function ScrollSequence({
  frames = [],
  trigger = "[data-seq-trigger]",
  reveal = "[data-seq-reveal]",
  revealHeading = "[data-seq-reveal-heading]",
  revealBody = "[data-seq-reveal-body]",
  revealFrame = 50,
  loopStart = 10,
  loopEnd = 48,
  fps = 45,
  className = "",
}) {
  const stageRef = useRef(null);
  const barRef = useRef(null);
  const canvasRef = useRef(null);
  const imagesRef = useRef([]);
  const playerRef = useRef(null);
  const sizeRef = useRef({ w: 0, h: 0 });
  const drawCoverRef = useRef(() => false);
  const revealedRef = useRef(false);
  const [loaded, setLoaded] = useState(0);
  const [reduced, setReduced] = useState(() => prefersReducedMotion());

  const total = frames.length;

  useEffect(() => {
    if (typeof window === "undefined" || !window.matchMedia) return undefined;
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const onChange = () => setReduced(mq.matches);
    mq.addEventListener?.("change", onChange);
    return () => mq.removeEventListener?.("change", onChange);
  }, []);

  useEffect(() => {
    if (!total) return undefined;
    let cancelled = false;
    let count = 0;

    imagesRef.current = frames.map((src) => {
      const img = new Image();
      img.decoding = "async";
      img.onload = img.onerror = () => {
        if (cancelled) return;
        count += 1;
        setLoaded(count);
      };
      img.src = src;
      return img;
    });

    return () => {
      cancelled = true;
    };
  }, [frames, total]);

  useEffect(() => {
    if (!loaded) return;
    drawCoverRef.current(playerRef.current?.currentFrame ?? loopStart);
  }, [loaded, loopStart]);

  useEffect(() => {
    const stage = stageRef.current;
    const bar = barRef.current;
    const canvas = canvasRef.current;
    const triggerEl = document.querySelector(trigger);
    if (!stage || !bar || !canvas || !triggerEl || !total) return undefined;

    const ctx = canvas.getContext("2d", { willReadFrequently: false });
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const last = total - 1;
    const loopA = Math.min(Math.max(0, loopStart), last);
    const loopB = Math.min(Math.max(loopA + 1, loopEnd), last);
    const revealAt = Math.min(Math.max(0, revealFrame), last);

    const headingEl = () => document.querySelector(revealHeading);
    const bodyEl = () => document.querySelector(revealBody);
    const revealEl = () => document.querySelector(reveal);

    const drawCover = (index) => {
      const img = imagesRef.current[index];
      const { w, h } = sizeRef.current;
      if (!img || !img.complete || !img.naturalWidth || !w || !h) return false;

      const imageRatio = img.naturalWidth / img.naturalHeight;
      const canvasRatio = w / h;
      let sx;
      let sy;
      let sw;
      let sh;
      if (imageRatio > canvasRatio) {
        sh = img.naturalHeight;
        sw = sh * canvasRatio;
        sy = 0;
        sx = (img.naturalWidth - sw) / 2;
      } else {
        sw = img.naturalWidth;
        sh = sw / canvasRatio;
        sx = 0;
        sy = (img.naturalHeight - sh) / 2;
      }
      ctx.clearRect(0, 0, w, h);
      ctx.drawImage(img, sx, sy, sw, sh, 0, 0, w, h);
      return true;
    };
    drawCoverRef.current = drawCover;

    const resize = () => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      sizeRef.current = { w, h };
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      drawCover(playerRef.current?.currentFrame ?? loopA);
    };

    resize();
    window.addEventListener("resize", resize);

    if (reduced) {
      gsap.set(stage, { yPercent: 100, autoAlpha: 0 });
      gsap.set(bar, { autoAlpha: 0 });
      const hEl = headingEl();
      const bEl = bodyEl();
      if (hEl) gsap.set(hEl, { opacity: 1, y: 0, scale: 1 });
      if (bEl) gsap.set(bEl, { opacity: 1, y: 0 });
      return () => window.removeEventListener("resize", resize);
    }

    const showReveal = () => {
      if (revealedRef.current) return;
      revealedRef.current = true;
      const hEl = headingEl();
      const bEl = bodyEl();
      if (hEl) {
        gsap.fromTo(
          hEl,
          { y: "50%", scale: 0.7, opacity: 0 },
          { scale: 1, y: "0%", opacity: 1, duration: 1 },
        );
      }
      if (bEl) {
        gsap.fromTo(
          bEl,
          { y: "20%", opacity: 0 },
          {
            y: "0%",
            opacity: 1,
            duration: 1,
            ease: "power2.out",
            delay: 0.5,
          },
        );
      }
    };

    const hideReveal = () => {
      revealedRef.current = false;
      const hEl = headingEl();
      const bEl = bodyEl();
      if (hEl) {
        gsap.killTweensOf(hEl);
        gsap.to(hEl, {
          y: "50%",
          scale: 0.7,
          opacity: 0,
          duration: 0.56,
          ease: "power2.in",
        });
      }
      if (bEl) {
        gsap.killTweensOf(bEl);
        gsap.to(bEl, {
          y: "30%",
          opacity: 0,
          duration: 0.5,
          ease: "power2.in",
        });
      }
    };

    // --- ImageSequencePlayer ---
    const player = {
      currentFrame: loopA,
      direction: 1,
      mode: "loop",
      running: false,
      rafId: null,
      onFrame: () => {},
      onComplete: () => {},
      onReverseComplete: () => {},
      draw() {
        drawCover(this.currentFrame);
        this.onFrame(this.currentFrame);
      },
      stop() {
        if (this.rafId) cancelAnimationFrame(this.rafId);
        this.rafId = null;
        this.running = false;
      },
      play() {
        if (this.running) return;
        this.running = true;
        let lastTs = performance.now();
        const frameMs = 1000 / fps;

        const tick = (now) => {
          if (!this.running) return;
          const elapsed = now - lastTs;
          if (elapsed >= frameMs) {
            this.draw();
            this.currentFrame += this.direction;

            if (this.mode === "loop") {
              if (this.currentFrame >= loopB) this.direction = -1;
              else if (this.currentFrame <= loopA) this.direction = 1;
            } else if (this.mode === "playthrough") {
              if (this.currentFrame >= last) {
                this.stop();
                this.currentFrame = last;
                this.draw();
                this.onComplete();
                return;
              }
            } else if (this.mode === "reverse") {
              if (this.currentFrame <= loopB) {
                this.stop();
                this.currentFrame = loopB;
                this.mode = "loop";
                this.direction = -1;
                this.draw();
                this.play();
                this.onReverseComplete();
                return;
              }
            }
            lastTs = now - (elapsed % frameMs);
          }
          this.rafId = requestAnimationFrame(tick);
        };
        this.rafId = requestAnimationFrame(tick);
      },
      playThrough() {
        this.stop();
        const stepBack = () => {
          if (this.currentFrame > loopA) {
            this.currentFrame -= 1;
            this.draw();
            requestAnimationFrame(stepBack);
          } else {
            this.currentFrame = loopA;
            this.direction = 1;
            this.mode = "playthrough";
            this.play();
          }
        };
        stepBack();
      },
      reverseToLoop() {
        this.mode = "reverse";
        this.direction = -1;
        if (!this.running) this.play();
      },
    };
    playerRef.current = player;

    gsap.set(stage, { y: 0, yPercent: 100, autoAlpha: 0 });
    gsap.set(bar, { scaleX: 0, autoAlpha: 0 });

    /**
     * idle     — progress line scrubbing, canvas hidden below the fold
     * forward  — playThrough in progress
     * exited   — last frame done, canvas off-screen, waiting for scroll-back
     * reverse  — reverseToLoop in progress
     */
    let phase = "idle";
    let progressScrub = true;

    const getLenis = () => window.__lenis;
    const stopScroll = () => {
      const l = getLenis();
      if (l?.stop) l.stop();
      else document.documentElement.style.overflow = "hidden";
    };
    const startScroll = () => {
      const l = getLenis();
      if (l?.start) l.start();
      else document.documentElement.style.overflow = "";
    };
    const scrollToY = (y) => {
      const l = getLenis();
      if (l?.scrollTo) l.scrollTo(y, { immediate: true, force: true });
      else window.scrollTo(0, y);
    };
    const scrollToEl = (el, offset = 0) => {
      if (!el) return;
      const l = getLenis();
      if (l?.scrollTo) {
        l.scrollTo(el, { offset, immediate: true, force: true });
      } else {
        window.scrollTo(
          0,
          el.getBoundingClientRect().top + window.scrollY + offset,
        );
      }
    };

    const parkAtTriggerEnd = () => {
      const top = triggerEl.getBoundingClientRect().top + window.scrollY;
      const y = top + triggerEl.offsetHeight - window.innerHeight - 64;
      scrollToY(Math.max(0, y));
    };

    const syncProgress = (progress) => {
      const p = Math.min(1, Math.max(0, progress));
      gsap.set(bar, { scaleX: p, autoAlpha: p <= 0.005 ? 0 : 1 });
    };

    const onLenisScroll = () => ScrollTrigger.update();
    getLenis()?.on?.("scroll", onLenisScroll);

    player.mode = "loop";
    player.play();

    player.onFrame = (frame) => {
      if (player.mode === "reverse") return;
      if (frame === revealAt) showReveal();
    };

    const startForward = () => {
      if (phase !== "idle") return;
      phase = "forward";
      progressScrub = false;
      gsap.to(bar, { autoAlpha: 0, duration: 0.25 });
      gsap.set(stage, { yPercent: 100, autoAlpha: 1 });

      stopScroll();
      player.playThrough();

      gsap.to(stage, {
        yPercent: 0,
        duration: 1.133,
        ease: "power2.out",
        onComplete: () => {
          startScroll();
          const land = revealEl();
          if (land) scrollToEl(land, 100);
        },
      });
    };

    const startReverse = () => {
      if (phase !== "exited") return;
      phase = "reverse";
      progressScrub = false;
      stopScroll();

      // Always start reverse from the last frame (mirrors forward end state).
      player.stop();
      player.currentFrame = last;
      player.draw();
      player.reverseToLoop();

      hideReveal();
      gsap.set(stage, { autoAlpha: 1, yPercent: 0 });
    };

    player.onComplete = () => {
      // Forward finished — canvas exits upward, unlock scroll.
      phase = "exited";
      window.setTimeout(() => {
        gsap.set(stage, { yPercent: -100 });
        startScroll();
      }, 600);
    };

    player.onReverseComplete = () => {
      // Park inside trigger (not past it), slide canvas back down, return idle.
      startScroll();
      parkAtTriggerEnd();

      gsap.to(stage, {
        yPercent: 100,
        duration: 1.133,
        ease: "power2.out",
        onComplete: () => {
          gsap.set(stage, { autoAlpha: 0 });
          phase = "idle";
          progressScrub = true;
          // Sync the line to wherever we parked.
          const st = ScrollTrigger.getById("genesisCanvasScroll");
          syncProgress(st ? st.progress : 1);
          startScroll();
        },
      });
    };

    // Single ScrollTrigger — progress scrub + progress-edge phase transitions.
    // Progress edges are re-armable every cycle (unlike one-shot onLeave alone).
    const st = ScrollTrigger.create({
      id: "genesisCanvasScroll",
      trigger: triggerEl,
      start: "top top",
      end: "bottom bottom",
      scrub: true,
      invalidateOnRefresh: true,
      onUpdate: (self) => {
        if (progressScrub) syncProgress(self.progress);

        // Crossing the end going down → forward
        if (self.progress >= 0.995 && self.direction === 1) {
          startForward();
        }

        // Crossing back in from past the end going up → reverse
        if (self.progress < 0.98 && self.direction === -1) {
          startReverse();
        }
      },
      onLeave: () => {
        startForward();
      },
      onEnterBack: () => {
        startReverse();
      },
    });

    if (st.progress > 0 && st.progress < 1) {
      syncProgress(st.progress);
    }

    return () => {
      player.stop();
      st.kill();
      window.removeEventListener("resize", resize);
      getLenis()?.off?.("scroll", onLenisScroll);
      startScroll();
      gsap.set([stage, bar], { clearProps: "transform,opacity,visibility" });
    };
  }, [
    total,
    reduced,
    loopStart,
    loopEnd,
    fps,
    trigger,
    reveal,
    revealHeading,
    revealBody,
    revealFrame,
  ]);

  return (
    <>
      <div
        ref={barRef}
        className="pointer-events-none fixed inset-x-0 bottom-0 z-[30] h-[2px] origin-left"
        style={{
          transform: "scaleX(0)",
          visibility: "hidden",
          backgroundImage: "linear-gradient(90deg, var(--brand), var(--heading))",
          boxShadow: "0 0 12px rgba(196, 181, 253, 0.45)",
        }}
        aria-hidden="true"
      />
      <div
        ref={stageRef}
        className={`pointer-events-none fixed inset-x-0 top-0 z-[30] h-[100vh] overflow-hidden ${className}`}
        style={{ transform: "translateY(100%)", visibility: "hidden" }}
        aria-hidden="true"
      >
        <canvas
          ref={canvasRef}
          className="absolute inset-0 block h-full w-full"
        />
        {total > 0 && loaded < total && (
          <div className="absolute bottom-6 right-6 z-[4] font-mono text-[11px] uppercase tracking-[0.2em] text-white/50">
            {Math.round((loaded / total) * 100)}%
          </div>
        )}
      </div>
    </>
  );
}
