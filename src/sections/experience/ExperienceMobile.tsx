"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import clsx from "clsx";
import {
  CURRENT_JOB,
  EARLY_JOBS,
  EDUCATION,
  EXPERIENCE_T0,
  PRIOR_JOBS,
} from "./consts";
import { SECTION_LAYOUT_BREAKPOINT_REM } from "../consts";
import styles from "./ExperienceMobile.module.css";

const MOBILE_MQ = `(max-width: ${SECTION_LAYOUT_BREAKPOINT_REM}rem)`;
const REDUCED_MOTION_MQ = "(prefers-reduced-motion: reduce)";

function allExperienceMobileRevealIds(): string[] {
  const ids: string[] = [
    "exp-h3",
    "rule-after-exp",
    "feat-logo",
    "feat-title",
    "feat-company",
    "feat-meta",
    "rule-after-feat",
  ];
  for (const job of PRIOR_JOBS) {
    ids.push(
      `${job.id}-logo`,
      `${job.id}-title`,
      `${job.id}-company`,
      `${job.id}-meta`,
    );
  }
  ids.push("rule-after-priors", "early-h3");
  EARLY_JOBS.forEach((_, index) => {
    ids.push(`early-${index}`);
  });
  ids.push("edu-h3");
  EDUCATION.forEach((_, i) => {
    ids.push(`edu-${i}-deg`, `edu-${i}-school`);
  });
  return ids;
}

export type ExperienceMobileProps = {
  isActive: boolean;
};

function schedule(
  timeouts: ReturnType<typeof setTimeout>[],
  fn: () => void,
  delay: number,
) {
  timeouts.push(setTimeout(fn, delay));
}

export default function ExperienceMobile({ isActive }: ExperienceMobileProps) {
  const runIdRef = useRef(0);
  const [revealed, setRevealed] = useState<Set<string>>(() => new Set());
  const [narrow, setNarrow] = useState(() =>
    typeof window !== "undefined"
      ? window.matchMedia(MOBILE_MQ).matches
      : false,
  );

  useEffect(() => {
    const mq = window.matchMedia(MOBILE_MQ);
    const onChange = () => setNarrow(mq.matches);
    onChange();
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  useEffect(() => {
    const runId = ++runIdRef.current;
    const timeouts: ReturnType<typeof setTimeout>[] = [];

    if (!isActive) {
      queueMicrotask(() => {
        setRevealed(new Set());
      });
      return () => {
        timeouts.forEach(clearTimeout);
      };
    }

    if (!narrow) {
      return () => {
        timeouts.forEach(clearTimeout);
      };
    }

    if (
      typeof window !== "undefined" &&
      window.matchMedia(REDUCED_MOTION_MQ).matches
    ) {
      queueMicrotask(() => {
        if (runId !== runIdRef.current) return;
        setRevealed(new Set(allExperienceMobileRevealIds()));
      });
      return () => {
        timeouts.forEach(clearTimeout);
      };
    }

    queueMicrotask(() => {
      setRevealed(new Set());
    });

    let t = EXPERIENCE_T0;

    const revealLine = (id: string) => {
      schedule(
        timeouts,
        () => {
          if (runId !== runIdRef.current) return;
          setRevealed((prev) => new Set([...prev, id]));
        },
        t,
      );
      t += 120;
    };

    revealLine("exp-h3");
    revealLine("rule-after-exp");
    revealLine("feat-logo");
    revealLine("feat-title");
    revealLine("feat-company");
    revealLine("feat-meta");

    revealLine("rule-after-feat");

    for (const job of PRIOR_JOBS) {
      revealLine(`${job.id}-logo`);
      revealLine(`${job.id}-title`);
      revealLine(`${job.id}-company`);
      revealLine(`${job.id}-meta`);
    }

    revealLine("rule-after-priors");

    revealLine("early-h3");
    EARLY_JOBS.forEach((_, index) => {
      revealLine(`early-${index}`);
    });

    revealLine("edu-h3");
    EDUCATION.forEach((_, i) => {
      revealLine(`edu-${i}-deg`);
      revealLine(`edu-${i}-school`);
    });

    return () => {
      timeouts.forEach(clearTimeout);
    };
  }, [isActive, narrow]);

  const lineClass = (id: string) =>
    clsx(styles.revealable, revealed.has(id) && styles.revealed);

  return (
    <div className={styles.root}>
      <h3 className={clsx(styles.sectionLabel, lineClass("exp-h3"))}>
        experience
      </h3>

      <hr
        className={clsx(styles.divider, lineClass("rule-after-exp"))}
        aria-hidden
      />

      <div className={styles.jobExp}>
        <Image
          className={clsx(
            styles.logo,
            styles.logoFeatured,
            lineClass("feat-logo"),
          )}
          src={CURRENT_JOB.logo}
          alt={`${CURRENT_JOB.company} logo`}
          width={100}
          height={100}
        />
        <p className={clsx(styles.heroTitle, lineClass("feat-title"))}>
          {CURRENT_JOB.title}
        </p>
        <p className={clsx("subtitle", styles.meta, lineClass("feat-company"))}>
          {CURRENT_JOB.company}
        </p>
        <p className={clsx("subtitle", styles.meta, lineClass("feat-meta"))}>
          {`${CURRENT_JOB.location}\n${CURRENT_JOB.dates}`}
        </p>
      </div>

      <hr
        className={clsx(styles.divider, lineClass("rule-after-feat"))}
        aria-hidden
      />

      {PRIOR_JOBS.map((job) => (
        <div key={job.id} className={styles.jobExp}>
          <Image
            className={clsx(
              styles.logo,
              styles.logoCompact,
              lineClass(`${job.id}-logo`),
            )}
            src={job.logo}
            alt={`${job.company} logo`}
            width={40}
            height={40}
          />
          <p className={clsx(styles.prevTitle, lineClass(`${job.id}-title`))}>
            {job.title}
          </p>
          <p
            className={clsx(
              "subtitle",
              styles.meta,
              lineClass(`${job.id}-company`),
            )}
          >
            {job.company}
          </p>
          <p
            className={clsx(
              "subtitle",
              styles.meta,
              lineClass(`${job.id}-meta`),
            )}
          >
            {`${job.location}\n${job.dates}`}
          </p>
        </div>
      ))}

      <hr
        className={clsx(styles.divider, lineClass("rule-after-priors"))}
        aria-hidden
      />

      <div>
        <h3 className={clsx(styles.sectionLabel, lineClass("early-h3"))}>
          early career
        </h3>
        <ul className={styles.earlyJobs}>
          {EARLY_JOBS.map((job, index) => (
            <li key={`${job.company}-${job.year}`}>
              <p
                className={clsx(styles.earlyRole, lineClass(`early-${index}`))}
              >
                {job.role}&nbsp;&nbsp;&nbsp;
                <span className={clsx("subtitle", styles.meta)}>
                  {job.company} · {job.year}
                </span>
              </p>
            </li>
          ))}
        </ul>
      </div>

      <div>
        <h3 className={clsx(styles.sectionLabel, lineClass("edu-h3"))}>
          education
        </h3>
        {EDUCATION.map((entry, i) => (
          <div key={entry.school}>
            <p className={clsx(styles.earlyRole, lineClass(`edu-${i}-deg`))}>
              {entry.degree}
            </p>
            <p
              className={clsx(
                "subtitle",
                styles.meta,
                lineClass(`edu-${i}-school`),
              )}
            >
              {entry.school}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
