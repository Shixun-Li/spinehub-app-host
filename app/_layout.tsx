import HideKeyboardView from "@/components/core/hide-keyboard-view";
import { COLORS } from "@/constants/theme";
import { Stack } from "expo-router";
import { StatusBar } from "react-native";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Snackbar from "@/components/core/snackbar";

const queryClient = new QueryClient();

export default function RootLayout() {
  return (
    <QueryClientProvider client={queryClient}>
      <StatusBar barStyle="dark-content" />
      <HideKeyboardView>
        <Stack
          screenOptions={{
            headerShown: false,
            contentStyle: { backgroundColor: COLORS.smoke1000 },
          }}
        />
        <Snackbar />
      </HideKeyboardView>
    </QueryClientProvider>
  );
}
