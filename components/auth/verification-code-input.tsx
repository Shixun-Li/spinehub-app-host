import React, { useEffect, useRef, useState } from "react";
import { Control, useController } from "react-hook-form";
import {
  Keyboard,
  Pressable,
  StyleProp,
  StyleSheet,
  TextInput,
  TextStyle,
  View,
} from "react-native";
import AppText from "../core/app-text";
import PressableOpacity from "../core/pressable-opacity";
import { COLORS } from "@/constants/theme";

type Props = {
  name: string;
  control: Control<any>;
  error: string | undefined;
  label?: string;
  labelStyle?: StyleProp<TextStyle>;
  resendCode: () => void;
};

const VerificationCodeInput = ({
  name,
  label,
  control,
  error,
  labelStyle,
  resendCode,
}: Props) => {
  const inputRef = useRef<TextInput>(null);
  const [inputIsFocused, setInputIsFocused] = useState(false);

  const { field } = useController({ name, control });

  useEffect(() => {
    inputRef.current?.focus();
    setInputIsFocused(true);
  }, []);

  return (
    <View>
      <View style={{ marginBottom: 10 }}>
        {label && (
          <AppText
            color="navy1000"
            size={14}
            fontWeight="semiBold"
            style={[styles.labelText, labelStyle]}
          >
            {label}
          </AppText>
        )}
        <Pressable
          style={styles.container}
          onPress={() => {
            field.onChange("");
            inputRef.current?.focus();
            setInputIsFocused(true);
          }}
        >
          <TextInput
            style={styles.hiddenInput}
            keyboardType="number-pad"
            maxLength={6}
            ref={inputRef}
            value={field.value}
            onBlur={() => setInputIsFocused(false)}
            onChangeText={(text) => {
              const newValue = text.slice(0, 6);
              field.onChange(newValue);

              if (newValue.length === 6) Keyboard.dismiss();
            }}
            autoFocus={true}
          />
          {Array.from(Array(6)).map((_, index) => (
            <View
              key={index}
              style={[
                styles.box,
                field.value.length === index &&
                  inputIsFocused &&
                  styles.boxFocus,
              ]}
            >
              <AppText
                size={25}
                fontWeight="semiBold"
                color={field.value[index] ? "navy1000" : "navy400"}
              >
                {field.value[index] ?? "0"}
              </AppText>
            </View>
          ))}
        </Pressable>
        {error && (
          <AppText
            size={12}
            color="red"
            align="right"
            fontWeight="light"
            style={styles.errorMessage}
          >{`* ${error}`}</AppText>
        )}
      </View>
      <View
        style={{ flexDirection: "row", gap: 5, justifyContent: "flex-start" }}
      >
        <AppText size={12} color="navy400">
          Didn&#39;t receive it?
        </AppText>
        <PressableOpacity onPress={resendCode}>
          <AppText size={12} color="navy1000">
            Send again
          </AppText>
        </PressableOpacity>
      </View>
    </View>
  );
};
export default VerificationCodeInput;

const styles = StyleSheet.create({
  container: {
    display: "flex",
    flexDirection: "row",
    width: "100%",
    justifyContent: "space-between",
  },
  box: {
    width: 53,
    height: 53,
    backgroundColor: COLORS.navy50,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 6,
  },
  boxFocus: {
    backgroundColor: COLORS.navy50,
    borderColor: COLORS.lightBlue1000,
    borderWidth: 2,
  },
  hiddenInput: {
    position: "absolute",
    opacity: 0,
  },
  labelText: {
    paddingBottom: 5,
  },
  errorMessage: {
    width: "100%",
    marginTop: 8,
  },
});
