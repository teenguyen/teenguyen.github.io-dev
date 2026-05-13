import LiveRamp from "./LiveRamp";
import SoFi from "./SoFi";
import styles from "./index.module.css";

export default function Featured() {
  return (
    <section id="featured" className={styles.section}>
      <div className={styles.divider}>
        <hr />
        <h6>FEATURED WORK</h6>
      </div>
      <div className={styles.content}>
        <SoFi />
        <LiveRamp />
      </div>
    </section>
  );
}
