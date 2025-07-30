import { DefaultProps } from "@/type/props";
import { Keyof } from "@/type/util";

import heart from "../assets/heart.svg";
import my from "../assets/my.svg";
import person from "../assets/person.svg";

export const iconTypes = {
  heart,
  person,
  my,
};

export type IconProps = {
  name: Keyof<typeof iconTypes>;
  size?: number;
  color?: string;
} & DefaultProps;

function Icon({ name, size = 16, color, style, ...props }: IconProps) {
  const SvgIcon = iconTypes[name];
  const colorValue = color;

  return (
    <SvgIcon
      width={size}
      height={size}
      style={{
        display: "flex",
        alignItems: "center",
        margin: "0",
        color: colorValue,
        minWidth: size,
        minHeight: size,
        pointerEvents: "none",
        ...style,
      }}
      {...props}
    />
  );
}

export default Icon;
