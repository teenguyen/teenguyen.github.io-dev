"use client";

import { useCallback, useEffect, useRef, type RefObject } from "react";
import clsx from "clsx";
import {
  AUTO_SPIN_DEG_PER_SEC,
  DRAG_LAT_PER_PX,
  DRAG_LON_PER_PX,
  DRAG_SPEED_REF_PX_PER_SEC,
  INTERACTIVE_IDLE_RESUME_MS,
  MERCATOR_PHI_CLAMP,
  STAR_REVEAL_DURATION_MS,
  THEME_COLOR_25_FALLBACK,
  THEME_COLOR_48_SOLID_FALLBACK,
  ZOOM_WHEEL_SENSITIVITY,
  ZOOM_CLOSEST_FACTOR,
  type CanvasLayout,
  type ConstellationNamePoint,
  type SkyData,
} from "./types";
import { fetchConstellationNames, fetchStarsAndLines } from "./loadSkyData";
import { buildMercatorProjection, computeGlobeFitScale } from "./projection";
import { paintSkyFrame, resolveLabelFont } from "./paintSkyFrame";
import styles from "./Starmap.module.css";

type StarmapProps = {
  /** Root element (canvas host); parent keeps this ref for layout/imperative access e.g. parallax transforms. */
  rootRef: RefObject<HTMLDivElement | null>;
  className?: string;
  beginCelestialReveal?: boolean;
  playing?: boolean;
  interactive?: boolean;
};

function clamp01(value: number) {
  return Math.min(1, Math.max(0, value));
}

const DRAG_SPEED_CAP = 2;

