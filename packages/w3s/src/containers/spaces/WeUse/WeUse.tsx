import { OverlayScrollbars } from "overlayscrollbars"
import React, { FC, useEffect, useMemo, useRef, useState } from "react"
import { ReactTyped as Typed } from "react-typed"

import { useApp } from "../../../contexts/App"

import "./WeUse.scss"

interface IWeUseContent {
  id: number
  toolsetTitle: string
  toolset: string[]
}

interface IWeUseDetailsProps {
  content: IWeUseContent
}

/* prettier-ignore */
const weUseContents: IWeUseContent[] = [
  {
    id: 1,
    toolsetTitle: "Languages",
    toolset: [
      "..",
      "Python",
      "Rust"
    ],
  },
  {
    id: 2,
    toolsetTitle: "Frameworks && Libs",
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
  },
  {
    id: 3,
    toolsetTitle: "Databases",
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
  },
  {
    id: 4,
    toolsetTitle: "Message Queues",
    toolset: [
      "..",
      "Kafka",
      "RabbitMQ",
      "Redis Pub/Sub"
    ],
  },
  {
    id: 5,
    toolsetTitle: "Testing",
    toolset: [
      "..",
      "PyTest",
      "Unittest",
      "Rust Test Module"
    ],
  },
  {
    id: 6,
    toolsetTitle: "Containerization",
    toolset: [
      "..",
      "Docker",
      "Docker Compose",
      "Kubernetes"
    ],
  },
  {
    id: 7,
    toolsetTitle: "Monitoring",
    toolset: [
      "..",
      "Sentry",
      "Grafana",
      "Prometheus"
    ],
  },
] as const

/**
 * The `WeUseDetails` component is responsible for displaying detailed information about a specific
 * toolset category. It receives a `content` object through props, which contains the title of the
 * toolset and a list of tools or technologies used in that category.
 *
 * @component
 * @param {IWeUseContent} content An object containing details of the toolset category, including it
 * is title and the list of tools.
 *
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
 *
 * @returns {JSX.Element} Returns JSX markup for displaying the toolset details, including the title
 * of category and a list of tools.
 */
const WeUseDetails: FC<IWeUseDetailsProps> = ({ content }) => {
  /** @references */
  const toolsScrollbarsRef = useRef<HTMLDivElement | null>(null)

  /** @hooks */
  const { scrollbarsOptions } = useApp()

  let osInstance: OverlayScrollbars | undefined = undefined

  useEffect(() => {
    if (toolsScrollbarsRef?.current) {
      osInstance = OverlayScrollbars(toolsScrollbarsRef?.current, scrollbarsOptions)
    }

    return () => osInstance?.destroy()
  }, [toolsScrollbarsRef])

  return (
    <React.Fragment>
      <h3 className={"we-use__toolset-title"}>{content.toolsetTitle}</h3>
      <div className={"we-use__tools"} ref={toolsScrollbarsRef} data-overlayscrollbars-initialize>
        {content.toolset.map(tool => (
          <p key={tool} className={"we-use__tool"}>
            <span className={"we-use__tool--highlight"}>{"~/>"}</span> {tool}
          </p>
        ))}
      </div>
    </React.Fragment>
  )
}

const initialActiveMenuItem = 1 as number

const WeUse: FC = () => {
  /** @states */
  const [activeMenuItem, setActiveMenuItem] = useState<number>(initialActiveMenuItem)

  /** @memos */
  // Memoize the active `WeUse` content for search optimization
  const activeContent = useMemo(() => weUseContents.find(item => item.id === activeMenuItem), [activeMenuItem])

  return (
    <div className={"we-use"}>
      <h2 className={"we-use__title"}>
        <Typed strings={["We Use"]} typeSpeed={50} cursorChar={"_"} showCursor={true} startWhenVisible />
      </h2>
      <div className={"we-use__decorative-text"}>{"[*&&/]"}</div>
      <div className={"we-use__decorative-corner"}></div>
      <div className={"we-use__menu"}>
        {weUseContents.map((content, _) => (
          <div
            key={content.id}
            className={`we-use__menu-item ${activeMenuItem === content.id ? "active" : ""}`}
            onClick={() => setActiveMenuItem(content.id)}
          >
            {content.toolsetTitle}
          </div>
        ))}
      </div>
      {/* Normal view of the display `WeUse` */}
      {weUseContents.map(content => (
        <div key={content.id} className={"we-use__toolset"}>
          <WeUseDetails key={content.id} content={content} />
        </div>
      ))}
      {/* Shrinked view of the display `WeUse` */}
      <div className={"we-use__shrinked-toolset"}>
        {activeContent && <WeUseDetails key={activeContent.id} content={activeContent} />}
      </div>
      <div className={"we-use__decorative-rectangle"}></div>
      <p className={"we-use__decorative-abstract-phrase"}>
        {"We cover the full range of services for analysis, development and support of your online business"}
      </p>
    </div>
  )
}

export default WeUse
