import { ComponentType, useEffect, useRef, type RefObject } from "react";
import Image from "next/image";
import styles from "./Slide.module.css";

export type SlideMediaComponent = ComponentType<{
  playing?: boolean;
  rootRef: RefObject<HTMLDivElement | null>;
}>;

type SlideProps = {
  src: string | SlideMediaComponent;
  alt: string;
  initial?: boolean;
  playing?: boolean;
  ref?: React.Ref<HTMLDivElement>;
};

export default function Slide({ src, alt, initial, playing, ref }: SlideProps) {
  const isVideo = typeof src === "string" && src.endsWith(".mp4");
  const videoRef = useRef<HTMLVideoElement>(null);
  const mediaRootRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!isVideo) return;
    const v = videoRef.current;
    if (!v) return;
    if (playing) {
      v.currentTime = 0;
      v.play().catch(() => {});
    } else {
      v.pause();
    }
  }, [isVideo, playing]);

  let content: React.ReactNode;
  if (typeof src !== "string") {
    const Component = src;
    content = <Component playing={playing} rootRef={mediaRootRef} />;
  } else if (isVideo) {
    content = (
      <video
        ref={videoRef}
        src={src}
        className={`${styles.image} ${styles.video}`}
        loop
        muted
        playsInline
      />
    );
  } else {
    content = <Image src={src} alt={alt} fill className={styles.image} />;
  }

  return (
    <div
      ref={ref}
      className={styles.slide}
      style={{ transform: `translateY(${initial ? "0%" : "100%"})` }}
    >
      {content}
    </div>
  );
}
