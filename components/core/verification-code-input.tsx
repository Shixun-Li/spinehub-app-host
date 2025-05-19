import { COLORS } from "@/constants/theme";
import React, { useRef, useState } from "react";
import {
  Keyboard,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

type Props = {
  value: string;
  setValue: (value: string) => void;
};

const VerificationCodeInput = ({ value, setValue }: Props) => {
  const inputRef = useRef<TextInput>(null);
  const [inputIsFocused, setInputIsFocused] = useState(true);
  return (
    <Pressable
      style={styles.container}
      onPress={() => {
        inputRef.current?.focus();
        setInputIsFocused(true);
      }}
    >
      <TextInput
        style={styles.input}
        keyboardType="number-pad"
        maxLength={6}
        ref={inputRef}
        value={value}
        onBlur={() => setInputIsFocused(false)}
        onChange={(e) => {
          if (e.nativeEvent.text.length > 6)
            setValue(e.nativeEvent.text.slice(0, 6));

          if (e.nativeEvent.text.length === 6) Keyboard.dismiss();

          setValue(e.nativeEvent.text);
        }}
        autoFocus={true}
      />
      {Array.from(Array(6)).map((_, index) => (
        <View
          key={index}
          style={[
            styles.box,
            value.length === index && inputIsFocused && styles.boxFocus,
          ]}
        >
          <Text style={styles.boxText}>{value[index] || ""}</Text>
        </View>
      ))}
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    marginTop: 10,
    marginBottom: 20,
  },
  box: {
    width: 54,
    height: 54,
    backgroundColor: COLORS.greyLight,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "transparent",
    borderRadius: 6,
  },
  boxText: {
    fontSize: 24,
    color: COLORS.blue,
  },
  boxFocus: {
    borderColor: COLORS.blue,
  },
  input: {
    position: "absolute",
    top: 0,
    right: 0,
    left: 0,
    bottom: 0,
    opacity: 0,
  },
});

export default VerificationCodeInput;
