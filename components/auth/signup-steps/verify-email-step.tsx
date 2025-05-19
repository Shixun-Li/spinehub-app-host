import React, { useState } from "react";
import Animated, { FadeIn, FadeOut } from "react-native-reanimated";
import { StyleSheet, Text, View } from "react-native";
import { COLORS, TYPOGRAPHY_STYLES } from "@/constants/theme";
import VerificationCodeInput from "@/components/core/verification-code-input";
import MainButton from "@/components/core/main-button";

type Props = {
  onSubmit: (code: string) => void;
  isCheckingVerification: boolean;
};
const VerificationStep = ({ onSubmit, isCheckingVerification }: Props) => {
  const [code, setCode] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = () => {
    if (code.length < 6) setError("The code you entered is too short");
    else if (code.match(/\D/)) setError("The code must contain only numbers");
    else {
      setError("");
      onSubmit(code);
    }
  };

  return (
    <Animated.View entering={FadeIn} exiting={FadeOut} style={styles.container}>
      <View style={{ gap: 10 }}>
        <Text style={TYPOGRAPHY_STYLES.header}>
          We just sent you a 6 digit code via email. Enter this to continue.
        </Text>
        <VerificationCodeInput value={code} setValue={setCode} />
        {error && <Text style={styles.errorMessage}>{error}</Text>}
      </View>
      <MainButton
        text="Continue"
        onPress={handleSubmit}
        isLoading={isCheckingVerification}
      />
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    display: "flex",
    justifyContent: "space-between",
    paddingVertical: 40,
  },
  errorMessage: {
    width: "100%",
    textAlign: "right",
    fontSize: 12,
    color: COLORS.red,
    marginBottom: 4,
  },
});

export default VerificationStep;
