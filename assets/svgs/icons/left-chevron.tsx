import { IconBaseProps } from "@/types/core";
import React from "react";
import { Path, Svg } from "react-native-svg";

const LeftChevron = ({ size, color }: IconBaseProps) => {
  return (
    <Svg width={size ?? 28} height={size ?? 28} viewBox="0 0 28 28" fill="none">
      <Path
        fill-rule="evenodd"
        clip-rule="evenodd"
        d="M12.8687 4.63128C13.2104 4.97299 13.2104 5.52701 12.8687 5.86872L5.61244 13.125H24.5C24.9832 13.125 25.375 13.5168 25.375 14C25.375 14.4832 24.9832 14.875 24.5 14.875H5.61244L12.8687 22.1313C13.2104 22.473 13.2104 23.027 12.8687 23.3687C12.527 23.7104 11.973 23.7104 11.6313 23.3687L2.88128 14.6187C2.53957 14.277 2.53957 13.723 2.88128 13.3813L11.6313 4.63128C11.973 4.28957 12.527 4.28957 12.8687 4.63128Z"
        fill={color ?? "#121B36"}
      />
    </Svg>
  );
};

export default LeftChevron;
