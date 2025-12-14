import { useEffect, useRef } from 'react';

import { type DeviceType, useBreakpoints, useDeviceType } from '~/hooks/useBreakpoints';

/**
 * Define the props for the `AnimateLines` component.
 */
type AnimateLinesProps = {
  /**
   * @property {number} [redrawInterval = 5_000] redrawInterval The interval (in milliseconds) for
   * updating the lines. This determines how often the lines will be redrawn or updated. It is used
   * to control the animation speed and smoothness.
   * A lower value will result in a faster animation, while a higher value will slow it down.
   */
  readonly redrawInterval: number;
};

type Point = {
  animatedX: number;
  animatedY: number;
  x: number;
  y: number;
};

/**
 * The `AnimateLines` component creates a canvas animation that draws lines between points in a
 * circular pattern. The lines are animated using linear interpolation (lerp) to create smooth
 * transitions. The component also handles window resizing to ensure the canvas fits the screen.
 * It uses the `requestAnimationFrame` API for efficient rendering and updates the points
 * periodically to create a dynamic effect.
 * This component animates lines in a circular pattern on a canvas.
 * It uses linear interpolation to create smooth transitions between points.
 * The animation is responsive to window resizing and updates the points periodically.
 * @component
 * @param {number} [redrawInterval] The interval (in milliseconds) for updating the
 * lines. This determines how often the lines will be redrawn or updated. It is used to control the
 * animation speed and smoothness. A lower value will result in a faster animation, while a higher
 * value will slow it down.
 * @example
 * ```tsx
 * <div>
 *   <AnimateLines redrawInterval={3_000} />
 * </div>
 * ```
 * @returns {JSX.Element} Returns a canvas element that displays the animated lines.
 */
