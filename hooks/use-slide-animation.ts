import { useEffect, useRef } from "react";
import { Animated, Easing } from "react-native";

export const useSlideAnimation = (visible: boolean, distance = 300) => {
  const slideAnim = useRef(new Animated.Value(distance)).current;

  useEffect(() => {
    if (visible) {
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 300,
        easing: Easing.out(Easing.ease),
        useNativeDriver: true,
      }).start();
    } else {
      Animated.timing(slideAnim, {
        toValue: distance,
        duration: 300,
        easing: Easing.out(Easing.ease),
        useNativeDriver: true,
      }).start();
    }
  }, [visible, distance]);

  return slideAnim;
};
