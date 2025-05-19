import { COLORS } from "@/constants/theme";
import { View, StyleSheet } from "react-native";

interface PaginationDotsProps {
  total: number;
  activeIndex: number;
}

const PaginationDots = ({ total, activeIndex }: PaginationDotsProps) => {
  return (
    <View style={styles.pagination}>
      {Array.from({ length: total }).map((_, index) => (
        <View
          key={index}
          style={[styles.dot, index === activeIndex && styles.dotActive]}
        />
      ))}
    </View>
  );
};

export default PaginationDots;

const styles = StyleSheet.create({
  pagination: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 16,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 4,
    backgroundColor: COLORS.navy200,
    marginHorizontal: 4,
  },
  dotActive: {
    backgroundColor: COLORS.navy1000,
    width: 20,
  },
});
