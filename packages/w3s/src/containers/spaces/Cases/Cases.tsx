import { OverlayScrollbars } from "overlayscrollbars"
import { FC, useEffect, useMemo, useRef, useState } from "react"
import Marquee from "react-fast-marquee"
import { ReactTyped as Typed } from "react-typed"
import { useScramble } from "use-scramble"

import { useApp } from "../../../contexts/App"
import { randomBetween, randomChars, runWithTimeout } from "../../../utils/fn"

import "./Cases.scss"

interface ICasesContent {
  id: number
  category: string
  title: string
  description: string
  technologies: string[]
}

interface ICaseDetailsProps {
  content: ICasesContent
  descriptionRef?: React.RefObject<HTMLParagraphElement>
}

/* prettier-ignore */
const casesContents: ICasesContent[] = [
  {
    id: 1,
    category: "../Sport && Odds",
    title: "Trading System",
    description: `
      This is our internal project: a fully automated trading system integrated with the Betfair exchange.
      It includes custom mathematical models, event search and analysis, probability distribution, risk
      assessment, and automated betting. Real-time notifications ensure smooth trading operations and quick
      decision-making
    `,
    technologies: [
      "Python",
      "Rust",
      "FastAPI",
      "Axum",
      "SciPy",
      "SQLAlchemy",
      "Diesel",
      "Rayon",
      "SerDe",
      "PostgreSQL"
    ],
  },
  {
    id: 2,
    category: "../Monitoring",
    title: "Event Watcher",
    description: `
      This project involved developing a system for creating, analyzing, and executing complex logic-based
      formulas derived from real-time metrics. Users could build custom conditions to trigger specific actions,
      like notifications, based on the continuous evaluation of these formulas over defined time intervals
    `,
    technologies: [
      "Python",
      "Aiohttp",
      "Asyncio",
      "AST",
      "APScheduler",
      "Pandas",
      "Pydantic",
      "InfluxDB",
      "Sentry",
      "MongoDB",
    ],
  },
  {
    id: 3,
    category: "../e-Commerce",
    title: "Online Store",
    description: `
      The main challenge of this project was developing a robust and high-performance backend for an online
      shop selling metal and steel products, featuring a flexible product configurator. Customers can change
      many product properties, such as size or material, with real-time price updates. This streamlined
      orders, improving engagement and management
    `,
    technologies: [
      "Python",
      "FastAPI",
      "Ariadne",
      "NGINX",
      "Redis",
      "Pydantic",
      "Peewee",
      "PostgreSQL",
      "Alembic",
      "Datadog",
    ],
  },
] as const

const charsSequence = "1234567890ABCDEF" as string
const randomCharsNumber = (1 << 3) as number

const scrambleDecorativeTextParams = {
  speed: 0.45,
  tick: 1,
  step: 1,
  scramble: 12,
  seed: 0,
  overflow: true,
  overdrive: 45,
}

const scrambleDescriptionParams = {
  speed: 0.85,
  scramble: 3,
  step: 5,
  seed: 3,
  overflow: true,
  overdrive: false,
  playOnMount: false,
} as const

const initialActiveNavigateItem = 1 as number

const decorativeIndicatorsNumber = 7 as number

/**
 * The `CaseDetails` component is responsible for displaying detailed information about a specific
 * company `Case`. It accepts `Case` data through props and presents it on the screen. Additionally,
 * an optional reference to the description element can be passed for manipulation (e.g., for
 * animations).
 *
 * @component
 * @param {ICasesContent} content An object containing the details of the `Case`, including its
 * category, title, description and technologies used.
 * @param {React.RefObject<HTMLParagraphElement>} [descriptionRef = null] An optional reference to
 * the paragraph element for the description to interact with it (e.g., for text animation).
 *
 * @example
 * ```tsx
 * const content = {
 *   id: 1,
 *   category: "../My category",
 *   title: "Title",
 *   description: "Here's a description",
 *   technologies: "And here are the technologies used",
 * };
 *
 * <div>
 *   <CaseDetails key={content.id} content={content} />
 * </div>
 *```
 *
 * @returns {JSX.Element} Returns JSX markup for displaying `Case` details.
 */
