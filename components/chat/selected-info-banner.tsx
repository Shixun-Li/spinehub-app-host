import React from "react";
import { View, StyleSheet } from "react-native";
import AppText from "../core/app-text";

interface Props {
  type: "Document" | "Photo" | null;
  hasData: boolean;
}

const SelectedInfoBanner = ({ type, hasData }: Props) => {
  if (!hasData) return null;

  return (
    <View style={styles.container}>
      <AppText size={12} fontWeight="semiBold" color="lightBlue1000">
        {type === "Document" ? "📄 File Selected!" : "🖼️ Photo Selected!"}
      </AppText>
    </View>
  );
};

export default SelectedInfoBanner;

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    marginTop: 8,
  },
});
