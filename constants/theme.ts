import { TextStyle, ViewStyle } from "react-native";
import { APP_HORIZONTAL_PADDING, APP_VERTICAL_PADDING } from "./primitives";

export const COLORS = {
  smoke1000: "#EDEDED",
  smoke600: "rgba(237, 237, 237, 0.60)",
  smoke100: "rgba(237, 237, 237, 0.10)",
  lightBlue1000: "#4A65BC",
  lightBlue100: "rgba(74, 101, 188, 0.10)",
  black: "#000000",
  grey: "#808080",
  navy1000: "#121B36",
  navy800: "rgba(18, 27, 54, 0.80)",
  navy600: "rgba(18, 27, 54, 0.60)",
  navy400: "rgba(18, 27, 54, 0.40)",
  navy200: "rgba(18, 27, 54, 0.20)",
  navy100: "rgba(18, 27, 54, 0.10)",
  navy50: "rgba(18, 27, 54, 0.05)",
  greyLight: "#f0f0f0",
  white: "#ffffff",
  blue: "#0000ff",
  red: "#ff0000",
  green: "#229c63",
  delete: "#AC3737",
  yellow1000: "#D3AD4D",
  yellow100: "rgba(211, 173, 77, 0.10)",
  pink100: "rgba(188, 74, 129, 0.10)",
  green100: "rgba(53, 170, 129, 0.10)",
  green200: "rgba(53, 170, 129, 0.20)",
  green1000: "#35AA81",
  red10: "rgba(211, 77, 101, 0.10)",
  red1000: "#D34D65",
  white1000: "#EDEDED",
  charcoal100: "rgb(238, 214, 214)",
};

export const Typography = {
  light: {
    fontFamily: "Montserrat-Light",
  },
  medium: {
    fontFamily: "Montserrat-Medium",
  },
  regular: {
    fontFamily: "Montserrat-Regular",
  },
  semiBold: {
    fontFamily: "Montserrat-SemiBold",
  },
  bold: {
    fontFamily: "Montserrat-Bold",
  },
  black: {
    fontFamily: "Montserrat-Black",
  },
} satisfies Record<string, TextStyle>;

export const TYPOGRAPHY_STYLES = {
  header: {
    fontFamily: "SpaceMono-Regular",
    fontSize: 24,
    color: COLORS.black,
  },
  subheader: {
    fontFamily: "SpaceMono-Regular",
    fontSize: 20,
  },
  body: {
    fontFamily: "SpaceMono-Regular",
    fontSize: 16,
  },
  link: {
    fontFamily: "SpaceMono-Regular",
    fontSize: 16,
    color: COLORS.blue,
    textDecorationLine: "underline",
  },
} satisfies Record<string, TextStyle>;

export const GlobalStyles = {
  defaultPadding: {
    paddingVertical: APP_VERTICAL_PADDING,
    paddingHorizontal: APP_HORIZONTAL_PADDING,
  },
} satisfies Record<string, ViewStyle>;
