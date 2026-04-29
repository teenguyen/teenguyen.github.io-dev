import styles from "./index.module.css";
import LiveRamp from "./LiveRamp";
import SoFi from "./SoFi";

export default function Featured() {
  return (
    <section className={styles.section}>
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
