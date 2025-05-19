import React, { useState, useEffect } from "react";
import { Modal, View, StyleSheet, Pressable, Animated } from "react-native";
import { COLORS } from "@/constants/theme";
import AppText from "../core/app-text";
import MainButton from "../core/main-button";
import { useSlideAnimation } from "@/hooks/use-slide-animation";
import LastMonthIcon from "@/assets/svgs/icons/last-month-icon";
import NextMonthIcon from "@/assets/svgs/icons/next-month-icon";
import { monthNames } from "@/constants/text";
import ModalHeader from "./modal-header";

interface MonthSelectModalProps {
  visible: boolean;
  selectedYear: number;
  selectedMonth: number;
  onClose: () => void;
  onConfirm: () => void;
  onChange: (year: number, month: number) => void;
}

const MonthSelectModal = ({
  visible,
  selectedYear,
  selectedMonth,
  onClose,
  onConfirm,
  onChange,
}: MonthSelectModalProps) => {
  const slideAnim = useSlideAnimation(visible);
  const [currentYear, setCurrentYear] = useState(selectedYear);
  const [currentMonth, setCurrentMonth] = useState(selectedMonth);
  useEffect(() => {
    if (visible) {
      setCurrentYear(selectedYear);
      setCurrentMonth(selectedMonth);
    }
  }, [visible, selectedYear, selectedMonth]);
  return (
    <Modal
      animationType="fade"
      transparent
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <Pressable style={styles.backdrop} onPress={onClose} />
        <Animated.View
          style={[
            styles.modalContent,
            {
              transform: [{ translateY: slideAnim }],
            },
          ]}
        >
          <ModalHeader onClose={onClose} text=" Select Month" />
          <View style={styles.yearHeader}>
            <Pressable
              style={styles.closeButton}
              onPress={() => setCurrentYear(currentYear - 1)}
            >
              <LastMonthIcon />
            </Pressable>
            <AppText color="navy1000" size={16} fontWeight="semiBold">
              {currentYear}
            </AppText>
            <Pressable
              style={styles.nextButton}
              onPress={() => setCurrentYear(currentYear + 1)}
            >
              <NextMonthIcon />
            </Pressable>
          </View>
          <View style={styles.monthBody}>
            {Array.from({ length: 4 }).map((_, rowIndex) => (
              <View key={rowIndex} style={styles.monthLine}>
                {monthNames
                  .slice(rowIndex * 3, rowIndex * 3 + 3)
                  .map((month, index) => {
                    const monthNumber = rowIndex * 3 + index + 1;
                    const isSelected = currentMonth === monthNumber;
                    return (
                      <Pressable
                        key={month}
                        style={[
                          styles.monthCard,
                          isSelected && styles.selectedMonthCard,
                        ]}
                        onPress={() => setCurrentMonth(monthNumber)}
                      >
                        <AppText
                          color={isSelected ? "smoke1000" : "navy1000"}
                          size={12}
                          fontWeight="semiBold"
                        >
                          {month}
                        </AppText>
                      </Pressable>
                    );
                  })}
              </View>
            ))}
          </View>
          <View style={styles.buttonContainer}>
            <MainButton
              onPress={() => {
                onChange(currentYear, currentMonth);
                onConfirm();
              }}
              text="Search"
            />
          </View>
        </Animated.View>
      </View>
    </Modal>
  );
};

export default MonthSelectModal;
const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: "flex-end",
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0, 0, 0, 0.4)",
  },
  modalContent: {
    backgroundColor: COLORS.smoke1000,
    paddingTop: 24,
    paddingHorizontal: 16,
    paddingBottom: 48,
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
    gap: 16,
    height: 385,
  },
  yearHeader: {
    position: "relative",
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 5,
  },
  closeButton: {
    position: "absolute",
    left: 0,
  },
  nextButton: {
    position: "absolute",
    right: 0,
  },
  monthCard: {
    backgroundColor: COLORS.navy50,
    flex: 1,
    gap: 8,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  selectedMonthCard: {
    backgroundColor: COLORS.navy1000,
    flex: 1,
    gap: 8,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  monthLine: {
    flexDirection: "row",
    gap: 16,
  },
  monthBody: {
    marginVertical: 5,
    flexDirection: "column",
    gap: 8,
  },
  buttonContainer: {
    minHeight: 53,
    justifyContent: "center",
    marginTop: 25,
  },
});
