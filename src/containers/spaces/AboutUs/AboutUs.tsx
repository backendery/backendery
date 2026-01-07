import './AboutUs.scss';

import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import React, { useEffect, useRef, useState } from 'react';
import { ReactTyped as Typed } from 'react-typed';

import { useRotator } from '~/hooks/useRotator';
import { randomBetween, runWithTimeout } from '~/utils/fn';

// We're extracting the data to make it easier to map
const members = [
  {
    imgBase: '/assets/images/cto',
    name: 'Iaroslav',
    position: 'CTO &\nSoftware Engineering',
  },
  {
    imgBase: '/assets/images/cbo',
    name: 'Maxym',
    position: 'CBO &\nBusiness • Partners',
  },
  {
    imgBase: '/assets/images/cdo',
    name: 'Oleh',
    position: 'CDO &\nProduct Design • UX',
  },
];

const AboutUs: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const imageReferences = useRef<Array<HTMLImageElement | null>>([]);

  // Refs for SVG filter animation
  const displacementMapRef = useRef<SVGFEDisplacementMapElement>(null);
  const turbulenceRef = useRef<SVGFETurbulenceElement>(null);

  const [activeSlideIndex, setActiveSlideIndex] = useState(0);

  const lowerSquareTimeoutRef = useRef<null | number>(null);
  const upperSquareTimeoutRef = useRef<null | number>(null);

  const { ref: lowerSquareRef, replay: lowerSquareReplay } = useRotator({
    angle: 90,
    direction: 'right',
    duration: 200,
    onAnimationEnd: () => {
      runWithTimeout(lowerSquareTimeoutRef, lowerSquareReplay, randomBetween(3_500, 7_000));
    },
  });

  const { ref: upperSquareRef, replay: upperSquareReplay } = useRotator({
    angle: 180,
    direction: 'left',
    duration: 400,
    onAnimationEnd: () => {
      runWithTimeout(upperSquareTimeoutRef, upperSquareReplay, randomBetween(2_200, 5_800));
    },
  });

  useEffect(() => {
    runWithTimeout(lowerSquareTimeoutRef, lowerSquareReplay);
    runWithTimeout(upperSquareTimeoutRef, upperSquareReplay);
    return () => {
      if (lowerSquareTimeoutRef.current) { clearTimeout(lowerSquareTimeoutRef.current); }
      if (upperSquareTimeoutRef.current) { clearTimeout(upperSquareTimeoutRef.current); }
    };
  }, []);

  const { contextSafe } = useGSAP(
    () => {
      // Initial state: show only the first slide
      gsap.set(imageReferences.current, { opacity: 0, zIndex: 1 });
      gsap.set(imageReferences.current[0], { opacity: 1, zIndex: 2 });
    },
    { scope: containerRef },
  );

  const goToNextSlide = contextSafe(() => {
    const nextIndex = (activeSlideIndex + 1) % members.length;
    const currentImg = imageReferences.current[activeSlideIndex];
    const nextImg = imageReferences.current[nextIndex];

    if (!currentImg || !nextImg || !displacementMapRef.current || !turbulenceRef.current) { return; }

    const tl = gsap.timeline({
      onStart: () => {
        // Change the text state at the beginning of the animation (or in the middle, to taste)
        setActiveSlideIndex(nextIndex);
      },
    });

    // 1. "Charge" the noise
    // A random seed makes the noise slightly different each time
    tl.set(turbulenceRef.current, { attr: { seed: randomBetween(1, 100) } });

    // 2. Transition animation
    tl.to(displacementMapRef.current, {
      attr: { scale: 50 }, // Сила искажения
      duration: 0.2,
      ease: 'power2.in',
    })
      .add(() => {
        // Change images at peak distortion
        gsap.set(currentImg, { opacity: 0, zIndex: 1 });
        gsap.set(nextImg, { opacity: 1, zIndex: 2 });
      })
      .to(displacementMapRef.current, {
        attr: { scale: 0 }, // Remove distortion
        duration: 0.5,
        ease: 'power2.out',
      });
  });

  // Autoplay
  useEffect(() => {
    const timer = setInterval(goToNextSlide, 4_200); // 4_200 delay + transition time approx
    return () => clearInterval(timer);
  }, [activeSlideIndex, goToNextSlide]);

  return (
    <div className="about-us" ref={containerRef}>
      {/* SVG Filter Definition (Hidden) */}
      <svg style={{ display: 'none' }}>
        <defs>
          <filter id="noise-transition-filter">
            <feTurbulence baseFrequency="0.35" numOctaves="5" ref={turbulenceRef} result="noise" type="fractalNoise" />
            <feDisplacementMap
              in="SourceGraphic"
              in2="noise"
              ref={displacementMapRef}
              scale="0"
              xChannelSelector="R"
              yChannelSelector="G"
            />
          </filter>
        </defs>
      </svg>
      <h2 className="about-us__title">
        <Typed cursorChar="_" showCursor startWhenVisible strings={['About Us']} typeSpeed={50} />
      </h2>
      <div className="about-us__description-wrapper">
        <p className="about-us__description">
          <span className="about-us__description-bracket">[</span>
          {`
            We're a small, friendly digital studio crafting software that works reliably and efficiently.
            We partner closely with our clients to understand their goals and deliver high-quality
            solutions tailored to each project
          `}
          <span className="about-us__description-bracket">]</span>
        </p>
      </div>
      <div className="about-us__stats">
        <p className="about-us__stats-value">10</p>
        <p className="about-us__stats-description">
          ./engineers <span>avg</span> years of experience
        </p>
      </div>
      <div className="about-us__team">
        <div className="about-us__decorative-square-wrapper">
          <div className="about-us__decorative-square" ref={lowerSquareRef} />
          <div className="about-us__decorative-square" ref={upperSquareRef} />
        </div>
        <div className="about-us__team-mbr">
          <p className="about-us__team-mbr-name">{members[activeSlideIndex].name}</p>
          <p className="about-us__team-mbr-position">
            {members[activeSlideIndex].position.split('\n').map((line, index, array) => (
              <React.Fragment key={index}>
                {line}
                {index < array.length - 1 && <br />}
              </React.Fragment>
            ))}
          </p>
        </div>
        <div className="about-us__team-image-wrapper">
          {members.map((mbr, index) => (
            <picture className="about-us__team-image-slide" key={mbr.name}>
              <source srcSet={`${mbr.imgBase}.avif`} type="image/avif" />
              <source srcSet={`${mbr.imgBase}.webp`} type="image/webp" />
              <img
                alt={mbr.name}
                loading={index === 0 ? 'eager' : 'lazy'}
                ref={(elt) => {
                  imageReferences.current[index] = elt;
                }}
                src={`${mbr.imgBase}.jpg`}
              />
            </picture>
          ))}
        </div>
      </div>
      <p className="about-us__decorative-text--static">[../]</p>
    </div>
  );
};

export default AboutUs;
