import { useMediaQuery } from 'react-responsive';

const Breakpoints = {
  LG: 1_200,
  MD: 992,
  SM: 768,
  XL: 1_920,
  XS: 480,
};

type SizeMap = Readonly<{
  [key in keyof typeof Breakpoints]: (typeof Breakpoints)[key];
}>;

const sizes: SizeMap = {
  LG: Breakpoints.LG,
  MD: Breakpoints.MD,
  SM: Breakpoints.SM,
  XL: Breakpoints.XL,
  XS: Breakpoints.XS,
} as const;

type BreakpointHook = { [key in `is${Capitalize<DeviceType>}`]: boolean } & {
  sizes: SizeMap;
};

type DeviceType = 'laptop' | 'largeDevice' | 'pC' | 'smallDevice' | 'smartphone' | 'tablet';

/**
 * `useBreakpoints` hook that utilizes `react-responsive` to provide a set of media query results
 * based on predefined breakpoints. This hook returns a set of booleans indicating whether the
 * current screen width matches various device types. The breakpoints are defined in the
 * `Breakpoints` enum, and the hook can be used to check if the screen falls within ranges for
 * smartphones, tablets, laptops, PCs, etc.
 * @typedef {object} BreakpointHook
 * @property {boolean} isSmartphone True if the screen width is at most 480px.
 * @property {boolean} isSmallDevice True if the screen width is between 481px and 767px.
 * @property {boolean} isTablet True if the screen width is between 768px and 991px.
 * @property {boolean} isLaptop True if the screen width is between 992px and 1199px.
 * @property {boolean} isPC True if the screen width is between 1200px and 1919px.
 * @property {boolean} isLargeDevice True if the screen width is at least 1920px.
 * @property {SizeMap} sizes A read-only object mapping device type names to their respective
 * breakpoint values.
 * @example
 * ```tsx
 * const { isTablet, isLaptop, sizes } = useBreakpoints();
 *
 * <div>
 *   {isTablet && <p>Currently viewed on a tablet</p>}
 *   {isLaptop && <p>Currently viewed on a laptop</p>}
 * </div>
 * ```
 * @returns {BreakpointHook} An object containing the media query results and the size map.
 */
const useBreakpoints = (): BreakpointHook => {
  return {
    isLaptop: useMediaQuery({ maxWidth: Breakpoints.LG - 1, minWidth: Breakpoints.MD }),
    isLargeDevice: useMediaQuery({ minWidth: Breakpoints.XL }),
    isPC: useMediaQuery({ maxWidth: Breakpoints.XL - 1, minWidth: Breakpoints.LG }),
    isSmallDevice: useMediaQuery({ maxWidth: Breakpoints.SM - 1, minWidth: Breakpoints.XS + 1 }),
    isSmartphone: useMediaQuery({ maxWidth: Breakpoints.XS }),
    isTablet: useMediaQuery({ maxWidth: Breakpoints.MD - 1, minWidth: Breakpoints.SM }),
    sizes,
  };
};

/**
 * `useDeviceType` hook that takes a `BreakpointHook` object and returns the device type as a
 * string. The device type is determined based on the boolean values in the `BreakpointHook`
 * object, which indicate whether the current screen width matches various device types.
 * @param {BreakpointHook} bp - The breakpoint hook object containing media query results.
 * @example
 * ```tsx
 * const bp = useBreakpoints();
 * const deviceType = useDeviceType(bp);
 *
 * <div>
 *   {deviceType === "tablet" && <p>Currently viewed on a tablet</p>}
 * </div>
 * ```
 * @returns {DeviceType | undefined} The device type as a string or undefined if no match is found.
 */
const useDeviceType = (bp: BreakpointHook): DeviceType | undefined => {
  if (bp.isSmartphone) {
    return 'smartphone';
  }

  if (bp.isSmallDevice) {
    return 'smallDevice';
  }

  if (bp.isTablet) {
    return 'tablet';
  }

  if (bp.isLaptop) {
    return 'laptop';
  }

  if (bp.isPC) {
    return 'pC';
  }

  if (bp.isLargeDevice) {
    return 'largeDevice';
  }

  return undefined;
};

export { Breakpoints, useBreakpoints, useDeviceType };
export type { DeviceType };
