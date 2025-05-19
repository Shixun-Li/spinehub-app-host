import { APP_ACTIVE_OPACITY } from "@/constants/primitives";
import React, { LegacyRef, useState } from "react";
import { Pressable, PressableProps, View } from "react-native";

type Props = {
  style?: any;
  children: React.ReactNode;
} & PressableProps;

const PressableOpacity = React.forwardRef(
  ({ style, onPress, children, ...props }: Props, ref: LegacyRef<View>) => {
    const [isPressed, setIsPressed] = useState(false);
    return (
      <Pressable
        ref={ref}
        onPress={onPress}
        onPressIn={() => setIsPressed(true)}
        onPressOut={() => setIsPressed(false)}
        style={[
          style,
          {
            opacity: props.disabled ? 0.6 : isPressed ? APP_ACTIVE_OPACITY : 1,
          },
        ]}
        {...props}
      >
        {children}
      </Pressable>
    );
  }
);

export default PressableOpacity;
