import SpineHubIcon from "@/assets/svgs/icons/spinehub-icon";
import AppText from "@/components/core/app-text";
import MainButton from "@/components/core/main-button";
import NavigationHeader from "@/components/core/navigation-header";
import SafeAreaView from "@/components/core/safe-area-view";
import TextInputValidated from "@/components/core/text-input-validated";
import {
  APP_HORIZONTAL_PADDING,
  APP_TOKEN,
  REFRESH_TOKEN,
} from "@/constants/primitives";
import { useSnackbarActions } from "@/stores/snackbar-store";
import useUserStore from "@/stores/user-store";
import { SignInFormData } from "@/types/auth";
import { router } from "expo-router";
import { useForm } from "react-hook-form";
import { ScrollView, StyleSheet, TextInput, View } from "react-native";
import { useRef } from "react";
import { signInSchema } from "@/utils/validation-schemas";
import { useMutation } from "@tanstack/react-query";
import { AuthService } from "@/services/auth.service";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  EMAIL_NOT_FOUND,
  GENERIC_ERROR,
  SIGN_IN_SUCCESS,
} from "@/constants/snackbar";
import { ApiError } from "openapi-typescript-fetch";
import { zodResolver } from "@hookform/resolvers/zod";
import CometChatService from "@/services/chat/comet-chat-auth.service";

const SignIn = () => {
  const { setUser } = useUserStore();
  const { addSnack } = useSnackbarActions();

  const passwordRef = useRef<TextInput>(null);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<SignInFormData>({
    defaultValues: {
      email: "",
      password: "",
    },
    resolver: zodResolver(signInSchema),
  });

  const { mutate: SignIn, isPending } = useMutation({
    mutationFn: AuthService.SignIn,
    async onSuccess({ data }) {
      await AsyncStorage.setItem(APP_TOKEN, data.token.accessToken);
      await AsyncStorage.setItem(REFRESH_TOKEN, data.token.refreshToken);
      await setUser(data.user);
      await CometChatService.cometChatLogin(data.user.id).then(() => {
        console.log("comet chat login success");
      });

      addSnack({ severity: "success", message: SIGN_IN_SUCCESS });

      if (router.canDismiss()) router.dismissAll();
      router.replace("/(home)/(tabs)/home");
    },
    onError(error: ApiError) {
      addSnack({
        severity: "error",
        message: error.status === 404 ? EMAIL_NOT_FOUND : GENERIC_ERROR,
      });
    },
  });

  const onSubmit = (data: SignInFormData) => {
    SignIn(data);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView keyboardShouldPersistTaps="handled">
        <NavigationHeader logo={<SpineHubIcon />} />
        <View style={{ gap: 29, paddingVertical: 20 }}>
          <View style={styles.textBody}>
            <AppText color="black" fontWeight="semiBold" size={24} multiline>
              Welcome back!{"\n"}Lets get you in
            </AppText>
            <AppText color="navy800" fontWeight="regular" size={14} multiline>
              Enter your login details below.
            </AppText>
          </View>
          <View style={{ gap: 16 }}>
            <TextInputValidated
              name="email"
              label="Email"
              inputPlaceholder="Enter Email"
              control={control}
              error={errors.email?.message}
              onSubmitEditing={() => passwordRef.current?.focus()}
              returnKeyType="next"
            />
            <TextInputValidated
              ref={passwordRef}
              name="password"
              label="Password"
              inputPlaceholder="Enter Password"
              isPasswordInput
              control={control}
              error={errors.password?.message}
              onSubmitEditing={handleSubmit(onSubmit)}
              returnKeyType="go"
            />
          </View>
        </View>
      </ScrollView>
      <View style={styles.bottomContainer}>
        <MainButton
          text="Sign In"
          onPress={handleSubmit(onSubmit)}
          isDisabled={isPending}
        />
      </View>
    </SafeAreaView>
  );
};

export default SignIn;

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
    gap: 16,
  },
  textContainer: {
    display: "flex",
    flexDirection: "row",
    gap: 4,
    justifyContent: "center",
  },
});
