import { StyleSheet, Text, View } from "react-native";
import React from "react";
import LeftChevron from "@/assets/svgs/icons/left-chevron";
import PressableOpacity from "./pressable-opacity";
import { router } from "expo-router";

type Props = {
  title?: string;
  logo?: React.ReactNode;
  style?: any;
  onBackPress?: () => void;
};

const NavigationHeader = ({ title, style, logo, onBackPress }: Props) => {
  return (
    <View style={[style, styles.header]}>
      <PressableOpacity
        onPress={() => (onBackPress ? onBackPress() : router.back())}
        style={{ flex: 1 }}
      >
        <LeftChevron />
      </PressableOpacity>
      {logo && logo}
      {title && <Text style={styles.title}>{title}</Text>}
      <View style={{ flex: 1 }} />
    </View>
  );
};

export default NavigationHeader;

const styles = StyleSheet.create({
  header: {
    paddingVertical: 5,
    flexDirection: "row",
    alignItems: "center",
  },
  title: {
    fontSize: 20,
    flex: 1,
    textAlign: "center",
  },
});
