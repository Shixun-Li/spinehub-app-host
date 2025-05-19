import AppActiveIcon from "@/assets/svgs/icons/app-active-icon";
import AppInactiveIcon from "@/assets/svgs/icons/app-incative-icon";
import { COLORS } from "@/constants/theme";
import React from "react";
import { View, StyleSheet } from "react-native";

type Props = { status: string };

const AppIconSwitch = ({ status }: Props) => {
  if (status === "PendingInvite" || status === "EmailSent") {
    return (
      <View style={[styles.iconWrapper, styles.inactiveBackground]}>
        <AppInactiveIcon />
      </View>
    );
  }

  if (status === "Completed") {
    return (
      <View style={[styles.iconWrapper, styles.activeBackground]}>
        <AppActiveIcon />
      </View>
    );
  }

  return null;
};

export default AppIconSwitch;

const styles = StyleSheet.create({
  iconWrapper: {
    width: 44,
    height: 44,
    borderRadius: 22,
    paddingLeft: 9,
    paddingTop: 9,
  },
  inactiveBackground: {
    backgroundColor: COLORS.navy50,
  },
  activeBackground: {
    backgroundColor: COLORS.green200,
  },
});