const AnimateLines: React.FC<AnimateLinesProps> = ({ redrawInterval = 5_000 }) => {
  /**
   * Create a new generation of points for the animation. This function generates a new
   * set of points based on random angles and a specified radius. It is used to create
   * dynamic and visually appealing animations.
   * @function
   * @param { points } The array of points to be updated.
   * @returns {void}
   */
  const createGenerationOfPoints = (points: Point[]) => {
    // Generate new points based on random angles
    const phaseShifts = [0, 0, 0, 0].map(() => Math.random() * 360);

    const { radiusFactor, xFactor, yFactor } = figureFactors[deviceType || 'smartphone'];

    // Set the center
    const centerX = window.innerWidth / xFactor;
    const centerY = window.innerHeight / yFactor;
    // ... and radius
    const maxRadius = Math.min(window.innerWidth, window.innerHeight) * 0.48;
    const radius = Math.min(maxRadius, window.innerWidth * radiusFactor);

    for (let index = 0; index < points.length; index += 2) {
      const angles = phaseShifts.map((shift) => ((index + shift) * Math.PI) / 180);
      // Calculate the angles for the points
      const [
        angleA,
        angleB,
        angleC,
        angleD
      ] = angles; // prettier-ignore

      points[index].x = centerX + radius * Math.sin(angleA);
      points[index].y = centerY + radius * Math.cos(angleB);
      points[index + 1].x = centerX + radius * Math.sin(angleC);
      points[index + 1].y = centerY + radius * Math.cos(angleD);
    }
  };

  /**
   * Draw the lines on the canvas. This function is responsible for rendering the lines
   * on the canvas using the provided context. It uses linear interpolation to create
   * smooth transitions between points.
   * @function
   * @param { ctx } The canvas rendering context.
   * @param { dpr } The device pixel ratio.
   * @returns {void}
   */
  const draw = (context: CanvasRenderingContext2D, dpr: number) => {
    const smooth = 0.06;
    const stagger = 0.000_5;
    const points = pointsRef.current;

    context.fillStyle = '#030f0f';
    context.fillRect(0, 0, window.innerWidth * dpr, window.innerHeight * dpr);

    for (let index = 0; index < points.length; index += 2) {
      const pBegin = points[index];
      const pEnd = points[index + 1];

      pBegin.animatedX = lerp(pBegin.animatedX, pBegin.x, smooth + index * stagger);
      pBegin.animatedY = lerp(pBegin.animatedY, pBegin.y, smooth + index * stagger);
      pEnd.animatedX = lerp(pEnd.animatedX, pEnd.x, smooth + index * stagger);
      pEnd.animatedY = lerp(pEnd.animatedY, pEnd.y, smooth + index * stagger);

      const x = lerp(pBegin.animatedX, pEnd.animatedX, 0.3);
      const y = lerp(pBegin.animatedY, pEnd.animatedY, 0.7);

      context.beginPath();
      context.strokeStyle = `rgba(23, 59, 41, ${Math.min(1, index * 0.004)})`;
      context.moveTo(pBegin.animatedX, pBegin.animatedY);
      context.bezierCurveTo(y, x, x, y, pEnd.animatedX, pEnd.animatedY);
      context.stroke();
    }
  };

  /**
   * Lerp function for smooth transitions between two values. This function linearly
   * interpolates between two values based on a given amount. It is commonly used for
   * smooth transitions in animations.
   * @function
   * @param { start } The starting value.
   * @param { end } The ending value.
   * @param { amt } The amount to interpolate (0 to 1).
   * @returns The interpolated value.
   */
  const lerp = (start: number, end: number, amt: number): number => {
    return start + (end - start) * amt;
  };

  /**
   * @references
   */
  /**
   * Reference to the animation frame ID. This reference is used to cancel the animation
   * when the component unmounts or when the animation needs to be stopped.
   * @type {React.RefObject<number>} animationRef - A reference to the animation frame ID.
   */
  const animationRef = useRef<number>(0);
  /**
   * Reference to the canvas element. This reference is used to access the canvas
   * properties and methods for rendering the animation.
   * @type {React.RefObject<HTMLCanvasElement>} canvasRef - A reference to the canvas element.
   */
  const canvasRef = useRef<HTMLCanvasElement>(null);
  /**
   * Reference to the array of points used in the animation. This reference is used to store
   * the points that are animated on the canvas. It allows for efficient updates and rendering
   * of the points during the animation loop.
   * @type {React.RefObject<Point[]>} pointsRef - A reference to the array of points.
   */
  const pointsRef = useRef<Point[]>([]);

  /**
   * Get the breakpoints and device type. This hook is used to determine the current
   * screen size and device type based on the predefined breakpoints. It allows for
   * responsive design and adapts the animation based on the device type.
   * @type {BreakpointHook} bp - The breakpoints and device type.
   */
  const bp = useBreakpoints();
  const deviceType = useDeviceType(bp);

  /**
   * Define the figure factors for different device types. This object contains the
   * multipliers for the X and Y positions, as well as the radius factor for each
   * device type. It is used to create a responsive design that adapts to different
   * screen sizes.
   * @type {
   *    Record<DeviceType,
   *    { xFactor: number; yFactor: number; radiusFactor: number }>
   * } figureFactors - The figure factors for different device types.
   */
  /* prettier-ignore */
  const figureFactors: Record<DeviceType, { radiusFactor: number; xFactor: number; yFactor: number; }> = {
    laptop: { radiusFactor: 0.25, xFactor: 2.05, yFactor: 2.35 },
    largeDevice: { radiusFactor: 0.1, xFactor: 2, yFactor: 2.65 },
    pC: { radiusFactor: 0.15, xFactor: 2, yFactor: 2.5 },
    smallDevice: { radiusFactor: 0.4, xFactor: 2.1, yFactor: 2.2 },
    smartphone: { radiusFactor: 0.45, xFactor: 2.1, yFactor: 2.1 },
    tablet: { radiusFactor: 0.35, xFactor: 2.05, yFactor: 2.3 },
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) {
      return;
    }

    const context = canvas.getContext('2d')!;
    const dpr = window.devicePixelRatio || 1;

    // Set canvas size
    canvas.width = window.innerWidth * dpr;
    canvas.height = window.innerHeight * dpr;
    // Set canvas CSS size
    canvas.style.width = window.innerWidth + 'px';
    canvas.style.height = window.innerHeight + 'px';

    context.scale(dpr, dpr);

    const { radiusFactor, xFactor, yFactor } = figureFactors[deviceType || 'smartphone'];

    // Centering the canvas
    const centerX = window.innerWidth / xFactor;
    const centerY = window.innerHeight / yFactor;
    // Set the center and radius
    const maxRadius = Math.min(window.innerWidth, window.innerHeight) * 0.48;
    const radius = Math.min(maxRadius, window.innerWidth * radiusFactor);

    const points: Point[] = [];
    for (let index = 0; index < 180; index += 2) {
      // Calculate the angles for the points
      const angleA = (index * Math.PI) / 180;
      const angleB = ((index + 45) * Math.PI) / 180;
      // Calculate the points based on angles
      const pBeginX = centerX + radius * Math.sin(angleA);
      const pBeginY = centerY + radius * Math.cos(angleB);
      const pEndX = centerX + radius * Math.sin(angleB);
      const pEndY = centerY + radius * Math.cos(angleA);

      points.push(
        {
          animatedX: pBeginX,
          animatedY: pBeginY,
          // prettier-ignore
          x: pBeginX,
          y: pBeginY,
        },
        {
          animatedX: pEndX,
          animatedY: pEndY,
          // prettier-ignore
          x: pEndX,
          y: pEndY,
        },
      );
    }

    pointsRef.current = points;

    const drawLoop = (time: number) => {
      // Call the drawing
      draw(context, dpr);
      // Auto-generate new points every `redrawInterval` milliseconds
      if (time % redrawInterval < 100) {
        createGenerationOfPoints(pointsRef.current);
      }

      animationRef.current = requestAnimationFrame(drawLoop);
    };

    // Start the animation loop
    drawLoop(0);
    // Handler for window resize
    window.addEventListener('resize', () => location.reload());

    return () => {
      animationRef.current && cancelAnimationFrame(animationRef.current);
      window.removeEventListener('resize', () => location.reload());
    };
  }, []);

  return <canvas ref={canvasRef} />;
};

export default AnimateLines;
