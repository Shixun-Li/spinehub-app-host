import React from "react";
import { View, StyleSheet } from "react-native";
import AppText from "@/components/core/app-text";
type Props = {
  title: string;
  text: string;
};

const DetailText = ({ title, text }: Props) => {
  return (
    <View style={styles.row}>
      <AppText size={14} fontWeight="semiBold" style={styles.title}>
        {title}
      </AppText>
      <AppText
        size={14}
        fontWeight="medium"
        color="navy600"
        style={styles.text}
      >
        {text}
      </AppText>
    </View>
  );
};

export default DetailText;

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 16,
    marginBottom: 8,
  },
  title: {
    width: 136,
  },
  text: {
    flex: 1,
  },
});
