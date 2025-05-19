if (__DEV__) {
  require("../ReactotronConfig");
}
import { StyleSheet } from "react-native";
import React, { useCallback, useEffect, useState } from "react";
import { SplashScreen, router } from "expo-router";
import { useFonts } from "expo-font";
import {
  APP_HORIZONTAL_PADDING,
  APP_TOKEN,
  REFRESH_TOKEN,
} from "@/constants/primitives";
import Animated, { FadeIn } from "react-native-reanimated";
import SpineHubLogo from "@/assets/svgs/spinehub-logo";
import { SPLASH_FADE_IN_DURATION } from "@/constants/animations";
import SafeAreaView from "@/components/core/safe-area-view";
import useUserStore from "@/stores/user-store";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { AuthService } from "@/services/auth.service";
import { refresh } from "@/utils/fetcher";
import CometChatService from "@/services/chat/comet-chat-auth.service";

const Index = () => {
  const { user, setUser } = useUserStore();
  const [appIsReady, setAppIsReady] = useState(false);

  const [fontsLoaded, fontError] = useFonts({
    "Montserrat-Black": require("@/assets/fonts/Montserrat-Black.ttf"),
    "Montserrat-Bold": require("@/assets/fonts/Montserrat-Bold.ttf"),
    "Montserrat-SemiBold": require("@/assets/fonts/Montserrat-SemiBold.ttf"),
    "Montserrat-Regular": require("@/assets/fonts/Montserrat-Regular.ttf"),
    "Montserrat-Light": require("@/assets/fonts/Montserrat-Light.ttf"),
    "Montserrat-Medium": require("@/assets/fonts/Montserrat-Medium.ttf"),
  });

  const prepareApp = useCallback(async () => {
    try {
      const token = await AsyncStorage.getItem(APP_TOKEN);
      if (token) {
        try {
          const token = await AsyncStorage.getItem(APP_TOKEN);
          const refreshToken = await AsyncStorage.getItem(REFRESH_TOKEN);
          if (token || refreshToken) {
            refresh();
            const { data: userData } = await AuthService.GetMe({});
            setUser(userData);
          }
        } catch (error) {
          await AsyncStorage.removeItem(APP_TOKEN);
        }
      }
    } catch (error) {
      console.error("⚠️ Error loading app:", error);
    } finally {
      setAppIsReady(true);
    }
  }, [setUser]);

  useEffect(() => {
    prepareApp();
  }, [prepareApp]);

  useEffect(() => {
    if ((fontsLoaded || fontError) && appIsReady) {
      SplashScreen.hideAsync().finally(() => {
        if (user) router.replace("/(home)/(tabs)/home");
        else router.replace("/(auth)");
      });
    }
  }, [fontsLoaded, fontError, appIsReady, user]);

  useEffect(() => {
    CometChatService.initializeCometChat();
  }, []);

  if (!appIsReady || (!fontsLoaded && !fontError)) return null;

  return (
    <SafeAreaView style={styles.container}>
      <Animated.View entering={FadeIn.duration(SPLASH_FADE_IN_DURATION)}>
        <SpineHubLogo />
      </Animated.View>
    </SafeAreaView>
  );
};

export default Index;

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: APP_HORIZONTAL_PADDING,
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#121B36",
  },
});
