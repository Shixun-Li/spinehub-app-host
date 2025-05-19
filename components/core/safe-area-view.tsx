import { Platform, View, ViewProps } from "react-native";
import React from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const SafeAreaView = (props: ViewProps) => {
  const insets = useSafeAreaInsets();
  return (
    <View
      {...props}
      style={[
        props.style,
        { paddingTop: insets.top, flex: 1 },

        Platform.OS === "android"
          ? { paddingBottom: insets.bottom + 12 }
          : { paddingBottom: insets.bottom },
      ]}
    >
      {props.children}
    </View>
  );
};

export default SafeAreaView;
