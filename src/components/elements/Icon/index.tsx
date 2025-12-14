import { type SVGProps } from 'react';

import ArrowRightIcon from './icons/arrow-right.svg?react';
import ArrowTurnIcon from './icons/arrow-turn.svg?react';
import ArrowUpIcon from './icons/arrow-up.svg?react';
import RotateDeviceIcon from './icons/rotate-device.svg?react';

/**
 * `icons` is an object that maps string keys to imported SVG components. This ensures that the
 * `SvgIcon` component can dynamically render the correct SVG based on the `name` prop.
 */
const icons = {
  'arrow-right': ArrowRightIcon,
  'arrow-turn': ArrowTurnIcon,
  'arrow-up': ArrowUpIcon,
  'rotate-device': RotateDeviceIcon,
} satisfies Record<string, React.ComponentType<SVGProps<SVGSVGElement>>>;

/**
 * @typedef {keyof typeof icons} SvgIconName The type for valid icon names based on the keys in the
 * `icons` object.
 */
export type SvgIconName = keyof typeof icons;

/**
 * @typedef {SVGProps<SVGSVGElement> & { name: SvgIconName }} SvgIconProps The props for the
 * `SvgIcon` component. Includes SVG properties and the `name` prop.
 */
type SvgIconProps = SVGProps<SVGSVGElement> & { readonly name: SvgIconName };

/**
 * The `SvgIcon` component that renders an SVG icon based on the provided `name` prop.
 * @description It supports additional SVG properties through the spread, allowing for customization
 * of attributes like `width`, `height`, `fill`, etc. The component maps `name` to a predefined set of imported
 * SVG icons. If an invalid `name` is provided, the component returns `null` and does not render anything.
 * @param props - The component props
 * @param props.name - The name of the icon to be rendered. This must match one of the keys in the `icons` object.
 * @returns The selected SVG icon element, or `null` if an invalid `name` is provided.
 * @example
 * ```tsx
 * <div>
 *   <SvgIcon name="menu" className="custom-cls-x" />
 * </div>
 * ```
 */
const SvgIcon: React.FC<SvgIconProps> = ({ name, ...restProps }: SvgIconProps) => {
  const Icon = icons[name] ?? null;
  return Icon && <Icon {...restProps} />;
};

export default SvgIcon;
