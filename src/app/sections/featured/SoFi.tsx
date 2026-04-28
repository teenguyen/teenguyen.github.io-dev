import clsx from "clsx";
import Image from "next/image";
import styles from "./SoFi.module.css";
import shared from "./index.module.css";

export default function SoFi() {
  return (
    <article className={styles.sofi}>
      <header className={shared.header}>
        <p className="subtitle">SOCIAL FINANCE · SAN FRANCISCO · 2023–2025</p>
        <h2 className={shared.heading}>
          stock ticker
          <br />& invest redesign
        </h2>
      </header>

      <div className={clsx(shared.desc, styles.desc)}>
        <ul>
          <li>
            <p className="subtitle">INVEST TEARSHEETS</p>
            <p>
              End-to-end redesign driving 5x page view growth, 2x session
              durations, & $7.5M projected annual deposits
            </p>
          </li>
          <li>
            <p className="subtitle">OPTIONS TRADING</p>
            <p>
              Redesigned complex options trading interfaces with reusable
              architecture built to accelerate 0 DTE feature delivery
            </p>
          </li>
          <li>
            <p className="subtitle">ACCOUNT TRANSFERS</p>
            <p>
              Rebuilt full & partial automated transfers, improving success
              rates from 18.5% → 34.1%, generating ~$488K inflows within 7 days
              launch
            </p>
          </li>
        </ul>
        <a className="subtitle">VIEW CASE STUDY →</a>
      </div>

      <figure className={styles.media}>
        <video
          className={styles.mainImg}
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
        >
          <source src="/sofi-main.mp4" type="video/mp4" />
        </video>
        <Image
          src="/sf-thumb1.png"
          alt="SoFi options chain interface"
          className={styles.thumb1}
          width={1268}
          height={620}
        />
        <video
          className={styles.thumb2}
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          width={550}
        >
          <source src="/sf-thumb2.mp4" type="video/mp4" />
        </video>
      </figure>
    </article>
  );
}
