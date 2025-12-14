import './WeDo.scss';

import { type FC, useMemo, useState } from 'react';
import { ReactTyped as Typed } from 'react-typed';
import { useScramble } from 'use-scramble';

import AnimateRadixGrid from '../../../components/AnimateRadixGrid/AnimateRadixGrid';
import AnimateSignalStrip from '../../../components/AnimateSignalStrip/AnimateSignalStrip';
import StdoutRow from '../../../components/StdoutRow/StdoutRow';

type IWeDoContent = {
  decorativeSymbols: string;
  description: string;
  id: number;
  theses: string[];
  title: string;
};

/* prettier-ignore */
const weDoContents: IWeDoContent[] = [
  {
    decorativeSymbols: "=>",
    description: `
      We develop high-performance server applications and APIs that ensure reliable
      interaction between systems. Our solutions are tailored to meet specific business
      needs, enhancing operational efficiency and scalability
  `,
    id: 1,
    theses: [
      "High-performance apps",
      "Reliable system interaction",
      "Scalability and operational"
    ],
    title: "Server Apps && API"
  },
  {
    decorativeSymbols: "@;",
    description: `
      We integrate diverse services to create seamless and effective workflows. By
      ensuring compatibility and efficiency, we help businesses streamline their processes
      and improve overall productivity
    `,
    id: 2,
    theses: [
      "Seamless integration",
      "Compatibility and efficiency",
      "Streamlined processes"
    ],
    title: "Services Integration"
  },
  {
    decorativeSymbols: "~/",
    description: `
      We create command-line tools and automation solutions to simplify routine tasks and
      boost productivity. Our tools are designed to enhance user experience, allowing teams
      to focus on more strategic initiatives
    `,
    id: 3,
    theses: [
      "Command-line tools",
      "Routine task automation",
      "Enhanced productivity"
    ],
    title: "CLI && Automation Tools"
  },
  {
    decorativeSymbols: "&*",
    description: `
      We develop bots for various platforms, including chatbots and user interaction
      automation. These solutions enhance customer experience and engagement, providing
      quick responses and improving service quality
    `,
    id: 4,
    theses: [
      "Multibots",
      "Customer enhancement",
      "Improved engagement"
    ],
    title: "Bots"
  },
] as const;

const scrambleDescriptionParameters = {
  overdrive: false,
  overflow: true,
  playOnMount: false,
  scramble: 3,
  seed: 3,
  speed: 0.85,
  step: 5,
} as const;

const initialActiveMenuItem = 1 as number;

const WeDo: FC = () => {
  /**
   * @states
   */
  const [activeMenuItem, setActiveMenuItem] = useState<number>(initialActiveMenuItem);

  /**
   * @memos
   */
  // Memoize the active `WeDo` content for search optimization
  const activeContent = useMemo(() => weDoContents.find((item) => item.id === activeMenuItem), [activeMenuItem]);

  const { ref: descriptionRef } = useScramble({
    text: activeContent?.description || '',
    ...scrambleDescriptionParameters,
  });

  return (
    <div className="we-do">
      <h2 className="we-do__title">
        <Typed cursorChar="_" showCursor startWhenVisible strings={['We Do']} typeSpeed={50} />
      </h2>
      <div className="we-do__decorative-corner" />
      <div className="we-do__menu">
        {weDoContents.map((content, _) => (
          <div className={`we-do__menu-item ${activeMenuItem === content.id ? 'active' : ''}`} key={content.id}>
            <p className={`we-do__menu-item-symbols ${activeMenuItem === content.id ? 'active' : ''}`}>
              {content.decorativeSymbols}
            </p>
            <p
              className={`we-do__menu-item-title ${activeMenuItem === content.id ? 'active' : ''}`}
              onClick={() => setActiveMenuItem(content.id)}
            >
              {content.title}
            </p>
          </div>
        ))}
      </div>
      <div className="we-do__description-wrapper">
        <div className="we-do__decorative-animate-signal-strip-wrapper">
          <AnimateSignalStrip
            initialSymbols="....."
            maxInterval={2_500}
            maxNumberOfSymbols={7}
            minInterval={1_250}
            style={{ color: '#00df82' }}
            symbol="."
          />
          <AnimateSignalStrip
            initialSymbols=".."
            maxInterval={2_500}
            maxNumberOfSymbols={4}
            minInterval={1_000}
            style={{ color: '#f1f7f7' }}
            symbol="."
          />
        </div>
        <div className="we-do__description">
          <span className="we-do__description-highlight">{'/** dream it, build it */'}</span>
          <p ref={descriptionRef}>{activeContent?.description}</p>
        </div>
        {/* prettier-ignore */}
        <div className="we-do__decorative-stdout-row-wrapper">
          {
               activeContent?.theses?.map((thesis, _) => (
                <StdoutRow key={thesis} style={{ textTransform: "uppercase" }} text={thesis} />
            ))
          }
        </div>
      </div>
      <div className="we-do__decorative-text">~/../..</div>
      <div className="we-do__decorative-animate-radix-grid-wrapper">
        <AnimateRadixGrid
          cols={2}
          maxInterval={750}
          minInterval={300}
          rows={7}
          symbols={['0', '1']}
          unreachableCells={[
            [3, 0],
            [4, 0],
            [5, 0],
            [6, 0],
          ]}
        />
      </div>
    </div>
  );
};

export default WeDo;
