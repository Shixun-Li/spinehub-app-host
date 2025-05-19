import React from "react";
import Svg, { Path } from "react-native-svg";
import { IconBaseProps } from "@/types/core";

const ChangePasswordIcon = ({
  size = 16,
  color = "#EDEDED",
}: IconBaseProps) => {
  return (
    <Svg width={size} height={size} viewBox="0 0 16 16" fill="none">
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M7.9999 0.8C6.01168 0.8 4.3999 2.41182 4.3999 4.4V7.2H3.9999C3.11625 7.2 2.3999 7.91639 2.3999 8.8V13.6C2.3999 14.4837 3.11625 15.2 3.9999 15.2H11.9999C12.8836 15.2 13.5999 14.4837 13.5999 13.6V8.8C13.5999 7.91639 12.8836 7.2 11.9999 7.2H11.5999V4.4C11.5999 2.41182 9.98813 0.8 7.9999 0.8ZM10.3999 7.2V4.4C10.3999 3.07457 9.32539 2 7.9999 2C6.67442 2 5.5999 3.07457 5.5999 4.4V7.2H10.3999Z"
        fill={color}
      />
    </Svg>
  );
};

export default ChangePasswordIcon;
