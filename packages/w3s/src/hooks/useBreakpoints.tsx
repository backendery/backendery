import { useMediaQuery } from "react-responsive"

enum Breakpoints {
  XS = 480,
  SM = 768,
  MD = 992,
  LG = 1200,
  XL = 1920,
}

type SizeMap = Readonly<{ [key in keyof typeof Breakpoints]: Breakpoints }>

const sizes: SizeMap = {
  XS: Breakpoints.XS,
  SM: Breakpoints.SM,
  MD: Breakpoints.MD,
  LG: Breakpoints.LG,
  XL: Breakpoints.XL,
} as const

type DeviceType = "smartphone" | "smallDevice" | "tablet" | "laptop" | "pC" | "largeDevice"

type BreakpointHook = { [key in `is${Capitalize<DeviceType>}`]: boolean } & { sizes: SizeMap }

/**
 * `useBreakpoints` hook that utilizes `react-responsive` to provide a set of media query results
 * based on predefined breakpoints. This hook returns a set of booleans indicating whether the
 * current screen width matches various device types. The breakpoints are defined in the
 * `Breakpoints` enum, and the hook can be used to check if the screen falls within ranges for
 * smartphones, tablets, laptops, PCs, etc.
 *
 * @typedef {Object} BreakpointHook
 * @property {boolean} isSmartphone True if the screen width is at most 480px.
 * @property {boolean} isSmallDevice True if the screen width is between 481px and 767px.
 * @property {boolean} isTablet True if the screen width is between 768px and 991px.
 * @property {boolean} isLaptop True if the screen width is between 992px and 1199px.
 * @property {boolean} isPC True if the screen width is between 1200px and 1919px.
 * @property {boolean} isLargeDevice True if the screen width is at least 1920px.
 * @property {SizeMap} sizes A read-only object mapping device type names to their respective
 * breakpoint values.
 *
 * @example
 * ```tsx
 * const { isTablet, isLaptop, sizes } = useBreakpoints();
 *
 * <div>
 *   {isTablet && <p>Currently viewed on a tablet</p>}
 *   {isLaptop && <p>Currently viewed on a laptop</p>}
 * </div>
 * ```
 *
 * @returns {BreakpointHook} An object containing the media query results and the size map.
 */
const useBreakpoints = (): BreakpointHook => {
  return {
    isSmartphone: useMediaQuery({ maxWidth: Breakpoints.XS }),
    isSmallDevice: useMediaQuery({ minWidth: Breakpoints.XS + 1, maxWidth: Breakpoints.SM - 1 }),
    isTablet: useMediaQuery({ minWidth: Breakpoints.SM, maxWidth: Breakpoints.MD - 1 }),
    isLaptop: useMediaQuery({ minWidth: Breakpoints.MD, maxWidth: Breakpoints.LG - 1 }),
    isPC: useMediaQuery({ minWidth: Breakpoints.LG, maxWidth: Breakpoints.XL - 1 }),
    isLargeDevice: useMediaQuery({ minWidth: Breakpoints.XL }),
    sizes,
  }
}

/**
 * `useDeviceType` hook that takes a `BreakpointHook` object and returns the device type as a
 * string. The device type is determined based on the boolean values in the `BreakpointHook`
 * object, which indicate whether the current screen width matches various device types.
 *
 * @param {BreakpointHook} bp - The breakpoint hook object containing media query results.
 *
 * @example
 * ```tsx
 * const bp = useBreakpoints();
 * const deviceType = useDeviceType(bp);
 *
 * <div>
 *   {deviceType === "tablet" && <p>Currently viewed on a tablet</p>}
 * </div>
 * ```
 *
 * @returns {DeviceType | undefined} The device type as a string or undefined if no match is found.
 */
const useDeviceType = (bp: BreakpointHook): DeviceType | undefined => {
  if (bp.isSmartphone) return "smartphone"
  if (bp.isSmallDevice) return "smallDevice"
  if (bp.isTablet) return "tablet"
  if (bp.isLaptop) return "laptop"
  if (bp.isPC) return "pC"
  if (bp.isLargeDevice) return "largeDevice"
  return undefined
}

export { Breakpoints, useBreakpoints, useDeviceType }
export type { DeviceType }
