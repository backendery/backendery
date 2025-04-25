import React, { FC, memo, useEffect, useRef, useState } from "react"

import { randomBetween } from "../../utils/fn"

import "./AnimateRadixGrid.scss"

/**
 * Define the props for the `AnimateRadixGrid` component.
 */
interface IAnimateRadixGridProps {
  /**
   * @property {string[]} An array of symbols to be displayed in the grid cells. Each cell will
   * randomly display one of these symbols, and they can be updated over time.
   */
  symbols: string[]

  /**
   * @property {number} The number of rows in the grid. This defines the vertical size of the grid.
   */
  rows: number

  /**
   * @property {number} The number of columns in the grid. This defines the horizontal size of the
   * grid.
   */
  cols: number

  /**
   * @property {number} The minimum interval (in milliseconds) for updating a random cell in the
   * grid. This interval defines how fast the grid will refresh.
   */
  minInterval: number

  /**
   * @property {number} The maximum interval (in milliseconds) for updating a random cell in the
   * grid. The actual update interval will be randomly chosen between `minInterval` and
   * `maxInterval`.
   */
  maxInterval: number

  /**
   * @property {Array<[number, number]>} [unreachableCells = []] An optional array of tuples
   * representing the coordinates (row, column) of cells that should not be updated. These cells
   * will be considered unreachable and will not change their symbols during the animation.
   */
  unreachableCells?: Array<[number, number]>

  /**
   * @property {React.CSSProperties} [style = {}] An optional inline styles to be applied to the
   * grid container, allowing customization of grid appearance.
   */
  style?: React.CSSProperties
}

/**
 * Define the props for the `AnimateRadixCell` component.
 */
interface IAnimateRadixCellProps {
  /**
   * @property {string} The symbol to display inside the grid cell. This is typically one of the
   * symbols from the parent `AnimateRadixGrid` component's symbols array.
   */
  symbol: string

  /**
   * @property {boolean} A flag indicating whether the cell is unreachable. If true, a special CSS
   * class `unreachable` is applied to the cell, and no symbol is displayed.
   */
  isUnreachable: boolean
}

/**
 * `AnimateRadixGrid` component that displays a grid of animated cells. Each cell in the grid shows
 * a symbol randomly selected from a given set, and updates are applied at randomized intervals.
 * Certain cells may be marked as "unreachable," meaning they won't update during the animation
 * process.
 *
 * @component
 * @param {string[]} symbols Array of symbols to display in the grid cells. Each cell randomly
 * displays a symbol from this array, updating over time based on the specified intervals.
 * @param {number} rows Number of rows in the grid, defining its vertical dimension.
 * @param {number} cols Number of columns in the grid, defining its horizontal dimension.
 * @param {number} minInterval Minimum interval (in milliseconds) for updating a random cell,
 * setting the fastest refresh rate.
 * @param {number} maxInterval Maximum interval (in milliseconds) for updating a random cell. A
 * random interval is chosen between `minInterval` and `maxInterval` for each update.
 * @param {Array<[number, number]>} [unreachableCells=[]] An optional array of cell coordinates (as
 * tuples of row and column) that won't update. Cells in this list are "unreachable" and do not
 * participate in animations.
 * @param {React.CSSProperties} [style={}] An optional inline styles for the grid container,
 * allowing customization of the grid's appearance (e.g., size, colors).
 *
 * @example
 * ```tsx
 * <AnimateRadixGrid
 *   symbols={["@", "#", "$"]}
 *   rows={5}
 *   cols={10}
 *   minInterval={1000}
 *   maxInterval={3000}
 *   unreachableCells={[[0, 1], [3, 4]]}
 *   style={{ border: "1px solid gray", fontSize: "18px" }}
 * />
 * ```
 *
 * @returns {JSX.Element} Renders a `<div>` element containing the animated grid.
 */
const AnimateRadixCell: FC<IAnimateRadixCellProps> = memo(({ symbol, isUnreachable }) => {
  // Each cell displays a symbol and applies a "unreachable" class if it is in a unreachable state
  return <div className={`animate-radix-grid__cell ${isUnreachable ? "unreachable" : ""}`}>{symbol}</div>
})

/**
 * `AnimateRadixGrid` is a React functional component that renders an animated grid of symbols. The
 * grid allows for randomly updating its cells with a set of provided symbols within a specified
 * interval. Certain cells can be marked as "unreachable," meaning they will not participate in the
 * update process.
 */
