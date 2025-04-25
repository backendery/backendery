import { motion } from "framer-motion"
import React, { FC, useEffect, useState } from "react"

import { randomBetween } from "../../utils/fn"

/**
 * Define the props for the `AnimateSignalStrip` component.
 */
interface IAnimateSignalStripProps {
  /**
   * @property {string} symbol A single character or symbol to animate in the strip. This symbol
   * will repeat and form the visual signal strip. The component will validate that only one
   * character is provided.
   */
  symbol: string

  /**
   * @property {number} maxNumberOfSymbols The maximum number of symbols that can be displayed in
   * the strip at any given time. The component will dynamically grow or shrink the strip, but it
   * will not exceed this number of symbols.
   */
  maxNumberOfSymbols: number

  /**
   * @property {number} minInterval The minimum interval (in milliseconds) for updating the strip.
   * This determines the shortest amount of time between adding or removing symbols from the strip.
   */
  minInterval: number

  /**
   * @property {number} maxInterval The maximum interval (in milliseconds) for updating the strip.
   * This value represents the longest possible delay between changes in the strip’s length. The
   * actual interval will be randomly selected between `minInterval` and `maxInterval`.
   */
  maxInterval: number

  /**
   * @property {string} [initialSymbols = symbol] An optional string representing the initial set of
   * symbols to display when the component first renders. If provided, the string will be truncated
   * to `maxNumberOfSymbols` if it's longer than the allowed number. If not provided, the strip will
   * start with an empty or default state.
   */
  initialSymbols?: string

  /**
   * @property {React.CSSProperties} [style = {}] An optional inline CSS styles to apply to the
   * component’s `<p>` element. This allows for customizing visual properties such as font size,
   * color, or spacing.
   */
  style?: React.CSSProperties
}

/**
 * `AnimateSignalStrip` is a component that creates an animated strip of repeating symbols. This
 * component animates the appearance of symbols in the strip by randomly adding or removing
 * instances of a given symbol at intervals defined by the `minInterval` and `maxInterval`
 * properties.
 *
 * @component
 * @param {string} symbol The single character or symbol to be animated in the strip. This symbol is
 * repeated and forms the visual strip. The component validates that only one character is provided.
 * @param {number} maxNumberOfSymbols The maximum number of symbols allowed in the strip. This limit
 * controls the strip's maximum length.
 * @param {number} minInterval The minimum interval (in milliseconds) between updates to the strip.
 * It defines the shortest possible time between changes in the number of symbols.
 * @param {number} maxInterval The maximum interval (in milliseconds) between updates to the strip.
 * The component randomly selects an interval between `minInterval` and `maxInterval` to add or
 * remove symbols.
 * @param {string} [initialSymbols = symbol] An optional string that represents the starting
 * sequence of symbols displayed upon initial render. If longer than `maxNumberOfSymbols`, it will
 * be truncated to fit.
 * @param {React.CSSProperties} [style = {}] An optional inline CSS styles to apply directly to the
 * component’s `<p>` element, allowing customization of text color, font size, and other styles.
 *
 * @example
 * ```tsx
 * <AnimateSignalStrip
 *   symbol="*"
 *   maxNumberOfSymbols={10}
 *   minInterval={500}
 *   maxInterval={1500}
 *   initialSymbols="***"
 *   style={{ color: "red", fontSize: "20px" }}
 * />
 * ```
 *
 * @returns {JSX.Element} Returns a `<p>` element containing the animated symbol strip.
 */
const AnimateSignalStrip: FC<IAnimateSignalStripProps> = props => {
  /**
   * Manages the addition and removal of symbols in the strip based on dynamic conditions. If the
   * current length is below `maxNumberOfSymbols`, symbols are eligible to be added; if above one,
   * symbols can be removed. A random count of symbols is added or removed each time the function is
   * triggered, providing a dynamic visual animation within the constraints.
   *
   * @function
   */
  const animateSymbols = () => {
    const currentLength = symbols.length // Current number of symbols

    // Conditions for adding or removing symbols
    const canAdd = currentLength < props.maxNumberOfSymbols // Can we add more symbols?
    const canRemove = currentLength > 1 // Can we remove symbols? (at least 1 symbol must remain)

    // Ensure we don't try to add more symbols than allowed
    // Max number of symbols we can add
    const maxRandomCount = canAdd ? props.maxNumberOfSymbols - currentLength : currentLength - 1
    // Adding 1 to guarantee at least one addition or removal
    const randomCount = Math.floor(Math.random() * maxRandomCount) + 1

    // Determine whether to add or remove symbols
    const isAdding = canAdd && Math.random() < 0.5 // Randomly choose to add symbols
    if (isAdding) {
      /**
       * - If we decide to add symbols
       * - Determine the number of symbols to add
       */
      const countToAdd = Math.min(randomCount, props.maxNumberOfSymbols - currentLength)
      // Update the state by adding symbols
      setSymbols(prevSeqSymbols => prevSeqSymbols + props.symbol.repeat(countToAdd))
    } else if (canRemove) {
      /**
       * - If we decide to remove symbols
       * - Determine the number of symbols to remove
       */
      const countToRemove = Math.min(randomCount, currentLength - 1) // Keep at least 1 symbol
      // Update the state by removing symbols
      setSymbols(prevSeqSymbols => prevSeqSymbols.slice(0, currentLength - countToRemove))
    }
  }

  /** @states */
  /**
   * State that stores the current sequence of symbols in the animated strip. The `symbols` state
   * is initialized with the `initialSymbols` prop if provided; otherwise, it defaults to the single
   * base symbol provided by `symbol`. It dynamically updates in response to the `animateSymbols`
   * function, growing or shrinking as symbols are added or removed based on component logic.
   *
   * @type {string} symbols - A string representing the current animated strip sequence.
   * @function setSymbols - A function to update the `symbols` state with a new sequence.
   */
  const [symbols, setSymbols] = useState<string>(props.initialSymbols ?? props.symbol)

  // Synchronize duration with minimum interval
  const duration = props.minInterval / 1_000

  useEffect(() => {
    // Set an interval for animating symbols
    const interval = setInterval(animateSymbols, randomBetween(props.minInterval, props.maxInterval))

    // Clean up the interval on component unmount
    return () => clearInterval(interval)
  }, [symbols, props.symbol, props.maxNumberOfSymbols, props.minInterval, props.maxInterval])

  return (
    <motion.p style={{ ...props.style }} transition={{ duration: duration, repeat: Infinity }}>
      {symbols}
    </motion.p>
  )
}

export default AnimateSignalStrip
