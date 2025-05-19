import React from "react";
import { Modal, View, StyleSheet, Pressable, Animated } from "react-native";
import { COLORS } from "@/constants/theme";
import AppText from "../core/app-text";
import MainButton from "../core/main-button";
import { useSlideAnimation } from "@/hooks/use-slide-animation";

interface SignOutModalProps {
  visible: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

const SignOutModal = ({ visible, onClose, onConfirm }: SignOutModalProps) => {
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
              Signing Out?
            </AppText>
            <AppText
              color="smoke1000"
              fontWeight="regular"
              size={14}
              multiline
              align="center"
            >
              You’re about to sign out of your account
            </AppText>

            <View style={styles.buttonContainer}>
              <MainButton onPress={onClose} text="Go Back" />
              <MainButton text="Sign Out" onPress={onConfirm} type="smoke" />
            </View>
          </View>
        </Animated.View>
      </View>
    </Modal>
  );
};

export default SignOutModal;

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
