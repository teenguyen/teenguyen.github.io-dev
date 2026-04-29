import clsx from "clsx";
import Image from "next/image";
import styles from "./LiveRamp.module.css";
import shared from "./index.module.css";
import Link from "next/link";

export default function LiveRamp() {
  return (
    <article className={styles.liveramp}>
      <div className={clsx(shared.header, styles.header)}>
        <p className={clsx("subtitle", styles.styleAlign)}>
          LIVERAMP · SAN FRANCISCO · 2018–2023
        </p>
        <h2 className={clsx(shared.heading, styles.styleAlign)}>
          component libraries
          <br />& design systems
        </h2>
      </div>

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
        <Link className="subtitle" href="/liveramp">
          VIEW CASE STUDY →
        </Link>
      </div>

      <Image
        src="/lr-main.png"
        alt="Liveramp Motif home page"
        width={2596}
        height={1240}
        className={styles.mainImg}
      />
      <Image
        src="/lr-thumb1.png"
        alt="Liveramp Motif's FormControlLabel component"
        className={styles.thumb1}
        width={274}
        height={116}
      />
      <Image
        src="/lr-thumb2.png"
        alt="Liveramp Motif's ContainedButton component"
        className={styles.thumb2}
        width={235}
        height={116}
      />
    </article>
  );
}
