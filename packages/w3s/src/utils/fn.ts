type SingleSymbol = string & { __singleSymbolBrand: never }

/**
 * Ensures the provided string is exactly one symbol (one character).
 * If the string meets this condition, it is returned as a branded `SingleSymbol` type.
 * Throws an error if the string length is not exactly one.
 *
 * @function
 * @param {string} symbol The string to validate.
 * @returns {SingleSymbol} The input string cast as `SingleSymbol` if it is exactly one character long.
 * @throws {Error} Throws an error if the string length is not equal to one.
 *
 * @example
 * ```tsx
 *   const validSymbol = assertSingleSymbol('a');
 *   console.log(validSymbol);
 *
 *   const invalidSymbol = assertSingleSymbol('ab');
 *   console.log(invalidSymbol);
 * ```
 */
export function assertSingleSymbol(symbol: string): SingleSymbol {
  if (symbol.length !== 1) {
    throw new Error("string must be exactly one symbol")
  }
  // Convert string to SingleSymbol type after checking
  return symbol as SingleSymbol
}

/**
 * Retrieves the computed width of the first element that matches the given CSS selector.
 *
 * @function
 * @param {string} selector A valid CSS selector string used to identify the target element.
 * @returns {number} The computed width of the element in pixels as an integer.
 * @throws {Error} Throws an error if no element matching the selector is found.
 *
 * @example
 * ```tsx
 *   const width = getElementWidth('#my-element');
 *   console.log(width);
 * ```
 */
export function getElementWidth(selector: string): number {
  const elt = document.querySelector(selector) as Element
  if (!elt) {
    throw new Error("the specified selector could not be found")
  }

  const width: number = parseInt(window.getComputedStyle(elt).getPropertyValue("width"))

  return width
}

/**
 * Retrieves the computed height of the first element that matches the given CSS selector.
 *
 * @function
 * @param {string} selector A valid CSS selector string used to identify the target element.
 * @returns {number} The computed height of the element in pixels as an integer.
 * @throws {Error} Throws an error if no element matching the selector is found.
 *
 * @example
 * ```tsx
 *   const height = getElementHeight('#my-element');
 *   console.log(height);
 * ```
 */
export function getElementHeight(selector: string): number {
  const elt = document.querySelector(selector) as Element
  if (!elt) {
    throw new Error("the specified selector could not be found")
  }

  const height: number = parseInt(window.getComputedStyle(elt).getPropertyValue("height"))

  return height
}

/**
 * Adds the specified class to the given element if it does not already have it.
 *
 * @function
 * @param {Element} element The DOM element to which the class will be added.
 * @param {string} cls The class name to add to the element.
 *
 * @example
 * ```tsx
 *   let btn = document.querySelector('.button');
 *   addClass(btn, 'active');
 *   console.log(btn);
 * ```
 */
export function addClass(element: HTMLElement, cls: string): void {
  if (!hasClass(element, cls)) {
    element.className += element.className ? ` ${cls}` : cls
  }
}

/**
 * Checks if the specified element has the given class.
 *
 * @function
 * @param {Element} element The DOM element to check.
 * @param {string} cls The class name to check for on the element.
 * @returns {boolean} Returns true if the element has the specified class, otherwise false.
 *
 * @example
 * ```tsx
 *   const btn = document.querySelector('.button');
 *   const isActive = hasClass(btn, 'active');
 *   console.log(isActive);
 * ```
 */
export function hasClass(element: HTMLElement, cls: string): boolean {
  return !!element.className.match(new RegExp("(\\s|^)" + cls + "(\\s|$)"))
}

/**
 * Removes the specified class from the given element if it exists.
 *
 * @function
 * @param {Element} element The DOM element from which the class will be removed.
 * @param {string} cls The class name to remove from the element.
 *
 * @example
 * ```tsx
 *   let btn = document.querySelector('.button');
 *   removeClass(btn, 'active');
 *   console.log(btn);
 * ```
 */
export function removeClass(element: HTMLElement, cls: string): void {
  if (hasClass(element, cls)) {
    element.className = element.className.replace(new RegExp("(\\s|^)" + cls + "(\\s|$)"), "")

    // If there are no more classes after deleting the class, remove the `class` attribute
    if (!element.className) {
      element.removeAttribute("class")
    }
  }
}

/**
 * Generates a string of random characters based on a specified character sequence and length.
 *
 * @function
 * @param {string} charsSequence A string containing the characters that can be used in the output.
 * @param {number} length The desired length of the output string.
 * @returns {string} A string consisting of randomly selected characters from the provided character sequence.
 *
 * @example
 * ```tsx
 *   const randomString = randomChars('1234567890ABCDEF!@#$%^&*_+[]{}<>?/~', 10);
 *   console.log(randomString);
 * ```
 */
export function randomChars(charsSequence: string, length: number): string {
  let randomSeq = ""
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * charsSequence.length)
    randomSeq += charsSequence[randomIndex]
  }
  return randomSeq
}

/**
 * Generates a random integer within a specified range.
 *
 * @function
 * @param {number} from The minimum value of the range (inclusive).
 * @param {number} to The maximum value of the range (inclusive).
 * @returns {number} A random integer between `min` and `max`, inclusive.
 *
 * @example
 * ```tsx
 *   const randomNumber = randomBetween(1, 10);
 *   console.log(randomNumber);
 * ```
 */
export function randomBetween(from: number, to: number): number {
  return Math.floor(Math.random() * (to - from + 1)) + from
}

/**
 * Schedules the execution of a function after a specified timeout.
 * If a previous timeout is active, it will be cleared before setting a new one.
 *
 * @function
 * @param {import("react").MutableRefObject<number | null>} timeoutRef A reference to store the current timeout ID.
 * @param {() => void} [triggerFn = () => {}] The function to be executed after the timeout. Defaults to a no-op function.
 * @param {number} [timeout = 300] The time in milliseconds to wait before executing the function. Defaults to 300ms.
 *
 * @example
 * ```tsx
 *   const timeoutRef = useRef<number | null>(null)
 *   runWithTimeout(timeoutRef, () => { alert("Hello, World!") }, 1e3)
 * ```
 */
export function runWithTimeout(
  timeoutRef: import("react").MutableRefObject<number | null>,
  triggerFn: () => void = () => {},
  timeout: number = 300
): void {
  timeoutRef.current && clearTimeout(timeoutRef.current)
  // Set a new timeout and store its ID in the reference
  timeoutRef.current = window.setTimeout(() => {
    // Execute the provided function after the timeout
    triggerFn && triggerFn()
  }, timeout)
}
