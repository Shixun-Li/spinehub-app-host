import { zodResolver } from "@hookform/resolvers/zod";
import { router } from "expo-router";
import React from "react";
import { useForm } from "react-hook-form";
import MainButton from "@/components/core/main-button";
import NavigationHeader from "@/components/core/navigation-header";
import TextInputValidated from "@/components/core/text-input-validated";
import { PasswordFormData } from "@/types/auth";
import { passwordSchema } from "@/utils/validation-schemas";
import {
  useForgotPasswordActions,
  useForgotPasswordDetails,
} from "@/stores/forgot-password-store";
import { APP_HORIZONTAL_PADDING } from "@/constants/primitives";
import SpineHubIcon from "@/assets/svgs/icons/spinehub-icon";
import PaginationDots from "@/components/auth/pagination-dots";
import AppText from "@/components/core/app-text";
import {
  Keyboard,
  KeyboardAvoidingView,
  SafeAreaView,
  StyleSheet,
  View,
} from "react-native";
import { ApiError } from "openapi-typescript-fetch";
import { PASSWORD_RESET_ERROR } from "@/constants/snackbar";
import { CODE_VERIFIED_ERROR_403 } from "@/constants/snackbar";
import { AuthService } from "@/services/auth.service";
import { useMutation } from "@tanstack/react-query";
import { PASSWORD_RESET_SUCCESS } from "@/constants/snackbar";
import { useSnackbarActions } from "@/stores/snackbar-store";

const Password = () => {
  const { email, code, password } = useForgotPasswordDetails();
  const { addSnack } = useSnackbarActions();
  const { updateForgotPasswordDetails, clearForgotPasswordDetails } =
    useForgotPasswordActions();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<PasswordFormData>({
    defaultValues: { password, confirmPassword: "" },
    resolver: zodResolver(passwordSchema),
  });

  const { mutate: resetPasswordFinish, isPending } = useMutation({
    mutationFn: AuthService.ResetPasswordFinish,
    onSuccess(_data) {
      addSnack({
        severity: "success",
        message: PASSWORD_RESET_SUCCESS,
      });
      clearForgotPasswordDetails();
      Keyboard.dismiss();
    },
    onError(error: ApiError) {
      addSnack({
        severity: "error",
        message:
          error.status === 403 ? CODE_VERIFIED_ERROR_403 : PASSWORD_RESET_ERROR,
      });
    },
  });

  const onSubmit = (data: PasswordFormData) => {
    updateForgotPasswordDetails({ password: data.password });
    resetPasswordFinish({ email, code, password: data.password });
    returnToHomePage();
  };

  const returnToHomePage = () => {
    clearForgotPasswordDetails();

    if (router.canDismiss()) router.dismissAll();
    router.replace("/(auth)/signin");
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={styles.container}>
        <View>
          <NavigationHeader logo={<SpineHubIcon />} />
          <PaginationDots total={3} activeIndex={2} />
          <KeyboardAvoidingView
            style={{ gap: 29, paddingVertical: 20 }}
            behavior="padding"
          >
            <View style={styles.textBody}>
              <AppText color="black" fontWeight="semiBold" size={24} multiline>
                Lets set a new password
              </AppText>
              <AppText color="navy800" fontWeight="regular" size={14} multiline>
                Your password must be at least 8 characters an{"\n"}include 1
                numerical value, 1symbol and 1 upper and{"\n"}lower case
                character
              </AppText>
            </View>
            <View style={{ gap: 16 }}>
              <TextInputValidated
                isPasswordInput
                name="password"
                label="Create new password"
                inputPlaceholder="Enter Password"
                control={control}
                error={errors.password?.message}
                returnKeyType="next"
                isForgotPassword={false}
              />
              <TextInputValidated
                isPasswordInput
                name="confirmPassword"
                label="Confirm new password"
                inputPlaceholder="Enter Password"
                control={control}
                error={errors.confirmPassword?.message}
                onSubmitEditing={handleSubmit(onSubmit)}
                returnKeyType="next"
                isForgotPassword={false}
              />
            </View>
          </KeyboardAvoidingView>
        </View>
        <View style={styles.bottomContainer}>
          <MainButton
            text="Finish"
            isLoading={isPending}
            onPress={handleSubmit(onSubmit)}
          />
        </View>
      </View>
    </SafeAreaView>
  );
};

export default Password;

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
});
