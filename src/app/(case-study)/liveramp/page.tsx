import Image from "next/image";
import clsx from "clsx";
import Highlight from "../Highlights";
import CaseStudyWrapper from "../CaseStudy";
import shared from "../shared.module.css";
import styles from "./page.module.css";

const HIGHLIGHTS = [
  {
    value: "37",
    superscript: "×",
    label: {
      one: "CORE & COMPLEX",
      two: "COMPONENTS",
    },
  },
  {
    value: "5",
    superscript: "YRS",
    label: {
      one: "BUILT &",
      two: "MAINTAINED",
    },
  },
  {
    prefix: "<",
    value: "10",
    superscript: "%",
    label: {
      one: "USER",
      two: "FRUSTRATION SIGNALS",
    },
  },
  {
    value: "100",
    superscript: "%",
    label: {
      one: "ADOPTION ACROSS",
      two: "KEY WORKFLOWS",
    },
  },
];

export default function LiveRampCaseStudy() {
  return (
    <CaseStudyWrapper>
      <article className={shared.article}>
        <div className={shared.heading}>
          <h2 className={shared.title}>
            component libraries
            <br />& design systems
          </h2>
          <p className="subtitle">LIVERAMP · SAN FRANCISCO · 2018–2023</p>
        </div>

        <Highlight highlights={HIGHLIGHTS} />

        <div className={styles.body}>
          <figure className={styles.media}>
            <Image
              src="/featured/lr-main.png"
              alt="Liveramp Motif home page"
              width={2596}
              height={1240}
              className={styles.mainImg}
            />
            <Image
              src="/featured/lr-rdt.png"
              alt="Liveramp Rich Data Table component"
              width={1464}
              height={804}
              className={styles.rdt}
            />
            <Image
              src="/featured/lr-buttons.png"
              alt="Liveramp Buttons component"
              width={928}
              height={1560}
              className={styles.buttons}
            />
            <Image
              src="/featured/lr-stepper.png"
              alt="Liveramp Stepper component"
              width={1464}
              height={668}
              className={styles.stepper}
            />
          </figure>
          <div className={clsx(shared.content, styles.content)}>
            <div className={clsx(shared.desc, styles.desc)}>
              <p className={styles.desc1}>
                Built and maintained LiveRamp&apos;s company-wide UI component
                library – a React and TypeScript system comprising 37 core and
                complex components, from foundational elements like buttons and
                form controls through to global navigation, rich data tables,
                and data display components. Designed from the ground up with an
                agnostic, scalable architecture that allowed the same components
                to serve multiple products with entirely different business
                requirements, avoiding the fragmentation that typically plagues
                multi-product design systems.
              </p>
              <p className={styles.desc2}>
                Maintained and evolved the system over five years, keeping it
                current through company rebranding efforts, design token
                migrations, with a full Storybook documentation suite; clear
                usage patterns, code examples, and accessibility guidance baked
                in from the start.
              </p>
              <p className={styles.desc3}>
                Drove 100% adoption across key workflows and high-traffic
                applications through a combination of hands-on upgrade work,
                cross-team collaboration, and hack weeks, reducing user
                frustration signals to under 10% on key workflows, and
                establishing a shared frontend language that hundreds of
                engineers relied on daily.
              </p>
            </div>

            <dl className={clsx(shared.details, styles.details)}>
              <div>
                <dt className="subtitle">STACK</dt>
                <dd>
                  React · TypeScript · Material UI · Emotion · CSS Modules
                </dd>
              </div>
              <div>
                <dt className="subtitle">SCOPE</dt>
                <dd>Design system · Component library</dd>
              </div>
              <div>
                <dt className="subtitle">ROLE</dt>
                <dd>Senior front end engineer</dd>
              </div>
              <div>
                <dt className="subtitle">YEAR</dt>
                <dd>2018–2023</dd>
              </div>
            </dl>
          </div>
        </div>
      </article>
    </CaseStudyWrapper>
  );
}
