import React, { useState } from "react";
import {
  Modal,
  View,
  StyleSheet,
  Pressable,
  Animated,
  FlatList,
} from "react-native";
import { COLORS } from "@/constants/theme";
import AppText from "../core/app-text";
import MainButton from "../core/main-button";
import { useSlideAnimation } from "@/hooks/use-slide-animation";
import { Booking } from "@/types/backend-types";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import BookingService from "@/services/booking.service";
import { ApiError } from "openapi-typescript-fetch";
import { GENERIC_ERROR, UPDATE_SUCCESS } from "@/constants/snackbar";
import InvalidateKeys from "@/services/invalidate-keys";
import { useSnackbarActions } from "@/stores/snackbar-store";
import { STATUS_OPTIONS } from "@/constants/text";
import ModalHeader from "./modal-header";
import PressableOpacity from "../core/pressable-opacity";
import { allowedNextStatuses } from "@/utils/formator";

export type StatusType = (typeof STATUS_OPTIONS)[number];

interface StatusSelectModalProps {
  visible: boolean;
  booking: Booking;
  onClose: () => void;
  onConfirm: (status: StatusType) => void;
}

const StatusSelectModal = ({
  visible,
  booking,
  onClose,
  onConfirm,
}: StatusSelectModalProps) => {
  const slideAnim = useSlideAnimation(visible);
  const queryClient = useQueryClient();
  const { addSnack } = useSnackbarActions();

  const [selectedStatus, setSelectedStatus] = useState<StatusType>(
    booking.status as StatusType
  );
  const [isTabChanged, setIsTabChanged] = useState(false);

  const { mutate: statusBooking, isPending } = useMutation({
    mutationFn: BookingService.statusBooking,
    onError: (error: ApiError) => {
      addSnack({
        severity: "error",
        message: GENERIC_ERROR,
      });
    },
    onSuccess: async () => {
      addSnack({ severity: "success", message: UPDATE_SUCCESS });
      await InvalidateKeys.calendar(queryClient);
    },
  });

  const handleStatusSelect = (status: StatusType) => {
    if (status !== selectedStatus) {
      setSelectedStatus(status);
      setIsTabChanged(true);
    }
  };

  const handleConfirm = () => {
    if (isTabChanged) {
      statusBooking({
        bookingId: booking.id,
        status: selectedStatus,
      });
      onConfirm(selectedStatus);
    }
    onClose();
  };
  const nextOptions = allowedNextStatuses[booking.status as StatusType] ?? [];
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
            { transform: [{ translateY: slideAnim }] },
          ]}
        >
          <ModalHeader onClose={onClose} text="Change Status" />
          <View style={styles.statusBody}>
            <FlatList
              data={nextOptions}
              numColumns={3}
              keyExtractor={(item) => item}
              columnWrapperStyle={styles.statusLine}
              renderItem={({ item }) => (
                <PressableOpacity
                  style={[
                    styles.statusCard,
                    selectedStatus === item && styles.selectedStatusCard,
                  ]}
                  onPress={() => handleStatusSelect(item)}
                >
                  <AppText size={12} color="navy1000" fontWeight="semiBold">
                    {item === "InOR" ? "In OR" : item}
                  </AppText>
                </PressableOpacity>
              )}
            />
          </View>
          <View style={styles.buttonContainer}>
            <MainButton
              text="Confirm"
              onPress={handleConfirm}
              isDisabled={!isTabChanged || isPending}
            />
          </View>
        </Animated.View>
      </View>
    </Modal>
  );
};

export default StatusSelectModal;

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
    height: 200,
  },

  statusBody: {
    marginVertical: 12,
  },
  statusLine: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  statusCard: {
    flex: 1,
    paddingVertical: 10,
    marginHorizontal: 4,
    borderRadius: 4,
    backgroundColor: COLORS.navy50,
    alignItems: "center",
    justifyContent: "center",
  },
  selectedStatusCard: {
    backgroundColor: COLORS.lightBlue100,
    borderColor: COLORS.lightBlue1000,
    borderWidth: 1,
  },
  buttonContainer: {
    minHeight: 53,
    justifyContent: "center",
  },
});
