import React from "react";
import {
  Modal,
  View,
  StyleSheet,
  Pressable,
  Animated,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from "react-native";
import ModalHeader from "../calendar/modal-header";
import { useSlideAnimation } from "@/hooks/use-slide-animation";
import { COLORS } from "@/constants/theme";
import { useQuery } from "@tanstack/react-query";
import CacheKeys from "@/services/cache-keys";
import PatientService from "@/services/patient.service";
import UserCard from "../calendar/user-card";
import UserDetailList from "../calendar/user-detail-list";
import { mapToPatient } from "@/utils/formator";

interface PatientModalProps {
  visible: boolean;
  onClose: () => void;
  patientId: string;
}

const PatientModal = ({ visible, onClose, patientId }: PatientModalProps) => {
  const slideAnim = useSlideAnimation(visible);
  const { data: patientData, isLoading: isLoadingPatient } = useQuery({
    queryKey: [CacheKeys.PATIENT_CACHE_KEY, patientId],
    queryFn: () =>
      PatientService.patientDetail({
        patientId: patientId ?? "",
      }),
    enabled: !!patientId,
  });
  return (
    <Modal
      animationType="fade"
      transparent
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <Pressable style={styles.backdrop} onPress={onClose} />
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : undefined}
        >
          <Animated.View
            style={[
              styles.modalContent,
              { transform: [{ translateY: slideAnim }] },
            ]}
          >
            <ModalHeader onClose={onClose} text="   Patient Information" />
            {isLoadingPatient && (
              <View style={styles.loaderContainer}>
                <ActivityIndicator size="large" color="#0000ff" />
              </View>
            )}
            {!isLoadingPatient && (
              <View style={styles.container}>
                {patientData?.data && (
                  <UserCard patient={mapToPatient(patientData.data)} />
                )}
                {patientData?.data && (
                  <UserDetailList patient={mapToPatient(patientData.data)} />
                )}
              </View>
            )}
          </Animated.View>
        </KeyboardAvoidingView>
      </View>
    </Modal>
  );
};

export default PatientModal;

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
    gap: 18,
    height: 520,
  },

  container: {
    flex: 1,
    gap: 16,
  },
  loaderContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
