import clsx from "clsx";
import styles from "./Highlights.module.css";

type HighlightItem = {
  prefix?: string;
  value: string;
  superscript: string;
  label: {
    one: string;
    two: string;
  };
};

type HighlightProps = {
  highlights: HighlightItem[];
};

export default function Highlight({ highlights }: HighlightProps) {
  return (
    <ul className={styles.highlights}>
      {highlights.map(({ prefix, value, superscript, label: { one, two } }) => {
        return (
          <li key={`${one} ${two}`} className={styles.highlight}>
            <p className={styles.value}>
              {prefix && <span className={styles.prefix}>{prefix}</span>}
              {value}
              <sup
                className={clsx(
                  styles.superscript,
                  superscript === "×" && styles.xSuperscript,
                )}
              >
                {superscript}
              </sup>
            </p>
            <p className={clsx("subtitle", styles.label)}>
              {one}
              <br />
              {two}
            </p>
          </li>
        );
      })}
    </ul>
  );
}
