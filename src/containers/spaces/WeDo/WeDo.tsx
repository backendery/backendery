import './WeDo.scss';

import { type FC, useMemo, useState } from 'react';
import { ReactTyped as Typed } from 'react-typed';
import { useScramble } from 'use-scramble';

import AnimateRadixGrid from '~/components/AnimateRadixGrid/AnimateRadixGrid';
import AnimateSignalStrip from '~/components/AnimateSignalStrip/AnimateSignalStrip';
import StdoutRow from '~/components/StdoutRow/StdoutRow';

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
      Engineered with Rust and Python for mission-critical systems. We build
      distributed architectures, high-load APIs, and real-time data engines
      where performance and memory safety are non-negotiable
    `,
    id: 1,
    theses: [
      "Low-latency services",
      "Distr-Sys architecture",
      "Cloud-native scalability"
    ],
    title: "High-Performance Backend",
  },
  {
    decorativeSymbols: "/~",
    description: `
      We go beyond simple wrappers. Our team develops autonomous AI agents
      using RAG, tool-use, and multi-agent orchestration to solve complex
      reasoning tasks and automate cognitive labor
    `,
    id: 2,
    theses: [
      "Custom RAG & Vector Search",
      "Agentic workflows & Tool-use",
      "Fine-tuning & Integration"
    ],
    title: "AI Agents & LLM Ops",
  },
  {
    decorativeSymbols: "@;",
    description: `
      Developing next-gen interfaces where AI is a core feature, not an add-on.
      From advanced bots for messengers to interactive web platforms, we deliver
      seamless user experiences powered by real-time intelligence
    `,
    id: 3,
    theses: [
      "React.js || Next.js ecosys",
      "Intelligent Chatbots & CLI",
      "Real-time reactive UI"
    ],
    title: "Intelligence-Driven UX",
  },
  {
    decorativeSymbols: "&*",
    description: `
      Connecting the disconnected. We build sophisticated workflows using
      Airflow, Camunda, or n8n to bridge legacy systems with modern AI capabilities,
      eliminating manual data silos and operational bottlenecks
    `,
    id: 4,
    theses: [
      "Cross-platform orchestration",
      "Data pipeline automation",
      "Legacy-to-Cloud bridging"
    ],
    title: "Complex Automation",
  }
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
