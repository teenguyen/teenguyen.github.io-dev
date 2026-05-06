import Image from "next/image";
import clsx from "clsx";
import Highlight from "../Highlights";
import CaseStudyWrapper from "../CaseStudy";
import shared from "../shared.module.css";
import styles from "./page.module.css";

const HIGHLIGHTS = [
  {
    value: "5",
    superscript: "×",
    label: {
      one: "PAGE VIEW",
      two: "GROWTH",
    },
  },
  {
    value: "2",
    superscript: "×",
    label: {
      one: "SESSION",
      two: "DURATIONS",
    },
  },
  {
    prefix: "$",
    value: "7.5",
    superscript: "M",
    label: {
      one: "PROJECTED",
      two: "ANNUAL DEPOSITS",
    },
  },
  {
    prefix: "↑",
    value: "15.5",
    superscript: "M",
    label: {
      one: "TRANSFER",
      two: "SUCCESS RATE",
    },
  },
];

export default function SoFiCaseStudy() {
  return (
    <CaseStudyWrapper portfolioHref="/#social-finance">
      <article className={shared.article}>
        <div className={shared.heading}>
          <h2 className={shared.title}>
            stock ticker
            <br />& invest redesign
          </h2>
          <p className="subtitle">SOCIAL FINANCE · SAN FRANCISCO · 2023–2025</p>
        </div>

        <Highlight highlights={HIGHLIGHTS} />

        <div className={styles.body}>
          <figure className={styles.media}>
            <video
              className={styles.mainImg}
              autoPlay
              muted
              loop
              playsInline
              preload="metadata"
            >
              <source src="/featured/sf-main.mp4" type="video/mp4" />
            </video>
            <Image
              src="/featured/sf-thumb1.png"
              alt="SoFi options chain interface"
              className={styles.thumb1}
              width={1268}
              height={620}
            />
            <video
              className={styles.thumb2}
              autoPlay
              muted
              loop
              playsInline
              preload="metadata"
              width={550}
            >
              <source src="/featured/sf-thumb2.mp4" type="video/mp4" />
            </video>
            <Image
              src="/featured/sf-options.png"
              alt="SoFi options chain interface"
              className={styles.options}
              width={2036}
              height={2304}
            />
          </figure>
          <div className={clsx(shared.content, styles.content)}>
            <div className={clsx(shared.desc, styles.desc)}>
              <p className={styles.desc1}>
                SoFi’s Invest platform was rebuilt from the ground up – its
                first comprehensive UI and UX overhaul since inception. The
                redesign focused on retaining users within the SoFi ecosystem by
                integrating core actions such as deposit and trading directly
                into the tear sheet, while surfacing the market context required
                to make informed investment decisions without leaving the page.
              </p>
              <p className={styles.desc2}>
                The tear sheet served as the centerpiece. Real-time price
                streaming, interactive D3 charts across multiple timeframes,
                analyst ratings, earnings data, relevant news, and “why it’s
                moving” signals were consolidated into a single interface.
                Direct deposit integration is projected to drive $7.5M in
                additional annual deposits. Following the launch, page views
                increased 5× and session duration doubled.
              </p>
              <p className={styles.desc3}>
                Options trading was rebuilt end to end, including Level 1 and
                Level 2 flows, a redesigned options chain, order placement, and
                position management. The system was architected modularly to
                support rapid delivery of upcoming features, including 0DTE
                trading.
              </p>
              <p className={styles.desc4}>
                The platform scope extended across critical onboarding and
                account management flows. Automated account transfers were
                rebuilt, improving success rates from 18.5% to 34.1% and
                generating approximately $488K in inflows within nine days of
                launch, for a total of $725.58M in 2025. Alternative investments
                and private markets introduced access to private equity within
                the platform, and non-permanent residency verification expanded
                platform eligibility to previously unsupported users.
              </p>
            </div>

            <dl className={clsx(shared.details, styles.details)}>
              <div>
                <dt className="subtitle">STACK</dt>
                <dd>React · TypeScript · styleX · CSS · D3.js</dd>
              </div>
              <div>
                <dt className="subtitle">SCOPE</dt>
                <dd>Invest platform</dd>
              </div>
              <div>
                <dt className="subtitle">ROLE</dt>
                <dd>Senior front end engineer</dd>
              </div>
              <div>
                <dt className="subtitle">YEAR</dt>
                <dd>2023–2025</dd>
              </div>
            </dl>
          </div>
        </div>
      </article>
    </CaseStudyWrapper>
  );
}
