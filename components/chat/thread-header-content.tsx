import React from "react";
import { View, TouchableOpacity, StyleSheet } from "react-native";
import AppText from "@/components/core/app-text";
import BackButtonIcon from "@/assets/svgs/icons/back-button-icon";
import AssignmentIcon from "@/assets/svgs/icons/assignment-icon";
import { COLORS } from "@/constants/theme";
import { Shadow } from "react-native-shadow-2";
import PressableOpacity from "../core/pressable-opacity";
import { router } from "expo-router";

type Props = {
  title: string;
  onBack: () => void;
  selectedGroup: string;
  patientId: string;
};

const ThreadHeaderContent = ({
  title,
  onBack,
  selectedGroup,
  patientId,
}: Props) => {
  return (
    <Shadow
      distance={10}
      offset={[0, 4]}
      startColor={COLORS.navy50}
      containerStyle={{ marginBottom: 16 }}
      style={{ width: "100%" }}
    >
      <View style={styles.container}>
        <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
          <TouchableOpacity onPress={onBack}>
            <BackButtonIcon />
          </TouchableOpacity>
          <View>
            <AppText size={14} fontWeight="semiBold">
              {selectedGroup}
            </AppText>
            <AppText size={12} fontWeight="medium" color="navy600">
              {title} Chat
            </AppText>
          </View>
        </View>
        <PressableOpacity
          style={{ gap: 8, flexDirection: "row" }}
          onPress={() =>
            router.push({
              pathname: "/(home)/(threadId)/(patientId)",
              params: { patientId },
            })
          }
        >
          <View style={styles.iconContainer}>
            <AssignmentIcon />
          </View>
        </PressableOpacity>
      </View>
    </Shadow>
  );
};

export default ThreadHeaderContent;

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 16,
    backgroundColor: COLORS.navy50,
    borderRadius: 8,
  },
  iconContainer: {
    width: 34,
    height: 34,
    borderRadius: 999,
    backgroundColor: COLORS.lightBlue1000,
    justifyContent: "center",
    alignItems: "center",
    padding: 8,
  },
});
