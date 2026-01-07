import './Main.scss';

import { useGSAP } from '@gsap/react';
import { gsap } from 'gsap';
import { SplitText } from 'gsap/SplitText';
import React, { useMemo, useRef, useState } from 'react';
import { ReactTyped as Typed } from 'react-typed';

import AnimateLines from '~/components/AnimateLines/AnimateLines';

gsap.registerPlugin(useGSAP, SplitText);

const TypedWrapper = React.memo(
  ({ onComplete, strings }: any) => {
    return (
      <Typed
        backSpeed={50}
        cursorChar="_"
        loop={false}
        onComplete={onComplete}
        showCursor
        smartBackspace
        strings={strings}
        typeSpeed={50}
      />
    );
  },
  () => true,
); // Never update after mounting

TypedWrapper.displayName = 'TypedWrapper';

type MainProps = {
  readonly zoomOut: (event: React.MouseEvent) => void;
};

const Main: React.FC<MainProps> = ({ zoomOut }) => {
  const container = useRef<HTMLDivElement | null>(null);

  const [startTyped, setStartTyped] = useState(false);

  const strings = useMemo(() => ['show ^800 all', 'show --all'], []);

  useGSAP(
    () => {
      const titleElement = gsap.utils.selector(container)('.main__text-title')[0];
      const leadElement = gsap.utils.selector(container)('.main__text-lead')[0];

      if (!titleElement || !leadElement) {
        return;
      }

      const splitTitle = new SplitText(titleElement, {
        linesClass: 'main__title-line',
        type: 'lines,words',
      });

      const splitLead = new SplitText(leadElement, {
        linesClass: 'main__lead-line',
        type: 'lines',
      });

      gsap
        .timeline({
          delay: 0.2,
          onComplete: () => setStartTyped(true),
        })
        .from(splitTitle.words, {
          duration: 0.8,
          ease: 'back.out',
          opacity: 0,
          stagger: 0.2,
          yPercent: 100,
        })
        .from(
          splitLead.lines,
          {
            duration: 0.8,
            ease: 'power2.out',
            opacity: 0,
            stagger: 0.2,
            y: 20,
          },
          '-=0.3',
        )
        .to({}, { duration: 0.3 });
    },
    { scope: container },
  );

  return (
    <div className="main" ref={container}>
      <div className="main__brand-logo">
        <picture>
          <img alt="Backendery" src="/assets/icons/brand-logo.svg" />
        </picture>
      </div>
      <div className="main__decorative-animate-lines-wrapper">
        <AnimateLines redrawInterval={6_500} />
      </div>
      <div className="main__text">
        <div className="main__text-title">
          Your ideas. <span>Engineered.</span>
        </div>
        <div className="main__text-lead">
          Turning visionary concepts into production-ready systems through high-end engineering and strategic execution
        </div>
      </div>
      <div className="main__show-all" onClick={zoomOut}>
        <span>{"~/site/"}</span>
        {startTyped && <TypedWrapper onComplete={() => {}} strings={strings} />}
      </div>
    </div>
  );
};

export default Main;
