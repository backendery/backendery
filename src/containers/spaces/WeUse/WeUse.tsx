import './WeUse.scss';

import { OverlayScrollbars } from 'overlayscrollbars';
import React, { type FC, useEffect, useMemo, useRef, useState } from 'react';
import { ReactTyped as Typed } from 'react-typed';

import { useApp } from '../../../contexts/App';

type IWeUseContent = {
  id: number;
  toolset: string[];
  toolsetTitle: string;
};

type IWeUseDetailsProps = {
  readonly content: IWeUseContent;
};

/* prettier-ignore */
const weUseContents: IWeUseContent[] = [
  {
    id: 1,
    toolset: [
      "..",
      "Python",
      "Rust"
    ],
    toolsetTitle: "Languages",
  },
  {
    id: 2,
    toolset: [
      "..",
      "Asyncio && Tokio",
      "FastAPI",
      "Axum",
      "SQLAlchemy && Diesel",
      "Celery",
      "Pydantic",
      "SerDe",
      "... and much more",
    ],
    toolsetTitle: "Frameworks && Libs",
  },
  {
    id: 3,
    toolset: [
      "..",
      "PostgreSQL",
      "Gel (aka EdgeDB)",
      "MongoDB",
      "Redis",
      "Elasticsearch",
      "FirebaseRDB",
      "InfluxDB"
    ],
    toolsetTitle: "Databases",
  },
  {
    id: 4,
    toolset: [
      "..",
      "Kafka",
      "RabbitMQ",
      "Redis Pub/Sub"
    ],
    toolsetTitle: "Message Queues",
  },
  {
    id: 5,
    toolset: [
      "..",
      "PyTest",
      "Unittest",
      "Rust Test Module"
    ],
    toolsetTitle: "Testing",
  },
  {
    id: 6,
    toolset: [
      "..",
      "Docker",
      "Docker Compose",
      "Kubernetes"
    ],
    toolsetTitle: "Containerization",
  },
  {
    id: 7,
    toolset: [
      "..",
      "Sentry",
      "Grafana",
      "Prometheus"
    ],
    toolsetTitle: "Monitoring",
  },
] as const;

/**
 * The `WeUseDetails` component is responsible for displaying detailed information about a specific
 * toolset category. It receives a `content` object through props, which contains the title of the
 * toolset and a list of tools or technologies used in that category.
 * @component
 * @param {IWeUseContent} content An object containing details of the toolset category, including it
 * is title and the list of tools.
 * @example
 * ```tsx
 * const content = {
 *   id: 1,
 *   toolsetTitle: "Languages",
 *   toolset: ["Python", "Rust"]
 * };
 *
 * <div>
 *   <WeUseDetails key={content.id} content={content} />
 * </div>
 * ```
 * @returns {JSX.Element} Returns JSX markup for displaying the toolset details, including the title
 * of category and a list of tools.
 */
const WeUseDetails: FC<IWeUseDetailsProps> = ({ content }) => {
  /**
   * @references
   */
  const toolsScrollbarsRef = useRef<HTMLDivElement | null>(null);

  /**
   * @hooks
   */
  const { scrollbarsOptions } = useApp();

  let osInstance: OverlayScrollbars | undefined;

  useEffect(() => {
    if (toolsScrollbarsRef?.current) {
      osInstance = OverlayScrollbars(toolsScrollbarsRef?.current, scrollbarsOptions);
    }

    return () => osInstance?.destroy();
  }, [toolsScrollbarsRef]);

  return (
    <>
      <h3 className="we-use__toolset-title">{content.toolsetTitle}</h3>
      <div className="we-use__tools" data-overlayscrollbars-initialize ref={toolsScrollbarsRef}>
        {content.toolset.map((tool) => (
          <p className="we-use__tool" key={tool}>
            <span className="we-use__tool--highlight">{'~/>'}</span> {tool}
          </p>
        ))}
      </div>
    </>
  );
};

const initialActiveMenuItem = 1 as number;

const WeUse: FC = () => {
  /**
   * @states
   */
  const [activeMenuItem, setActiveMenuItem] = useState<number>(initialActiveMenuItem);

  /**
   * @memos
   */
  // Memoize the active `WeUse` content for search optimization
  const activeContent = useMemo(() => weUseContents.find((item) => item.id === activeMenuItem), [activeMenuItem]);

  return (
    <div className="we-use">
      <h2 className="we-use__title">
        <Typed cursorChar="_" showCursor startWhenVisible strings={['We Use']} typeSpeed={50} />
      </h2>
      <div className="we-use__decorative-text">[*&&/]</div>
      <div className="we-use__decorative-corner" />
      <div className="we-use__menu">
        {weUseContents.map((content, _) => (
          <div
            className={`we-use__menu-item ${activeMenuItem === content.id ? 'active' : ''}`}
            key={content.id}
            onClick={() => setActiveMenuItem(content.id)}
          >
            {content.toolsetTitle}
          </div>
        ))}
      </div>
      {/* Normal view of the display `WeUse` */}
      {weUseContents.map((content) => (
        <div className="we-use__toolset" key={content.id}>
          <WeUseDetails content={content} key={content.id} />
        </div>
      ))}
      {/* Shrinked view of the display `WeUse` */}
      <div className="we-use__shrinked-toolset">
        {activeContent && <WeUseDetails content={activeContent} key={activeContent.id} />}
      </div>
      <div className="we-use__decorative-rectangle" />
      <p className="we-use__decorative-abstract-phrase">
        We cover the full range of services for analysis, development and support of your online business
      </p>
    </div>
  );
};

export default WeUse;
