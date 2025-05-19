import React, { useState } from "react";
import {
  StyleSheet,
  View,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
} from "react-native";
import { sendReplyMessage } from "@/services/chat/comet-chat-message.service";
import { MessageType } from "@/types/types";
import SendIcon from "@/assets/svgs/icons/send-icon";
import { COLORS } from "@/constants/theme";
import FileIcon from "./file-icon";
import DocModal from "./doc-modal";
import { useKeyboardOffset } from "@/utils/formator";

interface ChatInputProps {
  selectedGroupId: string;
  parentMessageId: number;
  onMessageSent: (message: MessageType) => void;
}

const ChatInput = ({
  selectedGroupId,
  parentMessageId,
  onMessageSent,
}: ChatInputProps) => {
  const [message, setMessage] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [isDocVisible, setDocVisible] = useState(false);

  const handleSend = async () => {
    if (isSending || message.trim() === "") return;
    setIsSending(true);
    try {
      const sentMessage = await sendReplyMessage(
        selectedGroupId,
        parentMessageId,
        message
      );

      if (sentMessage) {
        const mappedMessage: MessageType = {
          id: String(sentMessage.getId()),
          text:
            "getText" in sentMessage &&
            typeof sentMessage.getText === "function"
              ? sentMessage.getText()
              : "",
          senderId: sentMessage.getSender()?.getUid() || "",
          senderName: sentMessage.getSender()?.getName() || "",
          sentAt: sentMessage.getSentAt() ?? Date.now(),
          parentMessageId: String(sentMessage.getParentMessageId()),
        };
        onMessageSent(mappedMessage);
      }
    } finally {
      setMessage("");
      setTimeout(() => setIsSending(false), 500);
    }
  };
  const keyboardOffset = useKeyboardOffset();

  return (
    <>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        keyboardVerticalOffset={keyboardOffset}
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
        receiverId={selectedGroupId}
        parentMessageId={parentMessageId}
        onMessageSent={onMessageSent}
        receiverType={"group"}
      />
    </>
  );
};

export default ChatInput;

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
