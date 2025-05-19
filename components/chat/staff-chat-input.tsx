"use client";
import SendIcon from "@/assets/svgs/icons/send-icon";
import { COLORS } from "@/constants/theme";
import { sendDirectMessage } from "@/services/chat/comet-chat-staff-list.service";
import { MessageType } from "@/types/types";
import React, { useState } from "react";
import {
  StyleSheet,
  View,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
} from "react-native";
import FileIcon from "./file-icon";
import DocModal from "./doc-modal";

interface StaffChatInputProps {
  selectedUserId: string;
  onMessageSent: (message: MessageType) => void;
}

const StaffChatInput = ({
  selectedUserId,
  onMessageSent,
}: StaffChatInputProps) => {
  const [message, setMessage] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [isDocVisible, setDocVisible] = useState(false);

  const handleSend = async () => {
    if (isSending || message.trim() === "") return;
    setIsSending(true);
    try {
      const sentMessage = await sendDirectMessage(selectedUserId, message);

      if (sentMessage) {
        const mappedMessage: MessageType = {
          id: String(sentMessage.id),
          text: sentMessage.text,
          senderId: sentMessage.senderId,
          senderName: sentMessage.senderName,
          sentAt: sentMessage.sentAt,
        };

        onMessageSent(mappedMessage);
      }
    } finally {
      setMessage("");
      setTimeout(() => setIsSending(false), 1000);
    }
  };

  return (
    <>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        keyboardVerticalOffset={Platform.OS === "ios" ? 70 : 0}
        style={{ paddingTop: 8 }}
      >
        <View style={styles.container}>
          <TextInput
            style={styles.textInput}
            placeholder="Type here"
            placeholderTextColor="#A0AEC0"
            multiline
            value={message}
            onChangeText={setMessage}
          />
          <View style={styles.actions}>
            <TouchableOpacity
              style={styles.iconButton}
              onPress={() => setDocVisible(true)}
              disabled={isSending}
            >
              <FileIcon fill="#ffffff" />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.sendButton}
              onPress={handleSend}
              disabled={isSending}
            >
              <SendIcon />
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
      <DocModal
        visible={isDocVisible}
        onClose={() => setDocVisible(false)}
        receiverId={selectedUserId}
        onMessageSent={onMessageSent}
        receiverType={"user"}
      />
    </>
  );
};

export default StaffChatInput;

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.navy50,
    borderRadius: 12,
    padding: 8,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 8,
  },
  textInput: {
    flex: 1,
    fontSize: 14,
    maxHeight: 150,
    paddingVertical: 4,
    color: "#1A202C",
  },
  actions: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  sendButton: {
    backgroundColor: "#CBD5E0",
    padding: 10,
    borderRadius: 999,
    justifyContent: "center",
    alignItems: "center",
  },
  fileButton: {
    backgroundColor: "#BFDBFE",
    padding: 10,
    borderRadius: 999,
    justifyContent: "center",
    alignItems: "center",
  },
  iconButton: {
    backgroundColor: COLORS.lightBlue1000,
    padding: 10,
    borderRadius: 999,
    justifyContent: "center",
    alignItems: "center",
  },
});