const AnimateRadixGrid: FC<IAnimateRadixGridProps> = props => {
  /**
   * Generates the initial array of cells for the grid, each populated with a randomly selected
   * symbol from the provided `symbols` prop. The function ensures that the grid is initialized with
   * the correct number of cells based on the `rows` and `cols` properties.
   *
   * @function
   * @returns {string[]} An array representing the initial state of cells in the grid.
   */
  const createInitialCells = () => {
    return Array.from(
      { length: props.rows * props.cols }, // Create an array of the total number of cells
      // Select a random symbol for each cell
      () => props.symbols[Math.floor(Math.random() * props.symbols.length)]
    )
  }

  /**
   * Updates a random cell in the grid with a new symbol, ensuring the cell is not marked as
   * unreachable. The function selects a random index, checks that it is not part of the
   * `unreachableSet`, and then updates the `cells` state with a new symbol.
   *
   * @function
   * @returns {void}
   */
  const updateRandomCell = () => {
    let randomIndex = -1

    // Find a random index that is not a unreachable cell
    do {
      randomIndex = Math.floor(Math.random() * cells.length) // Get a random index
    } while (unreachableSet.has(randomIndex)) // Ensure the index is not for an unreachable cell

    // Generate a new random symbol
    const newSymbol = generateRandomSymbol()

    // Update the state with the new symbol
    setCells(prevCells => {
      const newCells = [...prevCells]
      newCells[randomIndex] = newSymbol // Update the selected cell
      return newCells
    })
  }

  /**
   * Generates a new random symbol from the provided `symbols` prop.
   * This function picks a symbol at random without any restriction on reusing the current symbol,
   * allowing for possible repetition of symbols in the grid.
   *
   * @function
   * @returns {string} A randomly selected symbol from the `symbols` array.
   */
  const generateRandomSymbol = () => {
    return props.symbols[Math.floor(Math.random() * props.symbols.length)]
  }

  /** @states */
  /**
   * State that holds the current symbols in the grid. The `cells` state is initialized using the
   * `createInitialCells` function, which fills the grid based on the `rows` and `cols` props.
   *
   * @type {string[]} cells - An array representing the current state of symbols in the grid.
   * @function setCells - Function to update the `cells` state with new symbols or changes.
   */
  const [cells, setCells] = useState<string[]>(createInitialCells())
  /**
   * State that tracks the visibility status of the component. This state determines whether the
   * grid and its animations should be rendered or not.
   *
   * @type {boolean} isVisible - A boolean indicating if the component is currently visible.
   * @function setIsVisible - Function to update the `isVisible` state.
   */
  const [isVisible, setIsVisible] = useState<boolean>(false)

  /** @references */
  /**
   * A reference to the grid container element. This ref is used to directly access the DOM node
   * of the grid for operations that require direct interaction or measurement.
   *
   * @type {React.RefObject<HTMLDivElement | null>} gridRef - A ref object pointing to the grid
   * container element.
   */
  const gridRef = useRef<HTMLDivElement | null>(null)
  /**
   * A reference that stores the last recorded update time. This is primarily used to manage
   * and control the timing of animations or updates, ensuring consistency in animation intervals.
   *
   * @type {React.RefObject<number | null>} lastTimeRef - A ref object holding the last update time
   * value.
   */
  const lastTimeRef = useRef<number | null>(null)

  // Firstly, validate `unreachableCells` to ensure that they are within bounds of the grid
  props.unreachableCells?.forEach(([row, col]) => {
    if (row < 0 || row >= props.rows || col < 0 || col >= props.cols) {
      throw new Error(`unreachable cell (${row}, ${col}) is out of bounds`)
    }
  })

  // Set of unreachable cell indices
  const unreachableSet = new Set(props.unreachableCells?.map(([row, col]) => row * props.cols + col))

  useEffect(() => {
    // Intersection Observer to detect when the component is in view
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting)
      },
      { threshold: 0.1 } // Trigger when at least 10% of the component is visible
    )

    if (gridRef.current) {
      observer.observe(gridRef.current)
    }

    return () => {
      if (gridRef.current) {
        observer.unobserve(gridRef.current)
      }
    }
  }, [])

  useEffect(() => {
    if (!isVisible) return // Don't animate if the component is not visible

    // Animation loop that updates cells at random intervals
    const step = (currentTime: number) => {
      if (lastTimeRef.current === null) {
        lastTimeRef.current = currentTime // Initialize the last update time
      }

      // Calculate elapsed time since last update
      const elapsed = currentTime - lastTimeRef.current
      // Get a random interval between min and max
      const nextInterval = randomBetween(props.minInterval, props.maxInterval)

      // If enough time has elapsed, update a random cell
      if (elapsed >= nextInterval) {
        updateRandomCell()
        lastTimeRef.current = currentTime // Reset the last update time
      }

      requestAnimationFrame(step) // Continue the animation loop
    }

    // Start the animation
    const animationFrame = requestAnimationFrame(step)

    // Clean up the animation on component unmount
    return () => cancelAnimationFrame(animationFrame)
  }, [isVisible, props.minInterval, props.maxInterval, updateRandomCell])

  return (
    <div
      className={"animate-radix-grid"}
      style={{
        gridTemplateColumns: `repeat(${props.cols}, 1fr)`, // Set the grid layout based on columns
        ...props.style, // Spread any additional styles
      }}
      ref={gridRef} // Assign the ref to the grid container
    >
      {cells.map((symbol, index) => (
        <AnimateRadixCell
          key={index}
          // Show an empty string if the cell is unreachable
          symbol={unreachableSet.has(index) ? "" : symbol}
          // Pass the unreachable state to the cell
          isUnreachable={unreachableSet.has(index)}
        />
      ))}
    </div>
  )
}

export default AnimateRadixGrid
