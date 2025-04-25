import React, { useEffect, useRef } from "react"

import { DeviceType, useBreakpoints, useDeviceType } from "../../hooks/useBreakpoints"

/**
 * Define the props for the `AnimateLines` component.
 */
interface IAnimateLinesProps {
  /**
   * @property {number} [redrawInterval = 5_000] redrawInterval The interval (in milliseconds) for
   * updating the lines. This determines how often the lines will be redrawn or updated. It is used
   * to control the animation speed and smoothness.
   * A lower value will result in a faster animation, while a higher value will slow it down.
   */
  redrawInterval: number
}

type Point = {
  x: number
  y: number
  animatedX: number
  animatedY: number
}

/**
 * The `AnimateLines` component creates a canvas animation that draws lines between points in a
 * circular pattern. The lines are animated using linear interpolation (lerp) to create smooth
 * transitions. The component also handles window resizing to ensure the canvas fits the screen.
 * It uses the `requestAnimationFrame` API for efficient rendering and updates the points
 * periodically to create a dynamic effect.
 * This component animates lines in a circular pattern on a canvas.
 * It uses linear interpolation to create smooth transitions between points.
 * The animation is responsive to window resizing and updates the points periodically.
 *
 * @component
 * @param {number} [redrawInterval = 5_000] The interval (in milliseconds) for updating the
 * lines. This determines how often the lines will be redrawn or updated. It is used to control the
 * animation speed and smoothness. A lower value will result in a faster animation, while a higher
 * value will slow it down.
 *
 * @example
 * ```tsx
 * <div>
 *   <AnimateLines redrawInterval={3_000} />
 * </div>
 * ```
 *
 * @returns {JSX.Element} Returns a canvas element that displays the animated lines.
 */
