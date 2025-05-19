import { COLORS } from "@/constants/theme";
import { cva } from "class-variance-authority";

export const statusBgColorVariant = cva("", {
  variants: {
    status: {
      Contemplating: COLORS.lightBlue100,
      Tentative: COLORS.yellow1000,
      Confirmed: COLORS.lightBlue1000,
      Finalised: COLORS.green100,
      Cancelled: COLORS.navy600,
      InOR: COLORS.green1000,
      Closing: COLORS.red10,
      Discharge: COLORS.red1000,
    },
  },
  defaultVariants: {
    status: "Contemplating",
  },
});

export const statusTextColorVariant = cva("", {
  variants: {
    status: {
      Contemplating: "lightBlue1000",
      Tentative: "smoke1000",
      Confirmed: "smoke1000",
      Finalised: "green1000",
      Cancelled: "smoke1000",
      InOR: "smoke1000",
      Closing: "red1000",
      Discharge: "smoke1000",
    },
  },
  defaultVariants: {
    status: "Contemplating",
  },
});

export const getBackgroundColorWithOpacity = (
  hex: string,
  opacity: number = 0.1
) => {
  const hexWithoutHash = hex.replace("#", "");
  const bigint = parseInt(hexWithoutHash, 16);

  const r = (bigint >> 16) & 255;
  const g = (bigint >> 8) & 255;
  const b = bigint & 255;

  return `rgba(${r}, ${g}, ${b}, ${opacity})`;
};

export const statusLightBgColor = {
  Contemplating: getBackgroundColorWithOpacity(COLORS.lightBlue1000),
  Tentative: getBackgroundColorWithOpacity(COLORS.yellow1000),
  Confirmed: getBackgroundColorWithOpacity(COLORS.lightBlue1000),
  Finalised: getBackgroundColorWithOpacity(COLORS.green1000),
  Cancelled: getBackgroundColorWithOpacity(COLORS.navy600),
  InOR: getBackgroundColorWithOpacity(COLORS.green1000),
  Closing: getBackgroundColorWithOpacity(COLORS.red1000),
  Discharge: getBackgroundColorWithOpacity(COLORS.red1000),
} as const;
