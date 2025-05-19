import { Patient } from "@/types/backend-types";
import React from "react";
import { View, Text, StyleSheet } from "react-native";
import AppIconSwitch from "./app-icon-switch";
import { COLORS } from "@/constants/theme";
import AppText from "../core/app-text";

interface Props {
  patient?: Patient;
}

const UserCard = ({ patient }: Props) => {
  return (
    <View style={styles.container}>
      {patient ? (
        <>
          <View style={styles.userInfo}>
            <View style={styles.avatar} />
            <View style={styles.textContainer}>
              <AppText color="navy1000" size={14} fontWeight="semiBold">
                {patient?.user.firstName ?? "Unknown"}{" "}
                {patient?.user.lastName ?? "User"}
              </AppText>
              <AppText color="navy600" size={12} fontWeight="medium">
                Patient
              </AppText>
            </View>
          </View>
          <AppIconSwitch status={patient?.user.status ?? "Unknown"} />
        </>
      ) : (
        <Text style={styles.errorText}>No User Data</Text>
      )}
    </View>
  );
};

export default UserCard;

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: COLORS.navy50,
  },

  userInfo: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 30,
    backgroundColor: COLORS.lightBlue100,
  },
  textContainer: {
    marginTop: 4,
    flexDirection: "column",
    gap: 2,
  },

  errorText: {
    color: "red",
  },
});
