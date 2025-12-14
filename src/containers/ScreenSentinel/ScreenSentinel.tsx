import './ScreenSentinel.scss';

import { useEffect, useState } from 'react';

import SvgIcon from '~/components/elements/Icon';
import { addClass, removeClass } from '~/utils/fn';

const innerHeightThreshold = 600 as number;

/**
 * Inspect if the window height is below a certain threshold.
 * @function
 * @param {number} heightThreshold The height threshold to compare with.
 * @returns {boolean} True if the window height is less than the threshold, false otherwise.
 */
const isBelowThreshold = (heightThreshold: number): boolean => {
  return window.innerHeight < heightThreshold;
};

/**
 * Updates the body's class based on screen height.
 * @function
 * @param {boolean} isBelowThreshold Whether the height is below the threshold.
 */
const updateHtmlTag = (isBelowThreshold: boolean): void => {
  isBelowThreshold ? addClass(document.body, 'small-height') : removeClass(document.body, 'small-height');
};

const ScreenSentinel: React.FC = () => {
  /**
   * Handles the change in screen orientation/resize and updates state.
   * @function
   */
  const handleResizeViewport = () => {
    setIsSmallHeight(isBelowThreshold(innerHeightThreshold));
    // Update body class based on the orientation
    updateHtmlTag(isBelowThreshold(innerHeightThreshold));
  };

  /**
   * Adds or removes event listeners for checking orientation changes.
   * @function
   * @param {boolean} isAdd If true, adds event listeners; if false, removes them.
   */
  const manageEventListeners = (isAdd: boolean) => {
    const action = isAdd ? 'addEventListener' : 'removeEventListener';

    window[action]('orientationchange', handleResizeViewport);
    window[action]('resize', handleResizeViewport);
  };

  /**
   * @states
   */
  /**
   * State that tracks whether the current window height is below a specified threshold. The value
   * is initially set based on the current window height, and it updates whenever the screen is
   * resized or the orientation changes. If the height is below the threshold, the state is set to
   * `true`, otherwise, it's `false`.
   * @type {boolean} isSmallHeight - A boolean indicating whether the window height is smaller than
   * the threshold.
   * @function setIsSmallHeight - A function to update the state of `isSmallHeight` based on the
   * current screen height.
   */
  const [isSmallHeight, setIsSmallHeight] = useState<boolean>(isBelowThreshold(innerHeightThreshold));

  useEffect(() => {
    // Initial orientation check on render
    manageEventListeners(true); // Add event listeners

    // Initial viewport inspection
    handleResizeViewport();

    // Clean up event listeners on component unmount
    return () => manageEventListeners(false);
  }, []);

  return (
    <>
      {isSmallHeight && (
        <div className="screen-sentinel">
          <div className="screen-sentinel__overlay">
            <div className="screen-sentinel__message">
              <SvgIcon name="rotate-device" />
              <p>Uh-oh! Please, increase the height of your screen</p>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ScreenSentinel;
