import { ActivityIndicator, StyleSheet, View } from "react-native";
import React, { useCallback, useState } from "react";
import { SignUpStep } from "@/types/auth";
import { APP_HORIZONTAL_PADDING } from "@/constants/primitives";
import NavigationHeader from "@/components/core/navigation-header";
import UserDetailsStep from "@/components/auth/signup-steps/user-details-step";
import PasswordStep from "@/components/auth/signup-steps/password-step";
import SignUpProgressBar from "@/components/auth/signup-progress-bar";
import { router, useLocalSearchParams } from "expo-router";
import SafeAreaView from "@/components/core/safe-area-view";
import SpineHubIcon from "@/assets/svgs/icons/spinehub-icon";
import { useQuery } from "@tanstack/react-query";
import { components } from "@/backend-sdk/schema";
import AppText from "@/components/core/app-text";
import { COLORS } from "@/constants/theme";

export const SIGN_UP_STEPS: Array<SignUpStep> = [
  "userDetails",
  "password",
] as const;

const Onboarding = () => {
  const [step, setStep] = useState<SignUpStep>("userDetails");
  const { token } = useLocalSearchParams();

  const { data, isLoading } = useQuery({
    queryKey: ["onboarding", token],
    queryFn: async () => {
      const response = await fetch(
        `${process.env.EXPO_PUBLIC_API_URL}/api/v1/user-invitation`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const userData: components["schemas"]["UserPayloadDto"] =
        await response.json();
      userData;

      return userData;
    },
  });

  console.log(data);

  const goToNextStep = useCallback(() => {
    const currentStepIndex = SIGN_UP_STEPS.indexOf(step);
    if (currentStepIndex < SIGN_UP_STEPS.length - 1) {
      setStep(SIGN_UP_STEPS[currentStepIndex + 1]);
    }
  }, [step]);

  const handleBackPress = useCallback(() => {
    const currentStepIndex = SIGN_UP_STEPS.indexOf(step);
    if (currentStepIndex > 0) {
      setStep(SIGN_UP_STEPS[currentStepIndex - 1]);
    } else {
      router.back();
    }
  }, [step]);

  const onSubmitUserDetailsStep = () => {
    goToNextStep();
  };

  const renderStep = useCallback(() => {
    if (!data) return null;

    switch (step) {
      case "userDetails":
        return (
          <UserDetailsStep user={data} onSubmit={onSubmitUserDetailsStep} />
        );
      case "password":
        return <PasswordStep userId={data.id!} token={token as string} />;
      default:
        return null;
    }
  }, [step, data]);

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator color={COLORS.smoke1000} />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View>
        <NavigationHeader
          onBackPress={handleBackPress}
          logo={<SpineHubIcon />}
        />
        <SignUpProgressBar step={step} />
      </View>
      {renderStep()}
    </SafeAreaView>
  );
};

export default Onboarding;

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: APP_HORIZONTAL_PADDING,
    justifyContent: "space-between",
    flex: 1,
  },
});
