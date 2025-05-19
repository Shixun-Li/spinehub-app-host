import { useSharedValue, withTiming } from "react-native-reanimated";
import { useEffect } from "react";
import { withSpring } from "react-native-reanimated";
import { COLORS } from "../constants/theme";
import { SIGN_UP_STEP_ANIMATION_DURATION } from "../constants/animations";

type UseStatusBarProps = {
  isActive: boolean;
};

const useStatusBar = ({ isActive }: UseStatusBarProps) => {
  const width = useSharedValue(6);
  const height = useSharedValue(6);
  const backgroundColor = useSharedValue(COLORS.navy200);

  useEffect(() => {
    if (isActive) {
      width.value = withSpring(12, {
        damping: 15,
        stiffness: 100,
      });
      height.value = withSpring(6, {
        damping: 15,
        stiffness: 100,
      });
      backgroundColor.value = withTiming(COLORS.navy1000, {
        duration: SIGN_UP_STEP_ANIMATION_DURATION,
      });
    } else {
      width.value = withSpring(6, {
        damping: 15,
        stiffness: 100,
      });
      height.value = withSpring(6, {
        damping: 15,
        stiffness: 100,
      });
      backgroundColor.value = withTiming(COLORS.navy200, {
        duration: SIGN_UP_STEP_ANIMATION_DURATION,
      });
    }
  }, [isActive]);

  return { width, height, backgroundColor };
};

export default useStatusBar;
