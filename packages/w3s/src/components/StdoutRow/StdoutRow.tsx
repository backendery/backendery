import React, { FC, useEffect, useMemo, useRef, useState } from "react"

import "./StdoutRow.scss"

/**
 * Define the props for the `StdoutRow` component.
 */
interface IStdoutRowProps {
  /**
   * @property { string } The main text string to be displayed.
   */
  text: string

  /**
   * @property {string} [filler = "."] An optional string used as the filler character.
   */
  filler?: string

  /**
   * @property {number} [fillerWidth = 8] An optional number of pixels per filler character.
   */
  fillerWidth?: number

  /**
   * @property {React.CSSProperties} [style = {}] An optional inline styles to be applied to the
   * grid container, allowing customization of grid appearance.
   */
  style?: React.CSSProperties
}

/**
 * The `StdoutRow` component displays a single string with dynamically calculated filler characters
 * based on the width of the container. It recalculates the number of fillers when the container
 * size changes (using the `ResizeObserver` API) or when the content changes.
 *
 * @component
 * @param {string} text The primary text string to be displayed.
 * @param {string} [filler = "."] An optional filler character (or string) used to fill the space.
 * @param {number} [fillerWidth = 8] An optional number that specifies how many pixels each filler
 * char takes up.
 * @param {React.CSSProperties} [style = {}] An optional inline CSS styles to apply to the element.
 * This allows for customizing visual properties such as font size, color, or spacing.
 *
 * @example
 * ```tsx
 * <div>
 *   <StdoutRow text="Continuous learning" filler="-" fillerWidth={6} />
 * </div>
 * ```
 *
 * @returns {JSX.Element} Returns JSX markup for displaying the text with dynamically calculated
 * filler characters.
 */
const StdoutRow: FC<IStdoutRowProps> = React.memo(({ text, filler = ".", fillerWidth = 8, style = {} }) => {
  /**
   * Calculate the number of filler characters based on the container's width.
   *
   * @function
   * @param {number} elementWidth The width of the container in pixels.
   * @returns {number} Number of filler characters that fit in the container.
   */
  const calculateFillerCount = (elementWidth: number): number => {
    // Number of fillers that fit within the container width
    return Math.floor(elementWidth / fillerWidth)
  }

  /**
   * Handles resizing of the container and recalculates the number of filler characters based on the
   * new width of the container.
   *
   * @function
   */
  const handleResizeViewport = () => {
    if (containerRef.current) {
      // Get the container width
      const width = containerRef.current.offsetWidth
      // Calculate the new number of fillers
      const calculatedFillerCount = calculateFillerCount(width)
      // Update state with the new filler count
      setFillerCount(calculatedFillerCount)
    }
  }

  /** @states */
  /**
   * State that stores the dynamically calculated number of filler characters based on the width of
   * the container. The `fillerCount` is updated whenever the container is resized, ensuring that
   * the filler characters fit the available space.
   *
   * @type {number} fillerCount - An integer representing the count of filler characters.
   * @function setFillerCount - A function to update the `fillerCount` state with a new value.
   */
  const [fillerCount, setFillerCount] = useState<number>(0)

  /** @references */
  /**
   * Reference to the container element, allowing direct access to its properties. Primarily used to
   * measure the container's width and observe its size changes with the `ResizeObserver` API, which
   * triggers recalculation of `fillerCount`.
   *
   * @type {React.RefObject<HTMLDivElement>} containerRef - A reference to the container element.
   */
  const containerRef = useRef<HTMLDivElement | null>(null)

  /** @memos */
  /**
   * Memoized filler string that repeats the specified filler character based on the current
   * `fillerCount`. This memoization optimizes performance by recalculating the filler string only
   * when `fillerCount` or `filler` changes, avoiding unnecessary re-renders when these values
   * remain the same.
   *
   * @type {string} memoizedFiller - A string composed of repeated filler characters.
   */
  const memoizedFiller = useMemo(() => filler.repeat(fillerCount), [fillerCount, filler])

  useEffect(() => {
    // Using the ResizeObserver API to watch for container size changes
    // Observe changes in container size
    const resizeObserver = new ResizeObserver(handleResizeViewport)
    if (containerRef.current) {
      resizeObserver.observe(containerRef.current)
    }

    // Initial calculation on component mount
    handleResizeViewport()

    // Clean up the observer on component unmount
    return () => resizeObserver.disconnect()
  }, [text, fillerWidth])

  return (
    <div className={"stdout-row"} style={{ ...style }}>
      <p>{text}</p>
      <div className={"stdout-row__filler-wrapper"} ref={containerRef}>
        <p className={"stdout-row__filler"}>{memoizedFiller}</p>
      </div>
      <p>
        {"[ "}
        <span className={"stdout-row__status--success"}>{"ok"}</span>
        {" ]"}
      </p>
    </div>
  )
})

export default StdoutRow
