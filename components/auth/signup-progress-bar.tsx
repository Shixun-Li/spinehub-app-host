import { SIGN_UP_STEPS } from "@/app/(auth)/onboarding";
import useStatusBar from "@/hooks/use-status-bar";
import { SignUpStep } from "@/types/auth";
import React from "react";
import { StyleSheet, View } from "react-native";
import Animated, { useAnimatedStyle } from "react-native-reanimated";

type Props = {
  step: SignUpStep;
};

const SignUpProgressBar = ({ step }: Props) => {
  const currentStepIndex = SIGN_UP_STEPS.findIndex((s) => s === step);

  return (
    <View style={styles.container}>
      <View style={styles.circlesContainer}>
        {SIGN_UP_STEPS.map((_, index) => (
          <AnimatedCircle key={index} isActive={index === currentStepIndex} />
        ))}
      </View>
    </View>
  );
};

const AnimatedCircle = ({ isActive }: { isActive: boolean }) => {
  const { width, height, backgroundColor } = useStatusBar({ isActive });

  const animatedStyle = useAnimatedStyle(() => {
    return {
      width: width.value,
      height: height.value,
      backgroundColor: backgroundColor.value,
    };
  });

  return <Animated.View style={[styles.circle, animatedStyle]} />;
};

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 20,
    paddingHorizontal: 52,
  },
  circlesContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: 50,
    gap: 2,
  },
  circle: {
    borderRadius: 3,
  },
});

export default SignUpProgressBar;
