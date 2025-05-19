import { COLORS } from "@/constants/theme";
import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  FlatList,
} from "react-native";
import AppText from "./app-text";
import Animated, { FadeIn, FadeOut } from "react-native-reanimated";

export interface Option {
  label: string;
  key: string;
}

interface CustomDropdownProps {
  items: Option[];
  value?: string;
  placeholder?: string;
  onChange: (val: string) => void;
  label?: string;
  onOpen?: () => void;
  onClose?: () => void;
  isOpen?: boolean;
}

export default function CustomDropdown({
  items,
  value,
  placeholder = "Select",
  onChange,
  label,
  onOpen,
  onClose,
  isOpen = false,
}: CustomDropdownProps) {
  const selectedLabel =
    items.find((i) => i.key === value)?.label || placeholder;

  const handleSelect = (key: string) => {
    onChange(key);
    onClose?.();
  };

  const toggleDropdown = () => {
    if (isOpen) {
      onClose?.();
    } else {
      onOpen?.();
    }
  };

  return (
    <View style={styles.wrapper}>
      {label && (
        <AppText size={14} color="navy1000" fontWeight="semiBold">
          {label}
        </AppText>
      )}
      <View style={styles.relativeContainer}>
        <TouchableOpacity
          style={styles.selector}
          onPress={toggleDropdown}
          activeOpacity={0.7}
        >
          <Text style={[styles.selectorText, !value && styles.placeholderText]}>
            {selectedLabel}
          </Text>
        </TouchableOpacity>
        {isOpen && (
          <Animated.View
            entering={FadeIn.duration(150)}
            exiting={FadeOut.duration(150)}
            style={styles.dropdown}
          >
            <FlatList
              data={items}
              keyExtractor={(item) => item.key}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.item}
                  onPress={() => handleSelect(item.key)}
                >
                  <Text style={styles.itemText}>{item.label}</Text>
                </TouchableOpacity>
              )}
              keyboardShouldPersistTaps="handled"
            />
          </Animated.View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    marginVertical: 8,
    zIndex: 10,
    position: "relative",
    gap: 4,
  },
  relativeContainer: {
    position: "relative",
  },
  selector: {
    height: 48,
    justifyContent: "center",
    paddingHorizontal: 12,
    backgroundColor: "#EEF2F7",
    borderWidth: 1,
    borderColor: COLORS.lightBlue1000,
    borderRadius: 8,
  },
  selectorText: {
    fontSize: 14,
    color: "#0A2342",
  },
  placeholderText: {
    color: "#9CA3AF",
  },
  dropdown: {
    position: "absolute",
    top: 52,
    left: 0,
    right: 0,
    backgroundColor: "#FFFFFF",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    maxHeight: 120,
    overflow: "hidden",
    elevation: 6,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    zIndex: 20,
  },
  item: {
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
  },
  itemText: {
    fontSize: 14,
    color: "#0A2342",
  },
});
