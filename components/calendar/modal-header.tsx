import XIcon from "@/assets/svgs/icons/x-icon";
import React from "react";
import { View, StyleSheet, Pressable } from "react-native";
import AppText from "../core/app-text";

type Props = {
  onClose: () => void;
  text: string;
};

const ModalHeader = ({ onClose, text }: Props) => {
  return (
    <View style={styles.modalHeader}>
      <Pressable style={styles.closeButton} onPress={onClose}>
        <XIcon />
      </Pressable>
      <AppText color="navy1000" size={20} fontWeight="semiBold">
        {text}
      </AppText>
    </View>
  );
};

export default ModalHeader;

const styles = StyleSheet.create({
  modalHeader: {
    position: "relative",
    alignItems: "center",
    justifyContent: "center",
  },
  closeButton: {
    position: "absolute",
    left: 0,
  },
});
