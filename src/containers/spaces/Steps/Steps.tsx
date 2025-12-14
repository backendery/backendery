import './Steps.scss';

import { type FC, useMemo, useRef, useState } from 'react';
import { ReactTyped as Typed } from 'react-typed';
import { useScramble } from 'use-scramble';

import StdoutRow from '~/components/StdoutRow/StdoutRow';

import { useRotator } from '../../../hooks/useRotator';
import { randomBetween, randomChars, runWithTimeout } from '../../../utils/fn';

type IStepsContent = {
  description: string;
  id: number;
  theses: string[];
  title: string;
};

/* prettier-ignore */
const stepsContents: IStepsContent[] = [
  {
    description: `
      We dive deep into your business, identifying key goals and challenges. Through in-depth
      research and collaborative discussions, we craft a tailored project plan, ensuring every
      detail aligns with your vision and sets the stage for a successful development journey
    `,
    id: 1,
    theses: [
      "In-depth research",
      "Business goals",
      "Project roadmap",
      "Strategic project foundation"
    ],
    title: "Analysis",
  },
  {
    description: `
      We bring your vision to life with precision and innovation, building a robust backend that
      grows with your business. Every solution is tailored for scalability, security, and
      performance, ensuring that your system not only works today but evolves with future demands
    `,
    id: 2,
    theses: [
      "Custom backend solutions",
      "Scalable and secure",
      "High-performance",
      "Future-proof development"
    ],
    title: "Development",
  },
  {
    description: `
      We ensure your backend performs as expected through focused testing. Our team reviews key
      functionalities, addressing potential issues early to guarantee stability, security,
      and seamless integration with other systems, all while minimizing delays in the development
      process
    `,
    id: 3,
    theses: [
      "Focused backend testing",
      "Stability assurance",
      "Early issue resolution",
      "Seamless integration"
    ],
    title: "Testing",
  },
  {
    description: `
      Before launch, we recreate real-world scenarios in a staging environment, ensuring every
      feature, function, and integration works perfectly. This step gives us and you the confidence
      that the final product will excel when it goes live
    `,
    id: 4,
    theses: [
      "Scenario simulation",
      "Pre-launch validation",
      "Staging environment",
      "Production-ready checks"
    ],
    title: "Staging",
  },
  {
    description: `
      We handle the final step with care and precision, ensuring a seamless, trouble-free launch.
      Post-launch, we're with you, providing ongoing support and optimizations to ensure your system
      runs smoothly and continues to meet evolving needs
    `,
    id: 5,
    theses: [
      "Seamless deployment",
      "Post-launch support",
      "Ongoing optimization",
      "Smooth production release"
    ],
    title: "Release",
  },
] as const;

const charsSequence = '*<>_{}' as string;
const randomCharsNumber = (1 << 3) as number;

const scrambleDecorativeText = randomChars(charsSequence, randomCharsNumber);
const scrambleDecorativeTextParameters = {
  overdrive: false,
  overflow: true,
  scramble: 10,
  speed: 0.55,
  step: 1,
  tick: 3,
} as const;

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

const Steps: FC = () => {
  /**
   * @states
   */
  const [activeNavigateItem, setActiveNavigateItem] = useState<number>(initialActiveNavigateItem);

  /**
   * @references
   */
  const scrambleTimeoutRef = useRef<null | number>(null);
  const squareTimeoutRef = useRef<null | number>(null);

  /**
   * @memos
   */
  // Memoize the active `Steps` content for search optimization
  const activeContent = useMemo(
    () => stepsContents.find((item) => item.id === activeNavigateItem),
    [activeNavigateItem],
  );

  const { ref: scrambleDecorativeTextRef, replay: scrambleReplay } = useScramble({
    onAnimationEnd: () => {
      const timeout = randomBetween(10_500, 14_000);
      runWithTimeout(scrambleTimeoutRef, scrambleReplay, timeout);
    },
    range: [33, 43],
    text: scrambleDecorativeText,
    ...scrambleDecorativeTextParameters,
  });

  const { ref: descriptionRef } = useScramble({
    text: activeContent?.description || '',
    ...scrambleDescriptionParameters,
  });

  const { ref: decorativeSquareRef, replay: squareReplay } = useRotator({
    angle: 270,
    direction: 'right',
    duration: 600,
    onAnimationEnd: () => {
      const timeout = randomBetween(4_000, 8_250);
      runWithTimeout(squareTimeoutRef, squareReplay, timeout);
    },
  });

  return (
    <div className="steps">
      <h2 className="steps__title">
        <Typed cursorChar="_" showCursor startWhenVisible strings={['Steps']} typeSpeed={50} />
      </h2>
      <p className="steps__decorative-text--static">&//=</p>
      <div className="steps__navigate">
        {stepsContents.map((content, _) => (
          <div
            className={`steps__navigate-btn ${activeNavigateItem === content.id ? 'active' : ''}`}
            key={content.id}
            onClick={() => setActiveNavigateItem(content.id)}
          >
            {`0${content.id}`}
          </div>
        ))}
      </div>
      <div className="steps__decorative-square" ref={decorativeSquareRef} />
      <div className="steps__step-title-wrapper">
        <p className="steps__step-title-navigate-item">{`/0${activeContent?.id}`}</p>
        <h3 className="steps__step-title">{activeContent?.title}</h3>
      </div>
      <div className="steps__step-description-wrapper">
        <p className="steps__step-description" ref={descriptionRef}>
          {activeContent?.description}
        </p>
        {/* prettier-ignore */}
        <div className="steps__decorative-stdout-row-wrapper">
          {
               activeContent?.theses?.map((thesis, _) => (
                <StdoutRow key={thesis} style={{ textTransform: "uppercase" }} text={thesis} />
            ))
          }
        </div>
      </div>
      <p className="steps__decorative-text--scramble" ref={scrambleDecorativeTextRef} />
      <p className="steps__decorative-abstract-phrase">These sessions give you direct access</p>
    </div>
  );
};

export default Steps;
