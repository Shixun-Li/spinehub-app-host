import { StyleSheet, View } from "react-native";
import React from "react";
import MainButton from "@/components/core/main-button";
import {
  APP_HORIZONTAL_PADDING,
  APP_VERTICAL_PADDING,
} from "@/constants/primitives";
import SafeAreaView from "@/components/core/safe-area-view";
import SpineHubIcon from "@/assets/svgs/icons/spinehub-icon";
import { ImageSliderMain } from "@/components/core/auth/slider";
import AppText from "@/components/core/app-text";
import { isSmallDevice } from "@/utils/formator";

const Welcome = () => {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.main}>
        <SpineHubIcon />
        <View style={styles.description}>
          <View style={styles.image}>
            <ImageSliderMain />
          </View>
          <View style={styles.textBody}>
            <AppText
              color="black"
              fontWeight="semiBold"
              size={24}
              multiline
              align="center"
            >
              Seamless communication throughout your surgery
            </AppText>
            <AppText
              color="navy800"
              fontWeight="regular"
              size={14}
              multiline
              align="center"
            >
              Your experts in spine surgery with successful outcome.
            </AppText>
          </View>
        </View>
      </View>

      <View style={styles.buttonContainer}>
        <MainButton text="Sign In" href="/signin" />
      </View>
    </SafeAreaView>
  );
};

export default Welcome;

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: APP_HORIZONTAL_PADDING,
    paddingVertical: APP_VERTICAL_PADDING,
    flex: 1,
    justifyContent: "space-between",
    marginVertical: 20,
  },
  description: {
    gap: 20,
    alignItems: "center",
  },
  textBody: {
    paddingHorizontal: 10,
    gap: 20,
  },
  image: {
    width: "100%",
    height: isSmallDevice ? 350 : 440,
    borderRadius: 10,
    overflow: "hidden",
  },
  main: {
    alignItems: "center",
    gap: 20,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 8,
  },
});
