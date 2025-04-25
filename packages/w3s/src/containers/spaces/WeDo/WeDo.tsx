import { FC, useMemo, useState } from "react"
import { ReactTyped as Typed } from "react-typed"
import { useScramble } from "use-scramble"

import AnimateRadixGrid from "../../../components/AnimateRadixGrid/AnimateRadixGrid"
import AnimateSignalStrip from "../../../components/AnimateSignalStrip/AnimateSignalStrip"
import StdoutRow from "../../../components/StdoutRow/StdoutRow"

import "./WeDo.scss"

interface IWeDoContent {
  id: number
  decorativeSymbols: string
  title: string
  description: string
  theses: string[]
}

/* prettier-ignore */
const weDoContents: IWeDoContent[] = [
  {
    id: 1,
    decorativeSymbols: "=>",
    title: "Server Apps && API",
    description: `
      We develop high-performance server applications and APIs that ensure reliable
      interaction between systems. Our solutions are tailored to meet specific business
      needs, enhancing operational efficiency and scalability
  `,
    theses: [
      "High-performance apps",
      "Reliable system interaction",
      "Scalability and operational"
    ]
  },
  {
    id: 2,
    decorativeSymbols: "@;",
    title: "Services Integration",
    description: `
      We integrate diverse services to create seamless and effective workflows. By
      ensuring compatibility and efficiency, we help businesses streamline their processes
      and improve overall productivity
    `,
    theses: [
      "Seamless integration",
      "Compatibility and efficiency",
      "Streamlined processes"
    ]
  },
  {
    id: 3,
    decorativeSymbols: "~/",
    title: "CLI && Automation Tools",
    description: `
      We create command-line tools and automation solutions to simplify routine tasks and
      boost productivity. Our tools are designed to enhance user experience, allowing teams
      to focus on more strategic initiatives
    `,
    theses: [
      "Command-line tools",
      "Routine task automation",
      "Enhanced productivity"
    ]
  },
  {
    id: 4,
    decorativeSymbols: "&*",
    title: "Bots",
    description: `
      We develop bots for various platforms, including chatbots and user interaction
      automation. These solutions enhance customer experience and engagement, providing
      quick responses and improving service quality
    `,
    theses: [
      "Multibots",
      "Customer enhancement",
      "Improved engagement"
    ]
  },
] as const

const scrambleDescriptionParams = {
  speed: 0.85,
  scramble: 3,
  step: 5,
  seed: 3,
  overflow: true,
  overdrive: false,
  playOnMount: false,
} as const

const initialActiveMenuItem = 1 as number

const WeDo: FC = () => {
  /** @states */
  const [activeMenuItem, setActiveMenuItem] = useState<number>(initialActiveMenuItem)

  /** @memos */
  //Memoize the active `WeDo` content for search optimization
  const activeContent = useMemo(() => weDoContents.find(item => item.id === activeMenuItem), [activeMenuItem])

  const { ref: descriptionRef } = useScramble({
    text: activeContent?.description || "",
    ...scrambleDescriptionParams,
  })

  return (
    <div className={"we-do"}>
      <h2 className={"we-do__title"}>
        <Typed strings={["We Do"]} typeSpeed={50} cursorChar={"_"} showCursor={true} startWhenVisible />
      </h2>
      <div className={"we-do__decorative-corner"}></div>
      <div className={"we-do__menu"}>
        {weDoContents.map((content, _) => (
          <div key={content.id} className={`we-do__menu-item ${activeMenuItem === content.id ? "active" : ""}`}>
            <p className={`we-do__menu-item-symbols ${activeMenuItem === content.id ? "active" : ""}`}>
              {content.decorativeSymbols}
            </p>
            <p
              className={`we-do__menu-item-title ${activeMenuItem === content.id ? "active" : ""}`}
              onClick={() => setActiveMenuItem(content.id)}
            >
              {content.title}
            </p>
          </div>
        ))}
      </div>
      <div className={"we-do__description-wrapper"}>
        <div className={"we-do__decorative-animate-signal-strip-wrapper"}>
          <AnimateSignalStrip
            symbol={"."}
            maxNumberOfSymbols={7}
            minInterval={1250}
            maxInterval={2500}
            initialSymbols={"....."}
            style={{ color: "#00df82" }}
          />
          <AnimateSignalStrip
            symbol={"."}
            maxNumberOfSymbols={4}
            minInterval={1000}
            maxInterval={2500}
            initialSymbols={".."}
            style={{ color: "#f1f7f7" }}
          />
        </div>
        <div className={"we-do__description"}>
          <span className={"we-do__description-highlight"}>{"/** dream it, build it */"}</span>
          <p ref={descriptionRef}>{activeContent && activeContent.description}</p>
        </div>
        {/* prettier-ignore */}
        <div className={"we-do__decorative-stdout-row-wrapper"}>
          {
               activeContent
            && activeContent.theses
            && activeContent.theses.map((thesis, _) => (
                <StdoutRow key={thesis} text={thesis} style={{ textTransform: "uppercase" }} />
            ))
          }
        </div>
      </div>
      <div className={"we-do__decorative-text"}>{"~/../.."}</div>
      <div className={"we-do__decorative-animate-radix-grid-wrapper"}>
        <AnimateRadixGrid
          symbols={["0", "1"]}
          rows={7}
          cols={2}
          minInterval={300}
          maxInterval={750}
          unreachableCells={[
            [3, 0],
            [4, 0],
            [5, 0],
            [6, 0],
          ]}
        />
      </div>
    </div>
  )
}

export default WeDo
