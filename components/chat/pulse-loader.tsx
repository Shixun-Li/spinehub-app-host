import React, { useEffect, useRef } from "react";
import { StyleSheet, Animated, Easing } from "react-native";
import { COLORS } from "@/constants/theme";

const PulseLoader = () => {
  const scale = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(scale, {
          toValue: 1.2,
          duration: 600,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(scale, {
          toValue: 1,
          duration: 600,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  return (
    <Animated.View
      style={[
        styles.avatar,
        {
          backgroundColor: COLORS.navy50,
          transform: [{ scale }],
        },
      ]}
    />
  );
};

export default PulseLoader;

const styles = StyleSheet.create({
  avatar: {
    width: 28,
    height: 28,
    borderRadius: 999,
    marginLeft: -8,
  },
});
