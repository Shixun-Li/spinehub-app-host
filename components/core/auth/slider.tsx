import React, { useRef, useState, useEffect } from "react";
import {
  View,
  FlatList,
  Dimensions,
  NativeScrollEvent,
  NativeSyntheticEvent,
  StyleSheet,
} from "react-native";
import { slides } from "./slider-data";
import renderItem from "./slider-item";

const { width } = Dimensions.get("window");

export const ImageSliderMain = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const flatListRef = useRef<FlatList>(null);

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const index = Math.round(event.nativeEvent.contentOffset.x / width);
    setCurrentIndex(index);
  };

  const scrollToNext = () => {
    let nextIndex = currentIndex + 1;
    if (nextIndex >= slides.length) {
      nextIndex = 0;
    }
    flatListRef.current?.scrollToOffset({
      offset: nextIndex * width,
      animated: true,
    });
    setCurrentIndex(nextIndex);
  };

  useEffect(() => {
    const interval = setInterval(scrollToNext, 4000);
    return () => clearInterval(interval);
  }, [currentIndex]);

  return (
    <View style={styles.container}>
      <FlatList
        ref={flatListRef}
        data={slides}
        renderItem={renderItem}
        keyExtractor={(_, index) => index.toString()}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={handleScroll}
        snapToInterval={width}
        decelerationRate="fast"
        snapToAlignment="center"
        bounces={false}
        scrollEventThrottle={16}
      />
      <View style={styles.pagination}>
        {slides.map((_, index) => (
          <View
            key={index}
            style={[styles.dot, currentIndex === index && styles.dotActive]}
          />
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: "relative",
  },
  pagination: {
    position: "absolute",
    bottom: 20,
    left: 0,
    right: 0,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "rgba(255, 255, 255, 0.5)",
    marginHorizontal: 4,
  },
  dotActive: {
    width: 20,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#fff",
  },
});
