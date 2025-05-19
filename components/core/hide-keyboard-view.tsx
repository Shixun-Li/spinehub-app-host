import useKeyboardStatus from "@/utils/use-keyboard-status";
import React from "react";
import { Keyboard, Pressable } from "react-native";

const HideKeyboardView = ({ children }: { children: React.ReactNode }) => {
  const { isKeyboardOpen } = useKeyboardStatus();
  return (
    <Pressable
      disabled={!isKeyboardOpen}
      onPress={Keyboard.dismiss}
      style={{ flex: 1 }}
    >
      {children}
    </Pressable>
  );
};

export default HideKeyboardView;
