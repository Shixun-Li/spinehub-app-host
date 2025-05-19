import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  TextInput,
  View,
} from "react-native";
import { GlobalStyles } from "@/constants/theme";
import TextInputValidated from "@/components/core/text-input-validated";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import MainButton from "@/components/core/main-button";
import React, { useRef, useState } from "react";
import { changePasswordSchema } from "@/utils/validation-schemas";
import NavigationHeader from "@/components/core/navigation-header";
import SpineHubIcon from "@/assets/svgs/icons/spinehub-icon";
import AppText from "@/components/core/app-text";
import { ChangePasswordFormData } from "@/types/auth";
import ChangePasswordModal from "@/components/profile/change-password-modal";

const ChangePassword = () => {
  const newPasswordRef = useRef<TextInput>(null);
  const newConfirmPasswordRef = useRef<TextInput>(null);
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<ChangePasswordFormData>({
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      newConfirmPassword: "",
    },
    resolver: zodResolver(changePasswordSchema),
  });
  const [isModalVisible, setModalVisible] = useState(false);

  const onSubmit = (data: ChangePasswordFormData) => {
    console.log("Saving Profile:", data); //Note: waiting for backend..
  };

  return (
    <View style={styles.body}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 60 : 20}
      >
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <NavigationHeader logo={<SpineHubIcon />} />
          <View style={styles.textBody}>
            <AppText color="black" fontWeight="semiBold" size={24} multiline>
              Let's set a new password
            </AppText>
            <AppText color="navy800" fontWeight="regular" size={14} multiline>
              Your password must be at least 8 characters and include 1
              numerical value, 1 symbol and 1 upper and lower case character.
            </AppText>
          </View>
          <TextInputValidated
            isPasswordInput
            isForgotPassword={false}
            name="currentPassword"
            label="Current Password"
            inputPlaceholder="Enter Password"
            control={control}
            error={errors.currentPassword?.message}
            onSubmitEditing={() => newPasswordRef.current?.focus()}
            returnKeyType="next"
          />
          <TextInputValidated
            isPasswordInput
            isForgotPassword={false}
            ref={newPasswordRef}
            name="newPassword"
            label="New Password"
            inputPlaceholder="Enter Password"
            control={control}
            error={errors.newPassword?.message}
            onSubmitEditing={() => newConfirmPasswordRef.current?.focus()}
            returnKeyType="next"
          />
          <TextInputValidated
            isPasswordInput
            isForgotPassword={false}
            ref={newConfirmPasswordRef}
            name="newConfirmPassword"
            label="Confirm New Password"
            inputPlaceholder="Enter Password"
            control={control}
            error={errors.newConfirmPassword?.message}
            onSubmitEditing={handleSubmit(() => setModalVisible(true))}
            returnKeyType="done"
          />
        </ScrollView>
      </KeyboardAvoidingView>
      <View style={styles.buttonContainer}>
        <MainButton
          text="Confirm"
          type="primary"
          onPress={handleSubmit(() => setModalVisible(true))}
        />
      </View>
      <ChangePasswordModal
        visible={isModalVisible}
        onClose={() => setModalVisible(false)}
        onConfirm={handleSubmit(onSubmit)}
      />
    </View>
  );
};

export default ChangePassword;

const styles = StyleSheet.create({
  body: {
    flex: 1,
    ...GlobalStyles.defaultPadding,
    justifyContent: "space-between",
  },
  scrollContainer: {
    flexGrow: 1,
    gap: 10,
  },
  textBody: {
    gap: 8,
    marginBottom: 10,
  },
  buttonContainer: {
    height: 60,
  },
});
