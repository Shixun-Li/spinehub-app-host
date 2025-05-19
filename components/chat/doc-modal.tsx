import React, { useEffect, useState } from "react";
import {
  Modal,
  View,
  StyleSheet,
  Pressable,
  Animated,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import * as DocumentPicker from "expo-document-picker";
import * as ImagePicker from "expo-image-picker";
import { COLORS } from "@/constants/theme";
import { useSlideAnimation } from "@/hooks/use-slide-animation";
import ModalHeader from "../calendar/modal-header";
import MainButton from "../core/main-button";
import { MessageType, RNFile } from "@/types/types";
import DocUploadCardGroup from "./doc-upload-card-group";
import DocFormInputs from "./doc-form-inputs";
import SelectedInfoBanner from "./selected-info-banner";
import {
  sendDirectLinkMessage,
  sendDirectMediaFile,
  sendGroupLinkMessage,
  sendGroupReplyMediaFile,
} from "@/services/chat/\bcomet-chat-file.service";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import PatientService from "@/services/patient.service";
import InvalidateKeys from "@/services/invalidate-keys";
import { GENERIC_ERROR, UPLOAD_SUCCESS } from "@/constants/snackbar";
import { ApiError } from "openapi-typescript-fetch";
import { useSnackbarActions } from "@/stores/snackbar-store";
import FileService from "@/services/file.service";

type UploadType = "Document" | "Photo" | "Link" | null;

interface DocModalProps {
  visible: boolean;
  onClose: () => void;
  receiverId: string;
  receiverType: "user" | "group";
  parentMessageId?: number;
  onMessageSent: (message: MessageType) => void;
}

const DocModal = ({
  visible,
  onClose,
  receiverId,
  receiverType,
  parentMessageId,
  onMessageSent,
}: DocModalProps) => {
  const slideAnim = useSlideAnimation(visible);
  const [selectedType, setSelectedType] = useState<UploadType>(null);
  const [title, setTitle] = useState("");
  const [file, setFile] = useState<RNFile | null>(null);
  const [image, setImage] = useState<RNFile | null>(null);
  const [linkText, setLinkText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const queryClient = useQueryClient();
  const { addSnack } = useSnackbarActions();
  const [linkError, setLinkError] = useState<string | null>(null);

  const { mutate: addDocument, isPending: isAddingDocument } = useMutation({
    mutationFn: PatientService.addDocument,
    onError: (error: ApiError) => {
      addSnack({
        severity: "error",
        message: GENERIC_ERROR,
      });
    },
    onSuccess: () => {
      InvalidateKeys.patient(queryClient);
      addSnack({ severity: "success", message: UPLOAD_SUCCESS });
    },
  });

  useEffect(() => {
    if (visible) {
      setSelectedType(null);
      setTitle("");
      setFile(null);
      setImage(null);
      setLinkText("");
    }
  }, [visible]);

  useEffect(() => {
    if (selectedType === "Document") {
      setImage(null);
      setLinkText("");
    } else if (selectedType === "Photo") {
      setFile(null);
      setLinkText("");
    } else if (selectedType === "Link") {
      setFile(null);
      setImage(null);
    }
  }, [selectedType]);

  const isReady =
    !!title &&
    ((selectedType === "Document" && !!file) ||
      (selectedType === "Photo" && !!image) ||
      (selectedType === "Link" && !!linkText && !linkError));

  const handleSelectDocument = async () => {
    const res = await DocumentPicker.getDocumentAsync({});
    if (!res.canceled && res.assets?.[0]) {
      const asset = res.assets[0];
      setFile({
        uri: asset.uri,
        name: asset.name ?? "document",
        type: asset.mimeType ?? "application/octet-stream",
      });
    }
  };

  const handleSelectPhoto = async () => {
    const res = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
    });
    if (!res.canceled && res.assets?.[0]) {
      const asset = res.assets[0];
      setImage({
        uri: asset.uri,
        name: asset.fileName ?? "photo.jpg",
        type: asset.type ?? "image/jpeg",
      });
    }
  };

  const handleUploadPress = async () => {
    if (!isReady) return;

    setIsLoading(true);
    try {
      let result: MessageType | null = null;
      let uploadedFileName: string | null = null;

      if (
        (selectedType === "Document" && file) ||
        (selectedType === "Photo" && image)
      ) {
        const uploadTarget = selectedType === "Document" ? file! : image!;
        if (receiverType === "group" && parentMessageId !== undefined) {
          result = await sendGroupReplyMediaFile(
            receiverId,
            parentMessageId,
            uploadTarget,
            title
          );
        } else {
          result = await sendDirectMediaFile(receiverId, uploadTarget, title);
        }

        uploadedFileName = await FileService.uploadFile(uploadTarget);
        if (!uploadedFileName) throw new Error("File upload failed");

        const patientId =
          receiverType === "group"
            ? receiverId.replace(/^group_/, "")
            : receiverId;
        addDocument({
          patientId,
          type: selectedType,
          title,
          file: uploadedFileName,
        });
      }

      if (selectedType === "Link" && linkText) {
        if (receiverType === "group" && parentMessageId !== undefined) {
          result = await sendGroupLinkMessage(
            receiverId,
            parentMessageId,
            linkText,
            title
          );
        } else {
          result = await sendDirectLinkMessage(receiverId, linkText, title);
        }

        if (receiverType === "group") {
          const patientId = receiverId.replace(/^group_/, "");
          addDocument({
            patientId,
            type: "Link",
            title,
            file: linkText,
          });
        }
      }

      if (result) {
        onMessageSent(result);
        setTitle("");
        setLinkText("");
        setFile(null);
        setImage(null);
        onClose();
      }
    } catch (error) {
      console.error("Upload failed", error);
      addSnack({ severity: "error", message: GENERIC_ERROR });
    } finally {
      setIsLoading(false);
    }
  };

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
            <View style={styles.modalInner}>
              <View style={{ gap: 12 }}>
                <ModalHeader onClose={onClose} text="Upload Options" />
                <View style={styles.content}>
                  <DocUploadCardGroup
                    selectedType={selectedType}
                    onSelect={setSelectedType}
                    onDocumentPick={handleSelectDocument}
                    onImagePick={handleSelectPhoto}
                  />
                  <SelectedInfoBanner
                    type={
                      selectedType === "Document"
                        ? "Document"
                        : selectedType === "Photo"
                        ? "Photo"
                        : null
                    }
                    hasData={!!file || !!image}
                  />
                  <DocFormInputs
                    title={title}
                    onTitleChange={setTitle}
                    linkText={linkText}
                    onLinkChange={(input) => {
                      setLinkText(input);
                      const isValid =
                        !input || /^(https?:\/\/|www\.)/i.test(input);
                      if (!isValid) {
                        setLinkError(
                          "Link must start with http://, https://, or www."
                        );
                      } else {
                        setLinkError(null);
                      }
                    }}
                    linkError={linkError}
                    showLinkInput={selectedType === "Link"}
                  />
                </View>
              </View>
              <View style={styles.buttonContainer}>
                <MainButton
                  text="Upload"
                  isDisabled={!isReady || isLoading}
                  isLoading={isLoading || isAddingDocument}
                  onPress={handleUploadPress}
                />
              </View>
            </View>
          </Animated.View>
        </KeyboardAvoidingView>
      </View>
    </Modal>
  );
};

export default DocModal;

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
    height: 460,
  },
  modalInner: {
    justifyContent: "space-between",
    height: "100%",
  },
  content: {
    height: 320,
  },
  buttonContainer: {
    minHeight: 53,
    justifyContent: "center",
  },
});
