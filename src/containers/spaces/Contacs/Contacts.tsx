import './Contacts.scss';

import { type FC, useEffect, useRef } from 'react';
import { ReactTyped as Typed } from 'react-typed';

import AnimateRadixGrid from '../../../components/AnimateRadixGrid/AnimateRadixGrid';
import SvgIcon from '../../../components/elements/Icon';
import { useRotator } from '../../../hooks/useRotator';
import { randomBetween, runWithTimeout } from '../../../utils/fn';

const Contacts: FC = () => {
  /**
   * @references
   */
  const squareTimeoutRef = useRef<null | number>(null);

  const { ref: decorativeSquareRef, replay: squareReplay } = useRotator({
    duration: 1_100,
    onAnimationEnd: () => {
      runWithTimeout(squareTimeoutRef, squareReplay, randomBetween(3_850, 6_700));
    },
    randomizeRotation: true,
  });

  useEffect(() => {
    runWithTimeout(squareTimeoutRef, squareReplay);

    return () => {
      if (squareTimeoutRef.current) {
        clearTimeout(squareTimeoutRef.current);
      }
    };
  }, []);

  return (
    <div className="contacts">
      <h2 className="contacts__title">
        <Typed cursorChar="_" showCursor startWhenVisible strings={['Contacts']} typeSpeed={50} />
      </h2>
      <div className="contacts__decorative-wrapper">
        <div className="contacts__decorative-square" ref={decorativeSquareRef} />
      </div>
      <div className="contacts__email-wrapper">
        <p className="contacts__email-description">Not everybody has an experienced backend developer... write to us</p>
        <a className="contacts__email-address" href="mailto:hi@backendery.digital">
          hi@backendery.digital
        </a>
      </div>
      <div className="contacts__social-wrapper">
        <a className="contacts__social-link" href="#">
          LinkedIn
          <SvgIcon name="arrow-up" />
        </a>
        <a
          className="contacts__social-link"
          href="https://github.com/backendery/"
          rel="noreferrer noopener"
          target="_blank"
        >
          GitHub
          <SvgIcon name="arrow-up" />
        </a>
      </div>
      <div className="contacts__decorative-animate-radix-grid-wrapper">
        {/* prettier-ignore */}
        <AnimateRadixGrid
          cols={3}
          maxInterval={650}
          minInterval={300}
          rows={7}
          symbols={["0", "1"]}
          unreachableCells={[
            [3, 1], [4, 1], [5, 1], [6, 1],
                    [4, 2], [5, 2], [6, 2],
          ]}
        />
      </div>
    </div>
  );
};

export default Contacts;
