import { StyleSheet, TouchableOpacity, View } from "react-native";
import React from "react";
import AlertIcon from "@/assets/svgs/icons/alert-icon";
import AppText from "./app-text";
import BackButtonIcon from "@/assets/svgs/icons/back-button-icon";
import { router } from "expo-router";

type Props = {
  title?: string;
  withBackButton?: boolean;
  route?: string;
};

const HomeHeader = ({
  title = "Calendar",
  withBackButton = false,
  route,
}: Props) => {
  const handleBack = () => {
    if (route) {
      router.replace(route as Parameters<typeof router.replace>[0]);
    } else {
      router.back();
    }
  };

  return (
    <View style={styles.header}>
      <View style={styles.withButton}>
        {withBackButton && (
          <TouchableOpacity onPress={handleBack}>
            <BackButtonIcon />
          </TouchableOpacity>
        )}
        <AppText
          color="navy1000"
          fontWeight="semiBold"
          size={24}
          align="center"
        >
          {title}
        </AppText>
      </View>
      {!withBackButton && <AlertIcon />}
    </View>
  );
};

export default HomeHeader;

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingBottom: 20,
    paddingHorizontal: 5,
  },
  withButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
});