export default function Starmap({
  rootRef,
  className,
  beginCelestialReveal = false,
  playing = false,
  interactive = false,
}: StarmapProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const dataRef = useRef<SkyData | null>(null);
  const namesCacheRef = useRef<ConstellationNamePoint[] | null>(null);
  const rafRef = useRef<number | null>(null);
  const canvasLayoutRef = useRef<CanvasLayout | null>(null);
  const themeColor48Ref = useRef<string>(THEME_COLOR_48_SOLID_FALLBACK);
  const themeColor25Ref = useRef<string>(THEME_COLOR_25_FALLBACK);
  const animationStartRef = useRef<number | null>(null);
  const revealStartRef = useRef<number | null>(null);
  const beginCelestialRevealRef = useRef(beginCelestialReveal);
  const playingRef = useRef(playing);
  const interactiveRef = useRef(interactive);

  const inViewRef = useRef(true);
  const scaleMinFitRef = useRef(0);

  const userLambdaRef = useRef(0);
  const userPhiRef = useRef(0);
  const userZoomFactorRef = useRef(1);

  const autoSpinPausedRef = useRef(false);
  const frozenAutoSpinLambdaRef = useRef(0);
  const idleTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const pointerDraggingRef = useRef(false);
  const lastPointerRef = useRef<{ x: number; y: number; t: number } | null>(
    null,
  );

  const readThemeColors = useCallback(() => {
    const rootStyles = getComputedStyle(document.documentElement);
    const themeColor48 = rootStyles
      .getPropertyValue("--theme-color-48-solid")
      .trim();
    const themeColor25 = rootStyles.getPropertyValue("--theme-color-25").trim();
    themeColor48Ref.current = themeColor48 || THEME_COLOR_48_SOLID_FALLBACK;
    themeColor25Ref.current = themeColor25 || THEME_COLOR_25_FALLBACK;
  }, []);

  const clearIdleTimer = useCallback(() => {
    if (idleTimerRef.current !== null) {
      clearTimeout(idleTimerRef.current);
      idleTimerRef.current = null;
    }
  }, []);

  const draw = useCallback(
    (timeMs: number) => {
      const container = rootRef.current;
      const canvas = canvasRef.current;
      const data = dataRef.current;
      if (!container || !canvas || !data) return;

      const dpr = window.devicePixelRatio || 1;
      const rootEl = document.documentElement;
      const vw = Math.floor(rootEl.clientWidth || window.innerWidth);
      const vh = Math.floor(rootEl.clientHeight || window.innerHeight);

      const ow = Math.floor(container.offsetWidth);
      const oh = Math.floor(container.offsetHeight);
      const cw = Math.floor(container.clientWidth);
      const ch = Math.floor(container.clientHeight);

      let width = ow > 0 ? ow : cw;
      let height = oh > 0 ? oh : ch;
      if (width <= 0 || height <= 0) {
        const r = container.getBoundingClientRect();
        width = Math.floor(r.width);
        height = Math.floor(r.height);
      }
      if (width <= 0 || height <= 0) {
        width = vw;
        height = vh;
      }
      width = Math.max(1, width);
      height = Math.max(1, height);

      const perspectiveHeight = Math.min(height, vh);

      const lastLayout = canvasLayoutRef.current;
      const layoutChanged =
        !lastLayout ||
        lastLayout.width !== width ||
        lastLayout.height !== height ||
        lastLayout.dpr !== dpr;

      if (layoutChanged) {
        canvas.width = Math.floor(width * dpr);
        canvas.height = Math.floor(height * dpr);
        canvas.style.width = `${width}px`;
        canvas.style.height = `${height}px`;
        canvasLayoutRef.current = { width, height, dpr };
        if (interactiveRef.current) {
          scaleMinFitRef.current = computeGlobeFitScale(width, height);
        }
      }

      const ctx = canvas.getContext("2d");
      if (!ctx) return;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, width, height);

      const themeColor = themeColor48Ref.current;
      const themeColor25 = themeColor25Ref.current;
      let starOpacity = 0;
      let constellationDrawDistance = 0;
      let constellationsVisible = false;

      if (playingRef.current) {
        starOpacity = 1;
        constellationDrawDistance = Number.POSITIVE_INFINITY;
        constellationsVisible = true;
      } else if (beginCelestialRevealRef.current) {
        if (revealStartRef.current === null) {
          revealStartRef.current = timeMs;
        }
        const revealElapsedMs = timeMs - revealStartRef.current;
        starOpacity = clamp01(revealElapsedMs / STAR_REVEAL_DURATION_MS);
        constellationDrawDistance =
          (Math.max(0, revealElapsedMs - STAR_REVEAL_DURATION_MS) / 1000) * 250;
        constellationsVisible = revealElapsedMs > STAR_REVEAL_DURATION_MS;
      }

      const baseScale = Math.max(0.72, perspectiveHeight / 1000) * 1000;
      if (interactiveRef.current && scaleMinFitRef.current <= 0) {
        scaleMinFitRef.current = computeGlobeFitScale(width, height);
      }

      const projection = buildMercatorProjection({
        width,
        height,
        perspectiveHeight,
        timeMs,
        animationStartMs: animationStartRef.current,
        interactive: interactiveRef.current,
        userLambda: userLambdaRef.current,
        userPhi: userPhiRef.current,
        userZoomFactor: userZoomFactorRef.current,
        scaleMinFit: scaleMinFitRef.current || baseScale,
        autoSpinPaused: interactiveRef.current
          ? autoSpinPausedRef.current
          : false,
        frozenAutoSpinLambda: frozenAutoSpinLambdaRef.current,
      });

      paintSkyFrame({
        ctx,
        width,
        height,
        perspectiveHeight,
        projection,
        themeColor,
        themeColor25,
        data,
        starOpacity,
        constellationDrawDistance,
        constellationsVisible,
        showLabels:
          interactiveRef.current &&
          Boolean(
            data.constellationNames && data.constellationNames.length > 0,
          ),
        labelFont: resolveLabelFont(),
      });
    },
    [rootRef],
  );

  const requestDraw = useCallback(() => {
    if (rafRef.current !== null) return;
    rafRef.current = requestAnimationFrame((timeMs) => {
      rafRef.current = null;
      draw(timeMs);
    });
  }, [draw]);

  const startAnimation = useCallback(() => {
    const shouldRunTick = playingRef.current || inViewRef.current;
    if (!shouldRunTick) return;
    if (rafRef.current !== null) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }
    const tick = (timeMs: number) => {
      const container = rootRef.current;
      if (!container) {
        rafRef.current = null;
        return;
      }

      const shouldRun = playingRef.current || inViewRef.current;
      if (!shouldRun) {
        rafRef.current = null;
        return;
      }

      if (animationStartRef.current === null) {
        animationStartRef.current = timeMs;
      }
      draw(timeMs);
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
  }, [draw, rootRef]);

  const scheduleAutoSpinResume = useCallback(() => {
    clearIdleTimer();
    idleTimerRef.current = setTimeout(() => {
      idleTimerRef.current = null;
      if (!interactiveRef.current) return;
      const now = performance.now();
      autoSpinPausedRef.current = false;
      animationStartRef.current =
        now + (frozenAutoSpinLambdaRef.current * 1000) / AUTO_SPIN_DEG_PER_SEC;
      startAnimation();
    }, INTERACTIVE_IDLE_RESUME_MS);
  }, [clearIdleTimer, startAnimation]);

  useEffect(() => {
    const el = rootRef.current;
    if (!el) return;

    const obs = new IntersectionObserver(
      (entries) => {
        const on = !!entries[0]?.isIntersecting;
        inViewRef.current = on;
        if (on) {
          startAnimation();
        } else if (!playingRef.current && rafRef.current !== null) {
          cancelAnimationFrame(rafRef.current);
          rafRef.current = null;
        }
      },
      { threshold: 0 },
    );

    obs.observe(el);
    return () => obs.disconnect();
  }, [rootRef, startAnimation]);

  useEffect(() => {
    let cancelled = false;
    readThemeColors();

    async function loadData() {
      try {
        const base = await fetchStarsAndLines();
        if (cancelled) return;

        const extras =
          interactiveRef.current && namesCacheRef.current
            ? { constellationNames: namesCacheRef.current }
            : {};

        dataRef.current = { ...base, ...extras };
        startAnimation();
      } catch (error) {
        console.error("Failed to load starmap data:", error);
      }
    }

    loadData();

    return () => {
      cancelled = true;
    };
  }, [readThemeColors, startAnimation]);

  useEffect(() => {
    interactiveRef.current = interactive;
    if (interactive && scaleMinFitRef.current === 0) {
      const container = rootRef.current;
      if (container) {
        const r = container.getBoundingClientRect();
        const w = Math.max(1, Math.floor(r.width));
        const h = Math.max(1, Math.floor(r.height));
        scaleMinFitRef.current = computeGlobeFitScale(w, h);
      }
    }
    if (!interactive) {
      clearIdleTimer();
      autoSpinPausedRef.current = false;
      userLambdaRef.current = 0;
      userPhiRef.current = 0;
      userZoomFactorRef.current = 1;
      scaleMinFitRef.current = 0;
      namesCacheRef.current = null;
      if (dataRef.current) {
        const { constellationNames: _drop, ...rest } = dataRef.current;
        void _drop;
        dataRef.current = rest;
      }
      requestDraw();
    }
  }, [interactive, clearIdleTimer, requestDraw, rootRef]);

  useEffect(() => {
    if (!interactive) return;
    let cancelled = false;

    async function loadNames() {
      try {
        const names = await fetchConstellationNames();
        if (cancelled) return;
        namesCacheRef.current = names;
        const d = dataRef.current;
        if (d) {
          dataRef.current = { ...d, constellationNames: names };
        }
        requestDraw();
        startAnimation();
      } catch (e) {
        console.error("Failed to load constellation names:", e);
      }
    }

    loadNames();
    return () => {
      cancelled = true;
    };
  }, [interactive, requestDraw, startAnimation]);

  useEffect(() => {
    const resizeObserver = new ResizeObserver(() => requestDraw());
    const root = rootRef.current;
    if (root) {
      resizeObserver.observe(root);
    }
    window.addEventListener("resize", requestDraw);
    window.addEventListener("resize", readThemeColors);

    return () => {
      resizeObserver.disconnect();
      window.removeEventListener("resize", requestDraw);
      window.removeEventListener("resize", readThemeColors);
      if (rafRef.current !== null) {
        cancelAnimationFrame(rafRef.current);
      }
      animationStartRef.current = null;
    };
  }, [readThemeColors, requestDraw, rootRef]);

  useEffect(() => {
    beginCelestialRevealRef.current = beginCelestialReveal;
    if (!beginCelestialReveal) {
      revealStartRef.current = null;
    }
  }, [beginCelestialReveal]);

  useEffect(() => {
    playingRef.current = playing;
    if (playing) {
      startAnimation();
    }
  }, [playing, startAnimation]);

  useEffect(() => {
    if (!interactive) return;
    const canvas = canvasRef.current;
    if (!canvas) return;

    const speedMul = (dx: number, dy: number, dt: number) => {
      const safeDt = Math.max(dt, 1);
      const speed = Math.hypot(dx, dy) / (safeDt / 1000);
      return 1 + Math.min(speed / DRAG_SPEED_REF_PX_PER_SEC, DRAG_SPEED_CAP);
    };

    const onWheel = (e: WheelEvent) => {
      if (!interactiveRef.current) return;
      e.preventDefault();
      const vh = window.innerHeight;
      const base =
        Math.max(
          0.72,
          Math.min(canvas.clientHeight || vh, vh) / 1000,
        ) * 1000;
      if (scaleMinFitRef.current <= 0) {
        const w = canvas.clientWidth || rootRef.current?.clientWidth || 400;
        const h = canvas.clientHeight || rootRef.current?.clientHeight || 400;
        scaleMinFitRef.current = computeGlobeFitScale(w, h);
      }
      const zMin = scaleMinFitRef.current / base;
      let z =
        userZoomFactorRef.current *
        Math.exp(-e.deltaY * ZOOM_WHEEL_SENSITIVITY);
      z = Math.min(ZOOM_CLOSEST_FACTOR, Math.max(zMin, z));
      userZoomFactorRef.current = z;
      requestDraw();
      startAnimation();
    };

    const onPointerDown = (e: PointerEvent) => {
      if (!interactiveRef.current || e.button !== 0) return;
      e.preventDefault();
      pointerDraggingRef.current = true;
      const now = performance.now();
      const t0 = animationStartRef.current ?? now;
      frozenAutoSpinLambdaRef.current =
        -((now - t0) / 1000) * AUTO_SPIN_DEG_PER_SEC;
      autoSpinPausedRef.current = true;
      clearIdleTimer();
      lastPointerRef.current = { x: e.clientX, y: e.clientY, t: now };
      canvas.setPointerCapture(e.pointerId);
    };

    const onPointerMove = (e: PointerEvent) => {
      if (!interactiveRef.current || !pointerDraggingRef.current) return;
      const last = lastPointerRef.current;
      if (!last) return;
      const now = performance.now();
      const dt = now - last.t;
      const dx = e.clientX - last.x;
      const dy = e.clientY - last.y;
      const mul = speedMul(dx, dy, dt);
      userLambdaRef.current += DRAG_LON_PER_PX * dx * mul;
      userPhiRef.current -= DRAG_LAT_PER_PX * dy * mul;
      userPhiRef.current = Math.min(
        MERCATOR_PHI_CLAMP,
        Math.max(-MERCATOR_PHI_CLAMP, userPhiRef.current),
      );
      lastPointerRef.current = { x: e.clientX, y: e.clientY, t: now };
      requestDraw();
    };

    const onPointerUp = (e: PointerEvent) => {
      if (!pointerDraggingRef.current) return;
      pointerDraggingRef.current = false;
      lastPointerRef.current = null;
      try {
        canvas.releasePointerCapture(e.pointerId);
      } catch {
        /* already released */
      }
      scheduleAutoSpinResume();
    };

    canvas.addEventListener("wheel", onWheel, { passive: false });
    canvas.addEventListener("pointerdown", onPointerDown);
    canvas.addEventListener("pointermove", onPointerMove);
    canvas.addEventListener("pointerup", onPointerUp);
    canvas.addEventListener("pointercancel", onPointerUp);

    return () => {
      canvas.removeEventListener("wheel", onWheel);
      canvas.removeEventListener("pointerdown", onPointerDown);
      canvas.removeEventListener("pointermove", onPointerMove);
      canvas.removeEventListener("pointerup", onPointerUp);
      canvas.removeEventListener("pointercancel", onPointerUp);
      clearIdleTimer();
    };
  }, [
    interactive,
    rootRef,
    requestDraw,
    startAnimation,
    clearIdleTimer,
    scheduleAutoSpinResume,
  ]);

  return (
    <div
      ref={rootRef}
      className={clsx(
        styles.root,
        interactive && styles.rootInteractive,
        className,
      )}
    >
      <canvas
        ref={canvasRef}
        className={interactive ? styles.canvasInteractive : undefined}
      />
    </div>
  );
}