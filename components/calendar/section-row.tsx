import React, { useState } from "react";
import { View, StyleSheet } from "react-native";
import AppText from "../core/app-text";
import { Booking, BookingData } from "@/types/backend-types";
import {
  statusBgColorVariant,
  statusTextColorVariant,
} from "@/constants/status-color-variants";
import { COLORS } from "@/constants/theme";
import StatusSelectModal from "./status-select-modal";
import ArrowDownIcon from "@/assets/svgs/icons/arrow-down-icon";
import PressableOpacity from "../core/pressable-opacity";

type SectionRowProps = {
  label: string;
  value: string;
  isList?: boolean;
  booking?: BookingData;
};

export const SectionRow = ({
  label,
  value,
  isList = false,
  booking,
}: SectionRowProps) => {
  const [isModalVisible, setModalVisible] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState<Booking | undefined>();

  const badgeColor = statusBgColorVariant({ status: booking?.status });
  const textColor = statusTextColorVariant({
    status: booking?.status,
  }) as keyof typeof COLORS;

  const handleSelect = (booking: Booking | undefined) => {
    if (booking) {
      setModalVisible(true);
      setSelectedBooking(booking);
    }
  };

  return (
    <View style={styles.row}>
      <AppText size={14} fontWeight="semiBold" style={styles.label}>
        {label}
      </AppText>
      {!booking && (
        <AppText
          size={14}
          fontWeight="regular"
          color="navy600"
          style={styles.value}
        >
          {isList ? `• ${value || "N/A"}` : value || "N/A"}
        </AppText>
      )}
      {booking && (
        <PressableOpacity
          style={[styles.statusCard, { backgroundColor: badgeColor }]}
          onPress={(e) => {
            e.stopPropagation();
            if (
              booking.status === "InOR" ||
              booking.status === "Closing" ||
              booking.status === "Finalised"
            ) {
              handleSelect(booking);
            }
          }}
        >
          <AppText size={10} fontWeight="medium" color={textColor}>
            {booking.status}
          </AppText>
          <ArrowDownIcon />
        </PressableOpacity>
      )}
      {selectedBooking && (
        <StatusSelectModal
          booking={selectedBooking}
          visible={isModalVisible}
          onClose={() => setModalVisible(false)}
          onConfirm={() => setModalVisible(false)}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 10,
    marginBottom: 12,
  },
  label: {
    width: 150,
  },
  value: {
    flex: 1,
  },
  statusCard: {
    paddingHorizontal: 12,
    minWidth: 80,
    height: 22,
    borderRadius: 32,
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
    gap: 4,
  },
});
