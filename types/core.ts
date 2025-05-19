import { StyleProp, ViewStyle } from "react-native";

export type IconBaseProps = {
  style?: StyleProp<ViewStyle>;
  color?: string;
  size?: number;
};

export type SnackbarSeverity = "error" | "success";
