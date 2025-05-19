import { ImageSourcePropType } from "react-native";

export type ImageSlideType = {
  title: string;
  image: ImageSourcePropType;
};

export const slides: ImageSlideType[] = [
  {
    title: "On Boarding Image 1",
    image: require("@/assets/images/onboarding/onboarding1.png"),
  },
  {
    title: "On Boarding Image 2",
    image: require("@/assets/images/onboarding/onboarding2.png"),
  },
  {
    title: "On Boarding Image 3",
    image: require("@/assets/images/onboarding/onboarding3.png"),
  },
];
