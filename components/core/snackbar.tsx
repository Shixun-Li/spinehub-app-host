import {
  Dimensions,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React from "react";
import { useSnackbarActions, useSnacks } from "@/stores/snackbar-store";
import Animated, { FadeInUp, FadeOutDown } from "react-native-reanimated";
import { COLORS } from "@/constants/theme";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const Snackbar = () => {
  const snacks = useSnacks();
  const { removeSnack } = useSnackbarActions();

  const renderSnacks = () => {
    return snacks.map((snack, index) => {
      return (
        <Animated.View
          entering={FadeInUp}
          exiting={FadeOutDown}
          style={[styles.snack, styles.shadow]}
          key={index}
        >
          <View
            style={[
              styles.severityBar,
              {
                backgroundColor:
                  snack.severity === "error" ? COLORS.red : COLORS.green,
              },
            ]}
          />
          <View style={styles.snackContent}>
            <Text style={styles.snackText}>{snack.message}</Text>
            <TouchableOpacity onPress={() => removeSnack(snack)}>
              <Text>X</Text>
            </TouchableOpacity>
          </View>
        </Animated.View>
      );
    });
  };

  const { top } = useSafeAreaInsets();
  if (!snacks.length) return null;

  return (
    <View style={[styles.snackbarContainer, { top: top }]}>
      {renderSnacks()}
    </View>
  );
};

export default Snackbar;

const styles = StyleSheet.create({
  snackbarContainer: {
    position: "absolute",
    width: Dimensions.get("screen").width,
    top: 0,
    alignItems: "center",
    paddingBottom: 10,
    paddingTop: 10,
  },
  shadow: {
    shadowColor: COLORS.black,
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.15,
    shadowRadius: 5,
    elevation: 10,
  },
  snack: {
    width: "80%",
    backgroundColor: COLORS.white,
    flexDirection: "row",
    alignItems: "center",
  },
  snackText: {
    textAlign: "center",
    color: COLORS.navy1000,
  },
  severityBar: {
    width: 3,
    height: "100%",
  },
  snackContent: {
    width: "100%",
    paddingHorizontal: 15,
    paddingVertical: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
});
