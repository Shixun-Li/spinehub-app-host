import React from "react";
import { View, Pressable, StyleSheet } from "react-native";
import Animated, {
  LinearTransition,
  FadeIn,
  FadeOut,
  ZoomIn,
  ZoomOut,
} from "react-native-reanimated";
import { COLORS } from "@/constants/theme";
import { PatientDetailsTab } from "@/types/types";
import { patientDetailsTab } from "@/constants/tabs";
import { PatientDetailsTabEnum } from "@/types/\benum";

type PatientDetailTabProps = {
  PatientDetailTab: PatientDetailsTabEnum;
  setPatientDetailTab: (tab: PatientDetailsTabEnum) => void;
};
const PatientDetailTab = ({
  PatientDetailTab,
  setPatientDetailTab,
}: PatientDetailTabProps) => {
  return (
    <View style={styles.tabContainer}>
      {patientDetailsTab.map((tabKey: PatientDetailsTab) => {
        const tabValue = PatientDetailsTabEnum[tabKey];
        return (
          <Pressable
            key={tabKey}
            style={styles.tabItem}
            onPress={() => setPatientDetailTab(tabValue)}
          >
            {PatientDetailTab === tabValue && (
              <Animated.View
                layout={LinearTransition.springify()}
                entering={ZoomIn.springify().damping(15)}
                exiting={ZoomOut.springify().damping(15)}
                style={styles.activeBackground}
              />
            )}
            <Animated.Text
              style={[
                styles.tabText,
                PatientDetailTab === tabValue
                  ? styles.activeTabText
                  : styles.inactiveTabText,
              ]}
              entering={FadeIn.duration(200)}
              exiting={FadeOut.duration(200)}
            >
              {tabValue}
            </Animated.Text>
          </Pressable>
        );
      })}
    </View>
  );
};

export default PatientDetailTab;

const styles = StyleSheet.create({
  tabContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.navy50,
    borderRadius: 8,
    padding: 2,
    height: 34,
  },
  tabItem: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    height: "100%",
  },
  activeBackground: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: COLORS.smoke1000,
    borderRadius: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },
  tabText: {
    zIndex: 1,
    fontSize: 14,
    fontWeight: "500",
    textAlign: "center",
  },
  activeTabText: {
    color: COLORS.navy1000,
    fontWeight: "500",
    fontSize: 12,
  },
  inactiveTabText: {
    color: COLORS.navy600,
    fontWeight: "500",
    fontSize: 12,
  },
});
