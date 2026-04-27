import clsx from "clsx";
import styles from "./index.module.css";

export default function Featured() {
  return (
    <section>
      <div className={styles.divider}>
        <hr />
        <h6>FEATURED WORK</h6>
      </div>
      <div className={styles.content}>
        <div className={styles.sofi}>
          <div className={styles.title}>
            <h2 className={styles.heading}>
              stock ticker
              <br />& invest redesign
            </h2>
            <p className="subtitle">
              SOCIAL FINANCE · SAN FRANCISCO · 2023–2025
            </p>
          </div>
          <div className={styles.desc}>
            <ul>
              <li>
                <p className={clsx("subtitle", styles.listTitle)}>
                  INVEST TEARSHEETS
                </p>
                <p>
                  End-to-end redesign driving 5x page view growth, 2x session
                  durations, & $7.5M projected annual deposits
                </p>
              </li>
              <li>
                <p className={clsx("subtitle", styles.listTitle)}>
                  OPTIONS TRADING
                </p>
                <p>
                  Redesigned complex options trading interfaces with reusable
                  architecture built to accelerate 0 DTE feature delivery
                </p>
              </li>
              <li>
                <p className={clsx("subtitle", styles.listTitle)}>
                  ACCOUNT TRANSFERS
                </p>
                <p>
                  Rebuilt full & partial automated transfers, improving success
                  rates from 18.5% → 34.1%, generating ~$488K inflows within 7
                  days launch
                </p>
              </li>
            </ul>
            <a className="subtitle">VIEW CASE STUDY →</a>
          </div>
          <div className={clsx(styles.imgs, styles.sofiImgs)}>
            <video
              className={styles.mainVideo}
              autoPlay
              muted
              loop
              playsInline
              preload="metadata"
            >
              <source src="/sofi-main.mp4" type="video/mp4" />
            </video>
          </div>
        </div>

        <div className={styles.liveramp}>
          <div className={styles.title}>
            <h2 className={styles.heading}>
              component libraries
              <br />& design systems
            </h2>
            <p className={clsx("subtitle", styles.subtitle)}>
              LIVERAMP · SAN FRANCISCO · 2018–2023
            </p>
          </div>

          <div className={styles.desc}>
            <ul>
              <li>
                <p className={clsx("subtitle", styles.listTitle)}>
                  ARCHITECTURE
                </p>
                <p>
                  Agnostic, scalable component design enabling reuse across
                  multiple products with differing requirements
                </p>
              </li>
              <li>
                <p className={clsx("subtitle", styles.listTitle)}>
                  COMPONENT SYSTEM
                </p>
                <p>
                  Built & maintained a shared component library & storybook,
                  forming the foundation of a company-wide design system
                </p>
              </li>
              <li>
                <p className={clsx("subtitle", styles.listTitle)}>ADOPTION</p>
                <p>
                  Company-wide rollout across high-traffic applications: 100%
                  adoption across key workflows & reducing user frustration
                  signals under 10%
                </p>
              </li>
            </ul>
            <a className="subtitle">VIEW CASE STUDY →</a>
          </div>
        </div>
      </div>
    </section>
  );
}
