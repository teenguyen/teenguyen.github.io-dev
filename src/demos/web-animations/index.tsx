import styles from "./index.module.css";
import Robot from "./robot";
import Spaceship from "./spaceship";
import Weather from "./weather";

export default function WebAnimations() {
  return (
    <div className={styles.container}>
      <Robot />
      <Spaceship />
      <Weather />
    </div>
  );
}
