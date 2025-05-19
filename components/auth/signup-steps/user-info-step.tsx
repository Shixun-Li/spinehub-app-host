import { KeyboardAvoidingView, StyleSheet, View } from "react-native";
import React from "react";
import TextInputValidated from "@/components/core/text-input-validated";
import { Control, FieldErrors } from "react-hook-form";
import { SignUpFormData } from "@/types/auth";
import MainButton from "@/components/core/main-button";
import Animated, { FadeIn, FadeOut } from "react-native-reanimated";
import AppText from "@/components/core/app-text";
import AuthFooter from "@/components/core/auth-footer";

type Props = {
  control: Control<SignUpFormData>;
  errors: FieldErrors<SignUpFormData>;
  onSubmit: () => void;
};

const UserInfoStep = ({ control, errors, onSubmit }: Props) => {
  return (
    <Animated.View entering={FadeIn} exiting={FadeOut} style={styles.container}>
      <KeyboardAvoidingView style={styles.content} behavior="padding">
        <View>
          <View style={{ gap: 10, paddingBottom: 20 }}>
            <AppText fontWeight="semiBold" size={24}>
              Welcome! Lets get you started.
            </AppText>
            <AppText fontWeight="regular" size={14} color="navy800">
              We will send a verification code to this email.
            </AppText>
          </View>

          <TextInputValidated
            name="email"
            label="Email"
            control={control}
            inputPlaceholder="Email"
            keyboardType="email-address"
            error={errors.email?.message}
          />
        </View>

        {/* TODO: add link to terms of use and privacy policy */}
        <AppText fontWeight="regular" size={12} color="navy400">
          By continuing you agree to Spinehub's{" "}
          <AppText fontWeight="regular" size={12} color="navy1000">
            Terms of Use
          </AppText>{" "}
          and{" "}
          <AppText fontWeight="regular" size={12} color="navy1000">
            Privacy Policy.
          </AppText>
        </AppText>
      </KeyboardAvoidingView>
      <View style={styles.buttonContainer}>
        <MainButton text="Next" onPress={() => onSubmit()} />
      </View>

      <View style={{ paddingVertical: 20 }}>
        <AuthFooter currentScreen="signup" />
      </View>
    </Animated.View>
  );
};

export default UserInfoStep;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "space-between",
  },
  content: {
    flex: 1,
  },
  buttonContainer: {
    marginTop: 20,
    width: "100%",
    height: 50,
  },
});
