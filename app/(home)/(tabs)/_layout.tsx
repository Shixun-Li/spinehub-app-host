import BottomTabBar from "@/components/core/bottom-tab-bar";
import SafeAreaView from "@/components/core/safe-area-view";
import { COLORS } from "@/constants/theme";
import { Stack } from "expo-router";
import { StatusBar, StyleSheet } from "react-native";

export default function HomeLayout() {
  return (
    <>
      <StatusBar barStyle="dark-content" />
      <SafeAreaView style={styles.container}>
        <Stack
          screenOptions={{
            headerShown: false,
            contentStyle: { backgroundColor: COLORS.smoke1000 },
            animation: "none",
          }}
        />
        <BottomTabBar />
      </SafeAreaView>
    </>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
