import { zodResolver } from "@hookform/resolvers/zod";
import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import {
  KeyboardAvoidingView,
  SafeAreaView,
  View,
  StyleSheet,
} from "react-native";
import { VerificationCodeFormData } from "@/types/auth";
import { verificationCodeSchema } from "@/utils/validation-schemas";
import VerificationCodeInput from "./verification-code-input";
import MainButton from "../core/main-button";
import NavigationHeader from "../core/navigation-header";
import SpineHubIcon from "@/assets/svgs/icons/spinehub-icon";
import PaginationDots from "./pagination-dots";
import AppText from "../core/app-text";
import { APP_HORIZONTAL_PADDING } from "@/constants/primitives";

type Props = {
  onSubmit: (data: VerificationCodeFormData) => void;
  resendCode: () => void;
  isLoading: boolean;
  buttonText: string;
  email: string;
};

const VerificationCode = ({
  onSubmit,
  resendCode,
  isLoading,
  buttonText,
  email,
}: Props) => {
  const {
    control,
    watch,
    trigger,
    handleSubmit,
    formState: { errors },
  } = useForm<VerificationCodeFormData>({
    defaultValues: { code: "" },
    resolver: zodResolver(verificationCodeSchema),
  });

  const codeValue = watch("code");

  useEffect(() => {
    if (codeValue.length === 6)
      trigger().then((isValid) => {
        if (isValid) onSubmit({ code: codeValue });
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [codeValue]);

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={styles.container}>
        <View>
          <NavigationHeader logo={<SpineHubIcon />} />
          <PaginationDots total={3} activeIndex={1} />
          <KeyboardAvoidingView
            style={{ gap: 29, paddingVertical: 20 }}
            behavior="padding"
          >
            <View style={styles.textBody}>
              <AppText color="black" fontWeight="semiBold" size={24} multiline>
                Check your email.
              </AppText>
              <AppText color="navy800" fontWeight="regular" size={14} multiline>
                Enter the unique 6-digit code we sent to {"\n"}
                {email}
              </AppText>
            </View>
            <VerificationCodeInput
              name="code"
              label="Verification Code"
              control={control}
              error={errors.code?.message}
              resendCode={resendCode}
            />
          </KeyboardAvoidingView>
        </View>
        <View style={styles.bottomContainer}>
          <MainButton
            text={buttonText}
            isLoading={isLoading}
            onPress={handleSubmit(onSubmit)}
          />
        </View>
      </View>
    </SafeAreaView>
  );
};

export default VerificationCode;

const styles = StyleSheet.create({
  container: {
    marginVertical: 20,
    paddingHorizontal: APP_HORIZONTAL_PADDING,
    justifyContent: "space-between",
    flex: 1,
  },
  textBody: {
    gap: 8,
  },
  bottomContainer: {
    height: 53,
    marginBottom: 30,
  },
  textContainer: {
    display: "flex",
    flexDirection: "row",
    gap: 4,
    justifyContent: "center",
  },
});
