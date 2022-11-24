import React from "react";
import css from "./index.module.css";

export default function Chip({ label }) {
  return (
    <span className={css.chip} key={label}>
      <sub>{label}</sub>
    </span>
  );
}
