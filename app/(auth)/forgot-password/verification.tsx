import { router } from "expo-router";
import React from "react";
import {
  useForgotPasswordActions,
  useForgotPasswordDetails,
} from "@/stores/forgot-password-store";
import { VerificationCodeFormData } from "@/types/auth";
import VerificationCode from "@/components/auth/verification-code";
import { useMutation } from "@tanstack/react-query";
import { AuthService } from "@/services/auth.service";
import { ApiError } from "openapi-typescript-fetch";
import {
  CODE_VERIFIED_ERROR,
  CODE_VERIFIED_ERROR_403,
  CODE_VERIFIED_SUCCESS,
  EMAIL_NOT_FOUND,
  CODE_SENT_ERROR,
  CODE_SENT_SUCCESS,
} from "@/constants/snackbar";
import { useSnackbarActions } from "@/stores/snackbar-store";

const Verification = () => {
  const { email } = useForgotPasswordDetails();
  const { updateForgotPasswordDetails } = useForgotPasswordActions();
  const { addSnack } = useSnackbarActions();

  const { mutate: resetPasswordStart, isPending: isResetPasswordStartPending } =
    useMutation({
      mutationFn: AuthService.ResetPasswordStart,
      onSuccess(_data) {
        addSnack({
          severity: "success",
          message: CODE_SENT_SUCCESS,
        });
      },
      onError(error: ApiError) {
        addSnack({
          severity: "error",
          message: error.status === 404 ? EMAIL_NOT_FOUND : CODE_SENT_ERROR,
        });
      },
    });

  const { mutate: resetPasswordCheck, isPending: isResetPasswordCheckPending } =
    useMutation({
      mutationFn: AuthService.ResetPasswordCheck,
      onSuccess(_data) {
        addSnack({
          severity: "success",
          message: CODE_VERIFIED_SUCCESS,
        });
        router.navigate("/(auth)/forgot-password/password");
      },
      onError(error: ApiError) {
        addSnack({
          severity: "error",
          message:
            error.status === 403
              ? CODE_VERIFIED_ERROR_403
              : CODE_VERIFIED_ERROR,
        });
      },
    });

  const onSubmit = (data: VerificationCodeFormData) => {
    updateForgotPasswordDetails({ code: data.code });
    resetPasswordCheck({ email, code: data.code });
    router.navigate("/(auth)/forgot-password/password");
  };

  return (
    <VerificationCode
      onSubmit={onSubmit}
      email={email}
      resendCode={() => {
        resetPasswordStart({ email });
      }}
      isLoading={isResetPasswordCheckPending || isResetPasswordStartPending}
      buttonText="Next"
    />
  );
};

export default Verification;
