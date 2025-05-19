import { KeyboardAvoidingView, StyleSheet, View } from "react-native";
import React from "react";
import TextInputValidated from "@/components/core/text-input-validated";
import { useForm } from "react-hook-form";
import MainButton from "@/components/core/main-button";
import Animated, { FadeIn, FadeOut } from "react-native-reanimated";
import AppText from "@/components/core/app-text";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { router } from "expo-router";
import { ApiError } from "openapi-typescript-fetch/types";
import { useSnackbarActions } from "@/stores/snackbar-store";
import { ACCOUNT_CREATED_SUCCESS } from "@/constants/snackbar";

const schema = z
  .object({
    password: z
      .string()
      .min(8)
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/
      ),
    confirmPassword: z
      .string()
      .min(8)
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/
      ),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "Passwords do not match",
  });

const PasswordStep = ({ userId, token }: { userId: string; token: string }) => {
  const { addSnack } = useSnackbarActions();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  const { mutate: userSignUp } = useMutation({
    mutationFn: async (data: z.infer<typeof schema>) => {
      const response = await fetch(
        `${process.env.EXPO_PUBLIC_API_URL}/api/v1/user-invitation/user/${userId}/signup`,
        {
          method: "PUT",
          body: JSON.stringify({
            password: data.password,
          }),
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const json = await response.json();
      if (!response.ok) {
        const error = new Error(json.message || "Unknown error");
        (error as any).data = json;
        throw error;
      }
      return json;
    },
    onSuccess: () => {
      addSnack({
        severity: "success",
        message: ACCOUNT_CREATED_SUCCESS,
      });
      router.push("/(auth)/signin");
    },
    onError: (error: ApiError) => {
      console.log("here", error.data.data.message[0]);
      addSnack({
        severity: "error",
        message: error.data.data.message[0],
      });
    },
  });

  const onSubmit = (data: z.infer<typeof schema>) => {
    userSignUp(data);
  };

  return (
    <Animated.View entering={FadeIn} exiting={FadeOut} style={styles.container}>
      <KeyboardAvoidingView style={styles.content} behavior="padding">
        <View>
          <View style={{ gap: 10, paddingBottom: 20 }}>
            <AppText fontWeight="semiBold" size={24}>
              Lets secure your account
            </AppText>
            <AppText fontWeight="regular" size={14} color="navy800">
              Your password must be at least 8 characters and include 1
              numerical value, 1symbol and 1 upper and lower case character.
            </AppText>
          </View>

          <TextInputValidated
            name="password"
            label="Password"
            control={control}
            inputPlaceholder="Enter Password"
            error={errors.password?.message}
            isPasswordInput
            isForgotPassword={false}
          />

          <TextInputValidated
            name="confirmPassword"
            label="Confirm Password"
            control={control}
            inputPlaceholder="Enter Password"
            error={errors.confirmPassword?.message}
            isPasswordInput
            isForgotPassword={false}
          />
        </View>
      </KeyboardAvoidingView>
      <View style={styles.buttonContainer}>
        <MainButton text="Complete" onPress={handleSubmit(onSubmit)} />
      </View>
    </Animated.View>
  );
};

export default PasswordStep;

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
