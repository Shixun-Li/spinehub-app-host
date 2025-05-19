import React from "react";
import { Modal, View, StyleSheet, Pressable, Animated } from "react-native";
import { COLORS } from "@/constants/theme";
import AppText from "../core/app-text";
import MainButton from "../core/main-button";
import { useSlideAnimation } from "@/hooks/use-slide-animation";

interface ChangePasswordModalProps {
  visible: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

const ChangePasswordModal = ({
  visible,
  onClose,
  onConfirm,
}: ChangePasswordModalProps) => {
  const slideAnim = useSlideAnimation(visible);

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
          <View style={{ gap: 8 }}>
            <AppText
              color="smoke1000"
              fontWeight="semiBold"
              size={24}
              multiline
              align="center"
            >
              Are you sure?
            </AppText>
            <AppText
              color="smoke1000"
              fontWeight="regular"
              size={14}
              multiline
              align="center"
            >
              You’re about to change your account password, this cannot be
              reverted, are you sure?
            </AppText>

            <View style={styles.buttonContainer}>
              <MainButton onPress={onConfirm} text="Change" />
              <MainButton text="Cancel" onPress={onClose} type="smoke" />
            </View>
          </View>
        </Animated.View>
      </View>
    </Modal>
  );
};

export default ChangePasswordModal;

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
    backgroundColor: COLORS.navy1000,
    paddingTop: 24,
    paddingHorizontal: 16,
    paddingBottom: 48,
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
    height: 270,
  },
  buttonContainer: {
    marginTop: 24,
    minHeight: 114,
    justifyContent: "center",
    gap: 8,
  },
});
