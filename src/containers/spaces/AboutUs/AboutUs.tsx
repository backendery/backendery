import './AboutUs.scss';

import React, { useEffect, useRef, useState } from 'react';
import { ReactTyped as Typed } from 'react-typed';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';

import { useRotator } from '~/hooks/useRotator';
import { randomBetween, runWithTimeout } from '~/utils/fn';

const teamMembers = [
  {
    name: 'Iaroslav',
    position: 'CTO &\nSoftware Engineering',
    imgBase: '/assets/images/cto.avif',
  },
  {
    name: 'Maxym',
    position: 'CBO &\nBusiness • Partners',
    imgBase: '/assets/images/cbo.avif',
  },
  {
    name: 'Oleh',
    position: 'CDO &\nProduct Design • UX',
    imgBase: '/assets/images/cdo.avif',
  },
];

const AboutUs: React.FC = () => {
  const containerRef = useRef<HTMLDivElement | null>(null);

  const displacementMapRef = useRef<SVGFEDisplacementMapElement | null>(null);
  const turbulenceRef = useRef<SVGFETurbulenceElement | null>(null);
  const imageNodeRef = useRef<SVGImageElement | null>(null);

  const [activeIndex, setActiveIndex] = useState(0);
  const [currentImageSrc, setCurrentImageSrc] = useState(teamMembers[0].imgBase);

  const lowerSquareTimeoutRef = useRef<null | number>(null);
  const upperSquareTimeoutRef = useRef<null | number>(null);

  const { ref: lowerSquareRef, replay: lowerSquareReplay } = useRotator({
    angle: 90,
    direction: 'right',
    duration: 200,
    onAnimationEnd: () => runWithTimeout(lowerSquareTimeoutRef, lowerSquareReplay, randomBetween(3_500, 7_000)),
  });

  const { ref: upperSquareRef, replay: upperSquareReplay } = useRotator({
    angle: 180,
    direction: 'left',
    duration: 400,
    onAnimationEnd: () => runWithTimeout(upperSquareTimeoutRef, upperSquareReplay, randomBetween(2_200, 5_800)),
  });

  useEffect(() => {
    runWithTimeout(lowerSquareTimeoutRef, lowerSquareReplay);
    runWithTimeout(upperSquareTimeoutRef, upperSquareReplay);
    return () => {
      if (lowerSquareTimeoutRef.current) clearTimeout(lowerSquareTimeoutRef.current);
      if (upperSquareTimeoutRef.current) clearTimeout(upperSquareTimeoutRef.current);
    };
  }, []);

  const { contextSafe } = useGSAP({ scope: containerRef });

  const goToNextSlide = contextSafe(() => {
    const nextIndex = (activeIndex + 1) % teamMembers.length;
    const nextImgSrc = teamMembers[nextIndex].imgBase;

    if (!displacementMapRef.current || !turbulenceRef.current || !imageNodeRef.current) return;

    const tl = gsap.timeline();

    // 1. Change seed for noise uniqueness
    tl.set(turbulenceRef.current, { attr: { seed: randomBetween(1, 100) } });

    // 2. Distortion Animation (Input)
    tl.to(displacementMapRef.current, {
      attr: { scale: 150 },
      duration: 0.25,
      ease: 'power2.in',
      onComplete: () => {
        // 3. At the peak of distortion, change the image and text
        setActiveIndex(nextIndex);
        setCurrentImageSrc(nextImgSrc);
      },
    })
      // 4. Distortion Animation (Exit)
      .to(displacementMapRef.current, {
        attr: { scale: 0 },
        duration: 0.4,
        ease: 'power2.out',
      });
  });

  useEffect(() => {
    const timer = setInterval(goToNextSlide, 4_500);
    return () => clearInterval(timer);
  }, [goToNextSlide, activeIndex]);

  return (
    <div className="about-us" ref={containerRef}>
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
          <p className="about-us__team-mbr-name">{teamMembers[activeIndex].name}</p>
          <p className="about-us__team-mbr-position">
            {teamMembers[activeIndex].position.split('\n').map((line, x) => (
              <React.Fragment key={x}>
                {line}
                {x < 1 && <br />}
              </React.Fragment>
            ))}
          </p>
        </div>
        <div className="about-us__team-image-wrapper">
          <svg className="about-us__team-image-viewer" width="100%" height="100%">
            <defs>
              <filter
                id="noise-filter"
                x="-20%"
                y="-20%"
                width="140%"
                height="140%"
                filterUnits="objectBoundingBox"
                primitiveUnits="userSpaceOnUse"
                colorInterpolationFilters="sRGB"
              >
                <feTurbulence
                  ref={turbulenceRef}
                  type="fractalNoise"
                  baseFrequency="0.5"
                  numOctaves="1"
                  result="noise"
                />
                <feDisplacementMap
                  ref={displacementMapRef}
                  in="SourceGraphic"
                  in2="noise"
                  scale="0"
                  xChannelSelector="R"
                  yChannelSelector="G"
                />
              </filter>
            </defs>
            <image
              ref={imageNodeRef}
              href={currentImageSrc}
              x="0"
              y="0"
              width="100%"
              height="100%"
              preserveAspectRatio="xMidYMid slice"
              filter="url(#noise-filter)"
            />
          </svg>
        </div>
      </div>
      <p className="about-us__decorative-text--static">[../]</p>
    </div>
  );
};

export default AboutUs;
