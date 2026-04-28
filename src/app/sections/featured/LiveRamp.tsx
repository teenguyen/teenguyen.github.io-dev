import clsx from "clsx";
import Image from "next/image";
import styles from "./LiveRamp.module.css";
import shared from "./index.module.css";

export default function LiveRamp() {
  return (
    <article className={styles.liveramp}>
      <header className={clsx(shared.header, styles.header)}>
        <p className={clsx("subtitle", styles.rightAlign)}>
          LIVERAMP · SAN FRANCISCO · 2018–2023
        </p>
        <h2 className={clsx(shared.heading, styles.rightAlign)}>
          component libraries
          <br />& design systems
        </h2>
      </header>

      <div
        className={clsx(shared.desc, styles.desc)}
        aria-label="LiveRamp highlights"
      >
        <ul>
          <li>
            <p className="subtitle">ARCHITECTURE</p>
            <p>
              Agnostic, scalable component design enabling reuse across multiple
              products with differing requirements
            </p>
          </li>
          <li>
            <p className="subtitle">COMPONENT SYSTEM</p>
            <p>
              Built & maintained a shared component library & storybook, forming
              the foundation of a company-wide design system
            </p>
          </li>
          <li>
            <p className="subtitle">ADOPTION</p>
            <p>
              Company-wide rollout across high-traffic applications: 100%
              adoption across key workflows & reducing user frustration signals
              under 10%
            </p>
          </li>
        </ul>
        <a className="subtitle">VIEW CASE STUDY →</a>
      </div>

      <Image
        src="/lr-main.png"
        alt="Liveramp Motif home page"
        width={2596}
        height={1240}
        className={styles.mainImg}
      />
      <span className={styles.thumbs}>
        <Image
          src="/lr-thumb1.png"
          alt="Liveramp Motif's FormControlLabel component"
          width={274}
          height={116}
          className={styles.thumb1}
        />
        <Image
          src="/lr-thumb2.png"
          alt="Liveramp Motif's ContainedButton component"
          width={235}
          height={116}
          className={styles.thumb2}
        />
      </span>
    </article>
  );
}
