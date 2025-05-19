import React from "react";
import { View, StyleSheet } from "react-native";
import UploadCard from "./upload-card";
import DocumentIcon from "@/assets/svgs/icons/document-icon";
import PhotoIcon from "@/assets/svgs/icons/photo-icon";
import LinkIcon from "@/assets/svgs/icons/link-icon";
import { COLORS } from "@/constants/theme";

type UploadType = "Document" | "Photo" | "Link";

interface Props {
  selectedType: UploadType | null;
  onSelect: (type: UploadType) => void;
  onDocumentPick: () => void;
  onImagePick: () => void;
}

const DocUploadCardGroup = ({
  selectedType,
  onSelect,
  onDocumentPick,
  onImagePick,
}: Props) => {
  return (
    <View style={styles.cardRow}>
      <UploadCard
        label="Document"
        isSelected={selectedType === "Document"}
        onPress={() => {
          onSelect("Document");
          onDocumentPick();
        }}
        icon={<DocumentIcon width={60} height={60} />}
        cardColor={COLORS.lightBlue100}
        iconBg={COLORS.lightBlue1000}
      />
      <UploadCard
        label="Photo"
        isSelected={selectedType === "Photo"}
        onPress={() => {
          onSelect("Photo");
          onImagePick();
        }}
        icon={<PhotoIcon width={60} height={60} />}
        cardColor={COLORS.green100}
        iconBg={COLORS.green1000}
      />
      <UploadCard
        label="Link"
        isSelected={selectedType === "Link"}
        onPress={() => onSelect("Link")}
        icon={<LinkIcon width={60} height={60} />}
        cardColor={COLORS.navy50}
        iconBg={COLORS.navy1000}
      />
    </View>
  );
};

export default DocUploadCardGroup;

const styles = StyleSheet.create({
  cardRow: {
    flexDirection: "row",
    gap: 8,
  },
});
