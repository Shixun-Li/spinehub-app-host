import { COLORS } from "@/constants/theme";
import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
  StyleSheet,
} from "react-native";
import AppText from "./app-text";
import Animated, { FadeIn, FadeOut } from "react-native-reanimated";

export interface Option {
  label: string;
  key: string;
}

interface InfiniteCustomDropdownProps {
  items: Option[];
  value?: string;
  placeholder?: string;
  onChange: (val: string) => void;
  fetchNextPage?: () => void;
  hasNextPage?: boolean;
  isFetchingNextPage?: boolean;
  disabled?: boolean;
  label?: string;
  onOpen?: () => void;
  onClose?: () => void;
  isOpen?: boolean;
}

export default function InfiniteCustomDropdown({
  items,
  value,
  placeholder = "Select",
  onChange,
  fetchNextPage,
  hasNextPage,
  isFetchingNextPage,
  disabled = false,
  label,
  onOpen,
  onClose,
  isOpen = false,
}: InfiniteCustomDropdownProps) {
  const selectedLabel =
    items.find((i) => i.key === value)?.label || placeholder;

  const toggleDropdown = () => {
    if (disabled) return;
    if (isOpen) {
      onClose?.();
    } else {
      onOpen?.();
    }
  };

  const handleSelect = (key: string) => {
    onChange(key);
    onClose?.();
  };

  const renderItem = ({ item }: { item: Option }) => (
    <TouchableOpacity
      style={styles.item}
      onPress={() => handleSelect(item.key)}
    >
      <Text style={styles.itemText}>{item.label}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.wrapper}>
      {label && (
        <AppText size={14} color="navy1000" fontWeight="semiBold">
          {label}
        </AppText>
      )}
      <View style={styles.relativeContainer}>
        <TouchableOpacity
          style={[styles.selector, disabled && styles.disabledSelector]}
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
              renderItem={renderItem}
              onEndReached={() => {
                if (hasNextPage && !isFetchingNextPage) {
                  fetchNextPage?.();
                }
              }}
              onEndReachedThreshold={0.2}
              keyboardShouldPersistTaps="handled"
              ListFooterComponent={
                isFetchingNextPage ? (
                  <ActivityIndicator style={styles.loadingIndicator} />
                ) : null
              }
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
    gap: 4,
  },
  label: {
    marginBottom: 4,
    fontSize: 16,
    fontWeight: "600",
    color: "#0A2342",
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
  disabledSelector: {
    backgroundColor: "#E0E0E0",
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
    maxHeight: 130,
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
  loadingIndicator: {
    marginVertical: 8,
  },
});
