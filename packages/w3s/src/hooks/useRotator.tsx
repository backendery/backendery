import { useEffect, useRef, useState } from "react"

/**
 * Type definition for rotation direction. Can be either "left" for counterclockwise or "right" for
 * clockwise.
 */
type RotateDirection = "left" | "right"

/**
 * Type definition for the `useRotator` hook's props.
 */
type UseRotatorProps = {
  /**
   * @property {number} [angle = 45] An optional angle of rotation in degrees.
   */
  angle?: number

  /**
   * @property {RotateDirection} [direction = "right"] An optional direction of the rotation.
   */
  direction?: RotateDirection

  /**
   * @property {number} [duration = 800] An optional duration of the rotation animation in
   * milliseconds.
   */
  duration?: number

  /**
   * @property {boolean} [randomizeRotation = false] An optional flag to randomize both angle and
   * direction of rotation.
   */
  randomizeRotation?: boolean

  /**
   * @property {Function} [onAnimationStart = null] An optional callback when animation starts
   * rendering.
   */
  onAnimationStart?: () => void

  /**
   * @property {Function} [onAnimationEnd = null] An optional callback for when the animation
   * finished.
   */
  onAnimationEnd?: () => void
}

/**
 * `useRotator` hook that manages the rotation animation of an element. The hook accepts optional
 * properties for customizing the angle, direction, duration, and more. It can trigger callbacks
 * when the animation starts or ends and can randomize rotation if needed.
 *
 * @typedef {Object} UseRotatorProps
 * @property {number} [angle = 45] The angle of rotation in degrees.
 * @property {RotateDirection} [direction = "right"] The direction of rotation, either "left" or
 * "right".
 * @property {number} [duration = 800] The duration of the rotation animation in milliseconds.
 * @property {boolean} [randomizeRotation = false] Flag to randomize the rotation angle and
 * direction.
 * @property {Function} [onAnimationStart = () => void] A callback function executed when the
 * animation starts.
 * @property {Function} [onAnimationEnd = () => void] A callback function executed when the
 * animation ends.
 *
 * @example
 * ```tsx
 * const { ref, replay } = useRotator({ angle: 90, direction: "left" });
 *
 * <div>
 *   <div ref={ref} onClick={replay}>Rotating Element</div>
 * </div>
 * ```
 *
 * @returns {Object} An object containing:
 *   - `ref`: A reference to the DOM element that will be rotated.
 *   - `replay`: A function to trigger the rotation animation manually.
 */
export const useRotator = (props: UseRotatorProps) => {
  const {
    angle = 45,
    direction = "right",
    duration = 800,
    randomizeRotation = false,
    onAnimationStart,
    onAnimationEnd,
  } = props

  /**
   * Initiates the rotation animation. This function starts the requestAnimationFrame loop and
   * triggers the `onAnimationStart` callback if provided.
   *
   * @function
   */
  const play = () => {
    // Exit if the node is not defined or if animation is already in progress
    if (!nodeRef.current || isAnimatingRef.current) return

    // Set the animation flag to true and call the start callback
    isAnimatingRef.current = true
    onAnimationStart && onAnimationStart()

    // Determine the angle and direction for the rotation
    const [updatedAngle, updatedDirection] = randomizeRotation
      ? [Math.floor(Math.random() * 4) * 90, Math.random() > 0.5 ? "left" : "right"]
      : [angle, direction]

    // Calculate the rotation value based on direction
    const rotateValue = updatedDirection === "left" ? -updatedAngle : updatedAngle

    // Calculate the new angle by adding the current angle to the new rotation value
    const newAngle = currentAngle + rotateValue

    const startTime = performance.now()

    /**
     * Handles the rotation animation frame-by-frame. This function calculates the progress of the
     * animation based on the elapsed time and updates the element's rotation accordingly. Once the
     * animation is complete, it stops the loop and triggers the `onAnimationEnd` callback if
     * provided.
     *
     * @function
     * @param {number} time The current timestamp provided by `requestAnimationFrame`.
     */
    const animate = (time: number) => {
      // Calculate the elapsed time
      const elapsed = time - startTime
      // Normalize the progress of the animation (0 - 1)
      const progress = Math.min(elapsed / duration, 1)
      // Calculate the current rotation based on the progress
      const currentRotation = currentAngle + rotateValue * progress

      // Apply the current rotation to the element
      if (nodeRef.current) {
        nodeRef.current.style.transform = `rotate(${currentRotation}deg)`
      }

      // If the animation is not complete, request the next frame
      if (progress < 1.0) {
        rafRef.current = requestAnimationFrame(animate)
      } else {
        // Animation completed, reset the animating flag and call the end callback
        isAnimatingRef.current = false

        // Normalize angle to keep it within 0-360 range
        setCurrentAngle(newAngle % 360)

        onAnimationEnd && onAnimationEnd()
      }
    }

    // Run the animation
    rafRef.current = requestAnimationFrame(animate)
  }

  /** @states */
  /**
   * State that holds the current rotation angle of the element. This state is dynamically updated
   * during the animation process to reflect the current angle in degrees.
   *
   * @type {number} currentAngle - The current angle of rotation.
   * @function setCurrentAngle - A function to update the `currentAngle` state.
   */
  const [currentAngle, setCurrentAngle] = useState<number>(0) // Current angle storage

  /** @references */
  /**
   * A reference that tracks whether the animation is currently running. This ensures control over
   * the animation state and helps prevent multiple animations from starting simultaneously.
   *
   * @type {React.RefObject<boolean>} isAnimatingRef - A ref object indicating if the animation is
   * active.
   */
  const isAnimatingRef = useRef<boolean>(false)
  /**
   * A reference to the DOM element that will receive the rotation effect. This ref is essential for
   * directly applying transformations and interacting with the element during animations.
   *
   * @type {React.RefObject<HTMLDivElement | null>} nodeRef - A ref object pointing to the rotatable
   * DOM element.
   */
  const nodeRef = useRef<HTMLDivElement | null>(null)
  /**
   * A reference to the current requestAnimationFrame identifier. This allows for the animation
   * frame to be canceled if needed, ensuring proper cleanup and control over the animation
   * lifecycle.
   *
   * @type {React.RefObject<number | null>} rafRef - A ref object holding the current animation
   * frame ID.
   */
  const rafRef = useRef<number | null>(null)

  useEffect(() => {
    // Start animation when the component mounts
    play()

    return () => {
      // Clean up on component unmount
      if (rafRef.current) {
        // Cancel any ongoing animation frame
        cancelAnimationFrame(rafRef.current)
      }
      // Reset animation flag
      isAnimatingRef.current = false
    }
  }, [])

  // Return the ref to the element and the replay function for external use
  return { ref: nodeRef, replay: play }
}
