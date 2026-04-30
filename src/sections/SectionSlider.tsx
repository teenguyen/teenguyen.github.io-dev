"use client";

import {
  Children,
  ReactNode,
  createContext,
  useContext,
  useEffect,
  useMemo,
  useRef,
} from "react";
import gsap from "gsap";
import styles from "./SectionSlider.module.css";

const TWEEN_DURATION = 1.1;
const WHEEL_THROTTLE_MS = 250;

type WheelDirection = 1 | -1;
export type WheelInterceptor = (direction: WheelDirection) => boolean;

type SliderApi = {
  setInterceptor: (
    slideIndex: number,
    interceptor: WheelInterceptor | null,
  ) => void;
};

const SliderContext = createContext<SliderApi | null>(null);
const SlideIndexContext = createContext<number>(0);

export const useSliderApi = () => useContext(SliderContext);
export const useSlideIndex = () => useContext(SlideIndexContext);

type SectionSliderProps = {
  children: ReactNode;
};

export default function SectionSlider({ children }: SectionSliderProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const activeRef = useRef(0);
  const interceptorsRef = useRef(new Map<number, WheelInterceptor>());
  const slides = Children.toArray(children);
  const slideCount = slides.length;

  const api = useMemo<SliderApi>(
    () => ({
      setInterceptor: (idx, interceptor) => {
        if (interceptor) interceptorsRef.current.set(idx, interceptor);
        else interceptorsRef.current.delete(idx);
      },
    }),
    [],
  );

  useEffect(() => {
    const container = containerRef.current;
    if (!container || slideCount < 2) return;

    let lastWheelTime = 0;

    const goTo = (next: number) => {
      const clamped = Math.max(0, Math.min(slideCount - 1, next));
      if (clamped === activeRef.current) return;

      activeRef.current = clamped;
      gsap.to(container, {
        y: -clamped * window.innerHeight,
        duration: TWEEN_DURATION,
        ease: "power3.inOut",
        overwrite: true,
      });
    };

    const onWheel = (e: WheelEvent) => {
      e.preventDefault();

      const now = e.timeStamp;
      if (now - lastWheelTime < WHEEL_THROTTLE_MS) return;
      lastWheelTime = now;

      const direction: WheelDirection = e.deltaY > 0 ? 1 : -1;

      const interceptor = interceptorsRef.current.get(activeRef.current);
      if (interceptor && interceptor(direction)) return;

      goTo(activeRef.current + direction);
    };

    const onResize = () => {
      gsap.set(container, { y: -activeRef.current * window.innerHeight });
    };

    window.addEventListener("wheel", onWheel, { passive: false });
    window.addEventListener("resize", onResize);

    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      window.removeEventListener("wheel", onWheel);
      window.removeEventListener("resize", onResize);
      document.body.style.overflow = prevOverflow;
    };
  }, [slideCount]);

  return (
    <SliderContext.Provider value={api}>
      <div className={styles.master}>
        <div ref={containerRef} className={styles.panelWrap}>
          {slides.map((child, i) => (
            <SlideIndexContext.Provider key={i} value={i}>
              <div className={styles.panel}>{child}</div>
            </SlideIndexContext.Provider>
          ))}
        </div>
      </div>
    </SliderContext.Provider>
  );
}
