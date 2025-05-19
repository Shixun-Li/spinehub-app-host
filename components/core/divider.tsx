import React from "react";
import { View, StyleSheet } from "react-native";
import AppText from "@/components/core/app-text";
import { COLORS } from "@/constants/theme";

type DividerProps = {
  text: string;
};

const Divider = ({ text }: DividerProps) => {
  return (
    <View style={styles.lineContainer}>
      <AppText size={12} color="navy600" fontWeight="semiBold">
        {text}
      </AppText>
      <View style={styles.line} />
    </View>
  );
};

export default Divider;

const styles = StyleSheet.create({
  line: {
    flex: 1,
    height: 1,
    backgroundColor: COLORS.navy200,
    marginLeft: 8,
    marginRight: 8,
  },
  lineContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 4,
  },
});
