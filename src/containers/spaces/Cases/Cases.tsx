import './Cases.scss';

import { OverlayScrollbars } from 'overlayscrollbars';
import { type FC, useEffect, useMemo, useRef, useState } from 'react';
import Marquee from 'react-fast-marquee';
import { ReactTyped as Typed } from 'react-typed';
import { useScramble } from 'use-scramble';

import { useApp } from '~/contexts/App';
import { randomBetween, randomChars, runWithTimeout } from '~/utils/fn';

type ICaseDetailsProps = {
  readonly content: ICasesContent;
  readonly descriptionRef?: React.RefObject<HTMLParagraphElement>;
};

type ICasesContent = {
  category: string;
  description: string;
  id: number;
  technologies: string[];
  title: string;
};

/* prettier-ignore */
const casesContents: ICasesContent[] = [
  {
    category: "../Sport && Odds",
    description: `
      This is our internal project: a fully automated trading system integrated with the Betfair exchange.
      It includes custom mathematical models, event search and analysis, probability distribution, risk
      assessment, and automated betting. Real-time notifications ensure smooth trading operations and quick
      decision-making
    `,
    id: 1,
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
    title: "Trading System",
  },
  {
    category: "../Monitoring",
    description: `
      This project involved developing a system for creating, analyzing, and executing complex logic-based
      formulas derived from real-time metrics. Users could build custom conditions to trigger specific actions,
      like notifications, based on the continuous evaluation of these formulas over defined time intervals
    `,
    id: 2,
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
    title: "Event Watcher",
  },
  {
    category: "../e-Commerce",
    description: `
      The main challenge of this project was developing a robust and high-performance backend for an online
      shop selling metal and steel products, featuring a flexible product configurator. Customers can change
      many product properties, such as size or material, with real-time price updates. This streamlined
      orders, improving engagement and management
    `,
    id: 3,
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
    title: "Online Store",
  },
] as const;

const charsSequence = '1234567890ABCDEF' as string;
const randomCharsNumber = (1 << 3) as number;

const scrambleDecorativeTextParameters = {
  overdrive: 45,
  overflow: true,
  scramble: 12,
  seed: 0,
  speed: 0.45,
  step: 1,
  tick: 1,
};

const scrambleDescriptionParameters = {
  overdrive: false,
  overflow: true,
  playOnMount: false,
  scramble: 3,
  seed: 3,
  speed: 0.85,
  step: 5,
} as const;

const initialActiveNavigateItem = 1 as number;

const decorativeIndicatorsNumber = 7 as number;

/**
 * The `CaseDetails` component is responsible for displaying detailed information about a specific
 * company `Case`. It accepts `Case` data through props and presents it on the screen. Additionally,
 * an optional reference to the description element can be passed for manipulation (e.g., for
 * animations).
 * @component
 * @param {ICasesContent} content An object containing the details of the `Case`, including its
 * category, title, description and technologies used.
 * @param {React.RefObject<HTMLParagraphElement>} [descriptionRef] An optional reference to
 * the paragraph element for the description to interact with it (e.g., for text animation).
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
 * @returns {JSX.Element} Returns JSX markup for displaying `Case` details.
 */
const CaseDetails: FC<ICaseDetailsProps> = ({ content, descriptionRef = null }) => {
  /**
   * @references
   */
  const descriptionScrollbarsRef = useRef<HTMLDivElement | null>(null);

  /**
   * @hooks
   */
  const { scrollbarsOptions } = useApp();

  let osInstance: OverlayScrollbars | undefined;

  useEffect(() => {
    if (descriptionScrollbarsRef?.current) {
      osInstance = OverlayScrollbars(descriptionScrollbarsRef?.current, scrollbarsOptions);
    }

    return () => osInstance?.destroy();
  }, [descriptionScrollbarsRef]);

  return (
    <div className="cases__case">
      <p className="cases__case-category">{content.category}</p>
      <h3 className="cases__case-title">{content.title}</h3>
      <div className="cases__case-description" data-overlayscrollbars-initialize ref={descriptionScrollbarsRef}>
        <p ref={descriptionRef}>{content.description}</p>
      </div>
      <p className="cases__case-technologies-title">Used technologies</p>
      <p>{content.technologies.join('; ')}</p>
    </div>
  );
};

const Cases: FC = () => {
  /**
   * @states
   */
  const [activeNavigateItem, setActiveNavigateItem] = useState<number>(initialActiveNavigateItem);

  /**
   * @references
   */
  const scrambleTimeoutRef = useRef<null | number>(null);

  /**
   * @memos
   */
  // Memoize the active `Case` content for search optimization
  const activeContent = useMemo(
    () => casesContents.find((item) => item.id === activeNavigateItem),
    [activeNavigateItem],
  );

  const { ref: descriptionRef } = useScramble({
    text: activeContent?.description || '',
    ...scrambleDescriptionParameters,
  });

  const { ref: decorativeTextRef, replay: scrambleReplay } = useScramble({
    ignore: ['0', 'x'],
    onAnimationEnd: () => {
      const timeout = randomBetween(4_100, 7_550);
      runWithTimeout(scrambleTimeoutRef, scrambleReplay, timeout);
    },
    range: [48, 57, 65, 70],
    text: `0x${randomChars(charsSequence, randomCharsNumber)}`,
    ...scrambleDecorativeTextParameters,
  });

  return (
    <div className="cases">
      <h2 className="cases__title">
        <Typed cursorChar="_" showCursor startWhenVisible strings={['Cases']} typeSpeed={50} />
      </h2>
      <div className="cases__decorative-corner" />
      <div className="cases__decorative-marquee-str-wrapper">
        <span className="cases__decorative-marquee-str-wrapper--brace">[</span>
        <div className="cases__decorative-marquee-str">
          <Marquee autoFill pauseOnHover speed={15}>
            • •scale your code• •maximize performance• •optimize your workflow
          </Marquee>
        </div>
        <span className="cases__decorative-marquee-str-wrapper--brace">]</span>
      </div>
      {/* Normal view of the display `Case` */}
      <div className="cases__case-wrapper">
        {casesContents.map((content) => (
          <CaseDetails content={content} key={content.id} />
        ))}
      </div>
      {/* Shrinked view of the display `Case` */}
      <div className="cases__shrinked-case-wrapper">
        {activeContent && (
          <CaseDetails content={activeContent} descriptionRef={descriptionRef} key={activeContent.id} />
        )}
      </div>
      {/* Navigating through the `Cases` */}
      <div className="cases__multi-wrapper">
        <div className="cases__decorative-indicators">
          {Array.from({ length: decorativeIndicatorsNumber }).map((_, index) => (
            <div className="cases__decorative-indicator" key={index}>{`[0${casesContents.length}]`}</div>
          ))}
        </div>
        <p>Our last cases</p>
        <div className="cases__navigate">
          {casesContents.map((content, _) => (
            <div
              className={`cases__navigate-btn ${activeNavigateItem === content.id ? 'active' : ''}`}
              key={content.id}
              onClick={() => setActiveNavigateItem(content.id)}
            >
              {`0${content.id}`}
            </div>
          ))}
        </div>
      </div>
      <div className="cases__decorative-text" ref={decorativeTextRef} />
    </div>
  );
};

export default Cases;
