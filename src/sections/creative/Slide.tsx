import { useEffect, useRef } from "react";
import Image from "next/image";
import styles from "./Slide.module.css";

type SlideProps = {
  src: string;
  alt: string;
  initial?: boolean;
  playing?: boolean;
  ref?: React.Ref<HTMLDivElement>;
};

export default function Slide({
  src,
  alt,
  initial,
  playing,
  ref,
}: SlideProps) {
  const isVideo = src.endsWith(".mp4");
  const videoRef = useRef<HTMLVideoElement>(null);

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

  return (
    <div
      ref={ref}
      className={styles.slide}
      style={{ transform: `translateY(${initial ? "0%" : "100%"})` }}
    >
      {isVideo ? (
        <video
          ref={videoRef}
          src={src}
          className={`${styles.image} ${styles.video}`}
          loop
          muted
          playsInline
        />
      ) : (
        <Image src={src} alt={alt} fill className={styles.image} />
      )}
    </div>
  );
}
