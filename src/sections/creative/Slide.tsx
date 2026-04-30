import Image from "next/image";
import styles from "./Slide.module.css";

type SlideProps = {
  src: string;
  alt: string;
  initial?: boolean;
  ref?: React.Ref<HTMLDivElement>;
};

export default function Slide({ src, alt, initial, ref }: SlideProps) {
  const isVideo = src.endsWith(".mp4");

  return (
    <div
      ref={ref}
      className={styles.slide}
      style={{ transform: `translateY(${initial ? "0%" : "100%"})` }}
    >
      {isVideo ? (
        <video
          src={src}
          className={`${styles.image} ${styles.video}`}
          autoPlay
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
