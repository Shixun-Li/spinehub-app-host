import React, { forwardRef, Ref, useState } from "react";
import { Control, useController } from "react-hook-form";
import {
  ReturnKeyTypeOptions,
  StyleProp,
  StyleSheet,
  TextInput,
  TextStyle,
  View,
  ViewStyle,
} from "react-native";
import AppText from "./app-text";
import PressableOpacity from "./pressable-opacity";
import PasswordEyeHiddenIcon from "@/assets/svgs/icons/password-eye-hidden";
import PasswordEyeIcon from "@/assets/svgs/icons/password-eye";
import { COLORS } from "@/constants/theme";
import { router } from "expo-router";

type Props = {
  name: string;
  control: Control<any>;
  label?: string;
  inputPlaceholder?: string;
  containerStyle?: StyleProp<ViewStyle>;
  inputContainerStyle?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
  labelStyle?: StyleProp<TextStyle>;
  error?: string;
  isEditable?: boolean;
  isPasswordInput?: boolean;
  inputStyle?: StyleProp<TextStyle>;
  isMultiLine?: boolean;
  shouldAutocapitalise?: boolean;
  returnKeyType?: ReturnKeyTypeOptions;
  isForgotPassword?: boolean;
  keyboardType?:
    | "default"
    | "email-address"
    | "numeric"
    | "phone-pad"
    | "number-pad"
    | "decimal-pad";
  onSubmitEditing?: () => void;
};

const TextInputValidated = forwardRef(
  (
    {
      name,
      control,
      label,
      inputPlaceholder,
      containerStyle,
      inputContainerStyle,
      error,
      isEditable,
      isPasswordInput,
      inputStyle,
      labelStyle,
      shouldAutocapitalise,
      isMultiLine,
      returnKeyType,
      keyboardType,
      onSubmitEditing,
      isForgotPassword = true,
    }: Props,
    ref: Ref<TextInput>
  ) => {
    const [isPassword, setIsPassword] = useState<boolean>(
      isPasswordInput ? true : false
    );
    const { field } = useController({ name, control });

    return (
      <View style={[containerStyle, { marginBottom: error ? 0 : 10, gap: 8 }]}>
        {label && (
          <AppText
            style={labelStyle}
            color="navy1000"
            fontWeight="semiBold"
            size={14}
          >
            {label}
          </AppText>
        )}
        <View
          style={[
            inputContainerStyle,
            styles.inputContainer,
            error ? styles.errorBorder : null,
          ]}
        >
          <TextInput
            ref={ref}
            value={field.value}
            multiline={isMultiLine}
            style={[styles.inputText, inputStyle]}
            editable={isEditable}
            secureTextEntry={isPassword}
            autoCapitalize={shouldAutocapitalise ? "words" : "none"}
            placeholderTextColor={COLORS.navy400}
            keyboardType={keyboardType ? keyboardType : "default"}
            onChangeText={field.onChange}
            placeholder={inputPlaceholder}
            returnKeyType={returnKeyType}
            onSubmitEditing={onSubmitEditing}
          />
          {isPasswordInput && (
            <PressableOpacity onPress={() => setIsPassword(!isPassword)}>
              <View style={styles.passwordIcon}>
                {isPassword ? <PasswordEyeHiddenIcon /> : <PasswordEyeIcon />}
              </View>
            </PressableOpacity>
          )}
        </View>
        {error && (
          <AppText
            size={12}
            color="red"
            align="right"
            fontWeight="light"
            style={styles.errorMessage}
          >{`* ${error}`}</AppText>
        )}
        {isPasswordInput && isForgotPassword && (
          <PressableOpacity
            onPress={() => router.navigate("/(auth)/forgot-password/email")}
          >
            <AppText color="navy600" size={12} align="right">
              Forgot Password?
            </AppText>
          </PressableOpacity>
        )}
      </View>
    );
  }
);

TextInputValidated.displayName = "TextInputValidated";

export default TextInputValidated;

const styles = StyleSheet.create({
  inputContainer: {
    backgroundColor: COLORS.navy50,
    borderRadius: 8,
    paddingVertical: 4,
    alignItems: "center",
    flexDirection: "row",
  },
  errorMessage: {
    width: "100%",
    marginTop: 4,
    textAlign: "right",
    fontSize: 12,
    color: COLORS.red,
    marginBottom: 4,
  },
  inputText: {
    color: COLORS.navy1000,
    height: 53,
    paddingHorizontal: 8,
    borderRadius: 8,
    flex: 1,
  },
  errorBorder: {
    borderWidth: 1,
    borderColor: COLORS.red,
  },
  passwordIcon: {
    paddingHorizontal: 10,
  },
});
