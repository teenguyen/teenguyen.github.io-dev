import clsx from "clsx";
import styles from "./index.module.css";

export default function Weather() {
  return (
    <div className={styles.container}>
      <div className={styles.weatherAnimations}>
        <div className={styles.row}>
          <div className={styles.weather}>
            <div className={styles.rays} />
            <div className={styles.sun} />
          </div>
          <div className={styles.desc}>sunny</div>
        </div>
        <div className={styles.row}>
          <div className={styles.weather}>
            <div className={clsx(styles.rays, styles.miniRays)} />
            <div className={clsx(styles.sun, styles.miniSun)} />
            <div className={styles.cloud} />
          </div>
          <div className={styles.desc}>partly cloudy</div>
        </div>
        <div className={styles.row}>
          <div className={styles.weather}>
            <div className={styles.cloud} />
            <div
              className={clsx(
                styles.cloud,
                styles.darkCloud,
                styles.miniDarkCloud,
              )}
            />
          </div>
          <div className={styles.desc}>cloudy</div>
        </div>
        <div className={styles.row}>
          <div className={styles.weather}>
            <div
              className={clsx(
                styles.cloud,
                styles.darkCloud,
                styles.stormCloud,
              )}
            />
            <div className={clsx(styles.rainGroup, styles.rainGroup1)}>
              <div className={clsx(styles.raindrop, styles.raindrop1)} />
              <div className={clsx(styles.raindrop, styles.raindrop2)} />
            </div>
            <div className={clsx(styles.rainGroup, styles.rainGroup2)}>
              <div className={clsx(styles.raindrop, styles.raindrop1)} />
              <div className={clsx(styles.raindrop, styles.raindrop2)} />
            </div>
          </div>
          <div className={styles.desc}>rainy</div>
        </div>
        <div className={styles.row}>
          <div className={styles.weather}>
            <div
              className={clsx(
                styles.cloud,
                styles.darkCloud,
                styles.stormCloud,
              )}
            />
            <div className={styles.lightning} />
          </div>
          <div className={styles.desc}>stormy</div>
        </div>
        <div className={styles.row}>
          <div className={styles.weather}>
            <div className={styles.moon} />
            <div className={clsx(styles.star, styles.star1)} />
            <div className={clsx(styles.star, styles.star2)} />
            <div className={clsx(styles.star, styles.star3)} />
          </div>
          <div className={styles.desc}>night</div>
        </div>
      </div>
      <a href="https://theresa-nguyen.com" className={styles.tag}>
        theresa-nguyen.com
      </a>
    </div>
  );
}