const CaseDetails: FC<ICaseDetailsProps> = ({ content, descriptionRef = null }) => {
  /** @references */
  const descriptionScrollbarsRef = useRef<HTMLDivElement | null>(null)

  /** @hooks */
  const { scrollbarsOptions } = useApp()

  let osInstance: OverlayScrollbars | undefined = undefined

  useEffect(() => {
    if (descriptionScrollbarsRef?.current) {
      osInstance = OverlayScrollbars(descriptionScrollbarsRef?.current, scrollbarsOptions)
    }

    return () => osInstance?.destroy()
  }, [descriptionScrollbarsRef])

  return (
    <div className={"cases__case"}>
      <p className={"cases__case-category"}>{content.category}</p>
      <h3 className={"cases__case-title"}>{content.title}</h3>
      <div className={"cases__case-description"} ref={descriptionScrollbarsRef} data-overlayscrollbars-initialize>
        <p ref={descriptionRef}>{content.description}</p>
      </div>
      <p className={"cases__case-technologies-title"}>{"Used technologies"}</p>
      <p>{content.technologies.join("; ")}</p>
    </div>
  )
}

const Cases: FC = () => {
  /** @states */
  const [activeNavigateItem, setActiveNavigateItem] = useState<number>(initialActiveNavigateItem)

  /** @references */
  const scrambleTimeoutRef = useRef<number | null>(null)

  /** @memos */
  // Memoize the active `Case` content for search optimization
  const activeContent = useMemo(() => casesContents.find(item => item.id === activeNavigateItem), [activeNavigateItem])

  const { ref: descriptionRef } = useScramble({
    text: activeContent?.description || "",
    ...scrambleDescriptionParams,
  })

  const { ref: decorativeTextRef, replay: scrambleReplay } = useScramble({
    text: `0x${randomChars(charsSequence, randomCharsNumber)}`,
    ignore: ["0", "x"],
    range: [48, 57, 65, 70],
    onAnimationEnd: () => {
      const timeout = randomBetween(4_100, 7_550)
      runWithTimeout(scrambleTimeoutRef, scrambleReplay, timeout)
    },
    ...scrambleDecorativeTextParams,
  })

  return (
    <div className={"cases"}>
      <h2 className={"cases__title"}>
        <Typed strings={["Cases"]} typeSpeed={50} cursorChar={"_"} showCursor={true} startWhenVisible />
      </h2>
      <div className={"cases__decorative-corner"}></div>
      <div className={"cases__decorative-marquee-str-wrapper"}>
        <span className={"cases__decorative-marquee-str-wrapper--brace"}>{"["}</span>
        <div className={"cases__decorative-marquee-str"}>
          <Marquee autoFill={true} pauseOnHover={true} speed={15}>
            {"• •scale your code• •maximize performance• •optimize your workflow"}
          </Marquee>
        </div>
        <span className={"cases__decorative-marquee-str-wrapper--brace"}>{"]"}</span>
      </div>
      {/* Normal view of the display `Case` */}
      <div className={"cases__case-wrapper"}>
        {casesContents.map(content => (
          <CaseDetails key={content.id} content={content} />
        ))}
      </div>
      {/* Shrinked view of the display `Case` */}
      <div className={"cases__shrinked-case-wrapper"}>
        {activeContent && (
          <CaseDetails key={activeContent.id} content={activeContent} descriptionRef={descriptionRef} />
        )}
      </div>
      {/* Navigating through the `Cases` */}
      <div className={"cases__multi-wrapper"}>
        <div className={"cases__decorative-indicators"}>
          {Array.from({ length: decorativeIndicatorsNumber }).map((_, index) => (
            <div key={index} className={"cases__decorative-indicator"}>{`[0${casesContents.length}]`}</div>
          ))}
        </div>
        <p>Our last cases</p>
        <div className={"cases__navigate"}>
          {casesContents.map((content, _) => (
            <div
              key={content.id}
              className={`cases__navigate-btn ${activeNavigateItem === content.id ? "active" : ""}`}
              onClick={() => setActiveNavigateItem(content.id)}
            >
              {`0${content.id}`}
            </div>
          ))}
        </div>
      </div>
      <div className={"cases__decorative-text"} ref={decorativeTextRef}></div>
    </div>
  )
}

export default Cases
