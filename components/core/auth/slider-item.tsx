import { View, Image, StyleSheet, Dimensions } from "react-native";
import React from "react";
import { ImageSlideType } from "./slider-data";

const { width } = Dimensions.get("screen");

const renderItem = ({ item }: { item: ImageSlideType }) => (
  <View style={styles.slide}>
    <Image source={item.image} resizeMode="cover" style={styles.image} />
  </View>
);
export default renderItem;

const styles = StyleSheet.create({
  slide: {
    width: width,
    justifyContent: "center",
    alignItems: "center",
  },
  image: {
    width: "100%",
    height: "100%",
  },
});
