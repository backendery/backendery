import { FC, SVGProps } from "react"

import { ReactComponent as ArrowRightIcon } from "./icons/arrow-right.svg"
import { ReactComponent as ArrowTurnIcon } from "./icons/arrow-turn.svg"
import { ReactComponent as ArrowUpIcon } from "./icons/arrow-up.svg"
import { ReactComponent as LogoIcon } from "./icons/logo.svg"
import { ReactComponent as RotateDeviceIcon } from "./icons/rotate-device.svg"

/**
 * `icons` is an object that maps string keys to imported SVG components. This ensures that the
 * `SvgIcon` component can dynamically render the correct SVG based on the `name` prop.
 */
const icons = {
  "arrow-right": ArrowRightIcon,
  "arrow-turn": ArrowTurnIcon,
  "arrow-up": ArrowUpIcon,
  "logo": LogoIcon,
  "rotate-device": RotateDeviceIcon,
} as const

/**
 * @typedef {keyof typeof icons} SvgIconName The type for valid icon names based on the keys in the
 * `icons` object.
 */
export type SvgIconName = keyof typeof icons

/**
 * @typedef {SVGProps<SVGSVGElement> & { name: SvgIconName }} SvgIconProps The props for the
 * `SvgIcon` component. Includes SVG properties and the `name` prop.
 */
type SvgIconProps = SVGProps<SVGSVGElement> & { name: SvgIconName }

/**
 * `SvgIcon` component that renders an SVG icon based on the provided `name` prop. It supports
 * additional SVG properties through the `svgProps` spread, allowing for customization of attributes
 * like `width`, `height`, `fill`, etc. The component maps `name` to a predefined set of imported
 * SVG icons. If an invalid `name` is provided, the component returns `null` and does not render
 * anything.
 *
 * @component
 * @param {SvgIconName} name The name of the icon to be rendered. This must match one of the keys in
 * the `icons` object.
 * @param {SVGProps<SVGSVGElement>} svgProps Additional SVG properties that can be passed to
 * customize the SVG element. This can include attributes like `className`, `width`, `height`,
 * `fill`, etc.
 *
 * @example
 * ```tsx
 * <div>
 *   <SvgIcon name="rotate-device" className="custom-class" />
 * </div>
 * ```
 *
 * @returns {JSX.Element | null} The selected SVG icon element, or `null` if an invalid `name` is
 * provided.
 */
const SvgIcon: FC<SvgIconProps> = ({ name, ...svgProps }) => {
  const Icon = icons[name] ?? null
  return Icon && <Icon {...svgProps} />
}

export { SvgIcon }