const AnimateLines: React.FC<IAnimateLinesProps> = ({ redrawInterval = 5_000 }) => {
  /**
   * Create a new generation of points for the animation. This function generates a new
   * set of points based on random angles and a specified radius. It is used to create
   * dynamic and visually appealing animations.
   *
   * @function
   * @param { points } The array of points to be updated.
   * @returns {void}
   */
  const createGenerationOfPoints = (points: Point[]) => {
    // Generate new points based on random angles
    const phaseShifts = [0, 0, 0, 0].map(() => Math.random() * 360)

    const { xFactor, yFactor, radiusFactor } = figureFactors[deviceType || "smartphone"]

    // Set the center
    const centerX = window.innerWidth / xFactor
    const centerY = window.innerHeight / yFactor
    // ... and radius
    const maxRadius = Math.min(window.innerWidth, window.innerHeight) * 0.48
    const radius = Math.min(maxRadius, window.innerWidth * radiusFactor)

    for (let i = 0; i < points.length; i += 2) {
      const angles = phaseShifts.map(shift => ((i + shift) * Math.PI) / 180)
      // Calculate the angles for the points
      const [
        angleA,
        angleB,
        angleC,
        angleD
      ] = angles // prettier-ignore

      points[i].x = centerX + radius * Math.sin(angleA)
      points[i].y = centerY + radius * Math.cos(angleB)
      points[i + 1].x = centerX + radius * Math.sin(angleC)
      points[i + 1].y = centerY + radius * Math.cos(angleD)
    }
  }

  /**
   * Draw the lines on the canvas. This function is responsible for rendering the lines
   * on the canvas using the provided context. It uses linear interpolation to create
   * smooth transitions between points.
   *
   * @function
   * @param { ctx } The canvas rendering context.
   * @param { dpr } The device pixel ratio.
   * @returns {void}
   */
  const draw = (ctx: CanvasRenderingContext2D, dpr: number) => {
    const smooth = 0.06
    const stagger = 0.0005
    const points = pointsRef.current

    ctx.fillStyle = "#030f0f"
    ctx.fillRect(0, 0, window.innerWidth * dpr, window.innerHeight * dpr)

    for (let i = 0; i < points.length; i += 2) {
      const pBegin = points[i]
      const pEnd = points[i + 1]

      pBegin.animatedX = lerp(pBegin.animatedX, pBegin.x, smooth + i * stagger)
      pBegin.animatedY = lerp(pBegin.animatedY, pBegin.y, smooth + i * stagger)
      pEnd.animatedX = lerp(pEnd.animatedX, pEnd.x, smooth + i * stagger)
      pEnd.animatedY = lerp(pEnd.animatedY, pEnd.y, smooth + i * stagger)

      const x = lerp(pBegin.animatedX, pEnd.animatedX, 0.3)
      const y = lerp(pBegin.animatedY, pEnd.animatedY, 0.7)

      ctx.beginPath()
      ctx.strokeStyle = `rgba(23, 59, 41, ${Math.min(1, i * 0.004)})`
      ctx.moveTo(pBegin.animatedX, pBegin.animatedY)
      ctx.bezierCurveTo(y, x, x, y, pEnd.animatedX, pEnd.animatedY)
      ctx.stroke()
    }
  }

  /**
   * Lerp function for smooth transitions between two values. This function linearly
   * interpolates between two values based on a given amount. It is commonly used for
   * smooth transitions in animations.
   *
   * @function
   * @param { start } The starting value.
   * @param { end } The ending value.
   * @param { amt } The amount to interpolate (0 to 1).
   * @returns The interpolated value.
   */
  const lerp = (start: number, end: number, amt: number): number => {
    return start + (end - start) * amt
  }

  /** @references */
  /**
   * Reference to the animation frame ID. This reference is used to cancel the animation
   * when the component unmounts or when the animation needs to be stopped.
   *
   * @type {React.RefObject<number>} animationRef - A reference to the animation frame ID.
   */
  const animationRef = useRef<number>()
  /**
   * Reference to the canvas element. This reference is used to access the canvas
   * properties and methods for rendering the animation.
   *
   * @type {React.RefObject<HTMLCanvasElement>} canvasRef - A reference to the canvas element.
   */
  const canvasRef = useRef<HTMLCanvasElement>(null)
  /**
   * Reference to the array of points used in the animation. This reference is used to store
   * the points that are animated on the canvas. It allows for efficient updates and rendering
   * of the points during the animation loop.
   *
   * @type {React.RefObject<Point[]>} pointsRef - A reference to the array of points.
   */
  const pointsRef = useRef<Point[]>([])

  /**
   * Get the breakpoints and device type. This hook is used to determine the current
   * screen size and device type based on the predefined breakpoints. It allows for
   * responsive design and adapts the animation based on the device type.
   *
   * @type {BreakpointHook} bp - The breakpoints and device type.
   */
  const bp = useBreakpoints()
  const deviceType = useDeviceType(bp)

  /**
   * Define the figure factors for different device types. This object contains the
   * multipliers for the X and Y positions, as well as the radius factor for each
   * device type. It is used to create a responsive design that adapts to different
   * screen sizes.
   *
   * @type {
   *    Record<DeviceType,
   *    { xFactor: number; yFactor: number; radiusFactor: number }>
   * } figureFactors - The figure factors for different device types.
   */
  /* prettier-ignore */
  const figureFactors: Record<DeviceType, { xFactor: number; yFactor: number; radiusFactor: number }> = {
    smartphone:   { xFactor: 2.10, yFactor: 2.10, radiusFactor: 0.45 },
    smallDevice:  { xFactor: 2.10, yFactor: 2.20, radiusFactor: 0.40 },
    tablet:       { xFactor: 2.05, yFactor: 2.30, radiusFactor: 0.35 },
    laptop:       { xFactor: 2.05, yFactor: 2.35, radiusFactor: 0.25 },
    pC:           { xFactor: 2.00, yFactor: 2.50, radiusFactor: 0.15 },
    largeDevice:  { xFactor: 2.00, yFactor: 2.65, radiusFactor: 0.10 },
  }

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")!
    const dpr = window.devicePixelRatio || 1

    // Set canvas size
    canvas.width = window.innerWidth * dpr
    canvas.height = window.innerHeight * dpr
    // Set canvas CSS size
    canvas.style.width = window.innerWidth + "px"
    canvas.style.height = window.innerHeight + "px"

    ctx.scale(dpr, dpr)

    const { xFactor, yFactor, radiusFactor } = figureFactors[deviceType || "smartphone"]

    // Centering the canvas
    const centerX = window.innerWidth / xFactor
    const centerY = window.innerHeight / yFactor
    // Set the center and radius
    const maxRadius = Math.min(window.innerWidth, window.innerHeight) * 0.48
    const radius = Math.min(maxRadius, window.innerWidth * radiusFactor)

    const points: Point[] = []
    for (let i = 0; i < 180; i += 2) {
      // Calculate the angles for the points
      const angleA = (i * Math.PI) / 180
      const angleB = ((i + 45) * Math.PI) / 180
      // Calculate the points based on angles
      const pBeginX = centerX + radius * Math.sin(angleA)
      const pBeginY = centerY + radius * Math.cos(angleB)
      const pEndX = centerX + radius * Math.sin(angleB)
      const pEndY = centerY + radius * Math.cos(angleA)

      points.push(
        {
          // prettier-ignore
          x: pBeginX,
          y: pBeginY,
          animatedX: pBeginX,
          animatedY: pBeginY,
        },
        {
          // prettier-ignore
          x: pEndX,
          y: pEndY,
          animatedX: pEndX,
          animatedY: pEndY,
        }
      )
    }

    pointsRef.current = points

    const drawLoop = (time: number) => {
      // Call the drawing
      draw(ctx, dpr)
      // Auto-generate new points every `redrawInterval` milliseconds
      if (time % redrawInterval < 100) {
        createGenerationOfPoints(pointsRef.current)
      }
      animationRef.current = requestAnimationFrame(drawLoop)
    }
    // Start the animation loop
    drawLoop(0)
    // Handler for window resize
    window.addEventListener("resize", () => location.reload())

    return () => {
      animationRef.current && cancelAnimationFrame(animationRef.current)
      window.removeEventListener("resize", () => location.reload())
    }
  }, [])

  return <canvas ref={canvasRef} />
}

export default AnimateLines
