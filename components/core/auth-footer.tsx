import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { Link } from "expo-router";
import { TYPOGRAPHY_STYLES } from "@/constants/theme";

type Props = {
  currentScreen: "signup" | "signin";
};

const AuthFooter = ({ currentScreen }: Props) => {
  return (
    <View style={styles.container}>
      {currentScreen === "signup" ? (
        <>
          <Text style={TYPOGRAPHY_STYLES.body}>Already have an account?</Text>
          <Link href={"/(auth)/signin"}>
            <Text style={TYPOGRAPHY_STYLES.link}>Sign in here</Text>
          </Link>
        </>
      ) : (
        <>
          <Text style={TYPOGRAPHY_STYLES.body}>Don't have an account?</Text>
          <Link href={"/(auth)/signup"}>
            <Text style={TYPOGRAPHY_STYLES.link}>Create one here</Text>
          </Link>
        </>
      )}
    </View>
  );
};

export default AuthFooter;

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 5,
  },
});
