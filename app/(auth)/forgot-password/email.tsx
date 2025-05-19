import SpineHubIcon from "@/assets/svgs/icons/spinehub-icon";
import AppText from "@/components/core/app-text";
import MainButton from "@/components/core/main-button";
import NavigationHeader from "@/components/core/navigation-header";
import SafeAreaView from "@/components/core/safe-area-view";
import TextInputValidated from "@/components/core/text-input-validated";
import { APP_HORIZONTAL_PADDING } from "@/constants/primitives";
import { router } from "expo-router";
import { useForm } from "react-hook-form";
import { KeyboardAvoidingView, StyleSheet, View } from "react-native";
import { zodResolver } from "@hookform/resolvers/zod";
import PressableOpacity from "@/components/core/pressable-opacity";
import PaginationDots from "@/components/auth/pagination-dots";
import {
  useForgotPasswordActions,
  useForgotPasswordDetails,
} from "@/stores/forgot-password-store";
import { EmailFormData } from "@/types/auth";
import { emailSchema } from "@/utils/validation-schemas";
import { useSnackbarActions } from "@/stores/snackbar-store";
import { useMutation } from "@tanstack/react-query";
import {
  CODE_SENT_ERROR,
  CODE_SENT_SUCCESS,
  EMAIL_NOT_FOUND,
} from "@/constants/snackbar";
import { ApiError } from "openapi-typescript-fetch";
import { AuthService } from "@/services/auth.service";

const ForgotPassword = () => {
  const { email } = useForgotPasswordDetails();
  const { updateForgotPasswordDetails, clearForgotPasswordDetails } =
    useForgotPasswordActions();
  const { addSnack } = useSnackbarActions();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<EmailFormData>({
    defaultValues: { email },
    resolver: zodResolver(emailSchema),
  });

  const { mutate: resetPasswordStart, isPending } = useMutation({
    mutationFn: AuthService.ResetPasswordStart,
    onSuccess(_data) {
      addSnack({
        severity: "success",
        message: CODE_SENT_SUCCESS,
      });
      router.navigate("/(auth)/forgot-password/verification");
    },
    onError(error: ApiError) {
      addSnack({
        severity: "error",
        message: error.status === 404 ? EMAIL_NOT_FOUND : CODE_SENT_ERROR,
      });
    },
  });

  const onSubmit = (data: EmailFormData) => {
    updateForgotPasswordDetails({ email: data.email });
    resetPasswordStart({ email: data.email });
  };

  const navigateToSignIn = () => {
    clearForgotPasswordDetails();
    router.push("/(auth)/signin");
  };

  return (
    <SafeAreaView style={styles.container}>
      <View>
        <NavigationHeader logo={<SpineHubIcon />} />
        <PaginationDots total={3} activeIndex={0} />
        <KeyboardAvoidingView
          style={{ gap: 29, paddingVertical: 20 }}
          behavior="padding"
        >
          <View style={styles.textBody}>
            <AppText color="black" fontWeight="semiBold" size={24} multiline>
              Oh no! Forgot your {"\n"}password?
            </AppText>
            <AppText color="navy800" fontWeight="regular" size={14} multiline>
              Enter your email below, we’ll send you a {"\n"}verification code.
            </AppText>
          </View>
          <View style={{ gap: 16 }}>
            <TextInputValidated
              name="email"
              label="Email"
              inputPlaceholder="Enter Email"
              control={control}
              error={errors.email?.message}
              onSubmitEditing={handleSubmit(onSubmit)}
              returnKeyType="next"
            />
          </View>
        </KeyboardAvoidingView>
      </View>
      <View style={styles.bottomContainer}>
        <MainButton
          text="Next"
          onPress={handleSubmit(onSubmit)}
          isLoading={isPending}
        />
        <View style={styles.textContainer}>
          <AppText color="navy800" size={12} fontWeight="regular">
            Remembered your password?
          </AppText>
          <PressableOpacity onPress={navigateToSignIn}>
            <AppText color="navy1000" size={12} fontWeight="semiBold">
              Log In Here
            </AppText>
          </PressableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default ForgotPassword;

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
    minHeight: 85,
    gap: 16,
  },
  textContainer: {
    display: "flex",
    flexDirection: "row",
    gap: 4,
    justifyContent: "center",
  },
});
