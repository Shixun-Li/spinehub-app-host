import { Booking, CalendarItem, Event } from "@/types/backend-types";
import React, { useState } from "react";
import { Pressable, StyleSheet, View } from "react-native";
import AppText from "../core/app-text";
import { COLORS } from "@/constants/theme";
import { formatDate, formatTime } from "@/utils/formator";
import {
  statusBgColorVariant,
  statusLightBgColor,
  statusTextColorVariant,
} from "@/constants/status-color-variants";
import StaffCard from "./staff-card";
import StatusSelectModal from "./status-select-modal";
import { router } from "expo-router";
import PressableOpacity from "../core/pressable-opacity";
import { ROLE_TYPES } from "@/constants/primitives";

type Props = {
  item: CalendarItem;
  events: Event[];
};

const BookingCard = ({ item, events }: Props) => {
  const [isModalVisible, setModalVisible] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState<Booking | undefined>();

  const handleSelect = (booking: Booking | undefined) => {
    if (booking) {
      setModalVisible(true);
      setSelectedBooking(booking);
    }
  };

  const handleCardPress = (bookingId: string) => {
    router.push({
      pathname: "/(home)/(bookingId)",
      params: { bookingId },
    });
  };
  return (
    <View style={styles.itemContainer}>
      <View style={styles.dateLineContainer}>
        <AppText size={12} fontWeight="semiBold">
          {formatDate(item.date)}
        </AppText>
        <View style={styles.line} />
        <View style={styles.eventContainer}>
          {events.length > 0 &&
            [...events]
              .sort((a, b) => {
                const aIsAnae =
                  a.event?.staff?.role?.name === ROLE_TYPES.ASSISTANT ? -1 : 0;
                const bIsAnae =
                  b.event?.staff?.role?.name === ROLE_TYPES.ASSISTANT ? -1 : 0;
                return bIsAnae - aIsAnae;
              })
              .map((event) => <StaffCard key={event.id} event={event} />)}
        </View>
      </View>
      {item.bookings.map((booking) => {
        const bgColor =
          statusLightBgColor[booking.status as keyof typeof statusLightBgColor];
        const badgeColor = statusBgColorVariant({ status: booking.status });
        const textColor = statusTextColorVariant({
          status: booking.status,
        }) as keyof typeof COLORS;
        return (
          <PressableOpacity
            key={booking.id}
            style={[styles.bookingItem, { backgroundColor: bgColor }]}
            onPress={() => handleCardPress(booking.id)}
          >
            <View style={styles.infoContainer}>
              <View style={styles.timeContainer}>
                <AppText color="navy800" fontWeight="semiBold" size={12}>
                  {formatTime(booking.startDate)}
                </AppText>
                <AppText color="navy600" fontWeight="medium" size={12}>
                  {formatTime(booking.endDate)}
                </AppText>
              </View>
              <View style={styles.patientContainer}>
                <AppText
                  color="navy1000"
                  fontWeight="semiBold"
                  size={14}
                  numberOfLines={1}
                >
                  {`${booking.patient.user.firstName} ${booking.patient.user.lastName}`}
                </AppText>
                <AppText
                  color="navy600"
                  fontWeight="medium"
                  size={12}
                  numberOfLines={2}
                >
                  {booking.surgeryName}
                </AppText>
              </View>
            </View>
            <Pressable
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
                {booking.status === "InOR" ? "In OR" : booking.status}
              </AppText>
            </Pressable>
            {selectedBooking && (
              <StatusSelectModal
                booking={selectedBooking}
                visible={isModalVisible}
                onClose={() => setModalVisible(false)}
                onConfirm={() => setModalVisible(false)}
              />
            )}
          </PressableOpacity>
        );
      })}
    </View>
  );
};

export default BookingCard;

const styles = StyleSheet.create({
  itemContainer: {
    marginBottom: 8,
  },
  dateLineContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  line: {
    flex: 1,
    height: 1,
    backgroundColor: COLORS.navy200,
    marginLeft: 8,
    marginRight: 8,
  },
  bookingItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderRadius: 8,
    marginBottom: 8,
    gap: 8,
  },
  infoContainer: {
    flex: 1,
    flexDirection: "row",
    gap: 12,
    flexWrap: "wrap",
  },
  timeContainer: {
    width: 70,
    justifyContent: "center",
  },
  patientContainer: {
    flex: 1,
    justifyContent: "center",
  },
  statusCard: {
    paddingHorizontal: 12,
    minWidth: 80,
    height: 22,
    borderRadius: 32,
    justifyContent: "center",
    alignItems: "center",
  },
  eventContainer: {
    flexDirection: "row",
    gap: 8,
  },
});
