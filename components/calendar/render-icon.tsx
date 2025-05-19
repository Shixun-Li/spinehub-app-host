import React from "react";
import { View, StyleSheet } from "react-native";
import DocumentIcon from "@/assets/svgs/icons/document-icon";
import LinkIcon from "@/assets/svgs/icons/link-icon";
import PhotoIcon from "@/assets/svgs/icons/photo-icon";
import { DocType } from "@/types/types";
import { COLORS } from "@/constants/theme";

type Props = {
  docType: DocType;
};

export const renderIcon = ({ docType }: Props) => {
  let backgroundColor;
  let IconComponent;

  switch (docType) {
    case "Document":
      backgroundColor = COLORS.lightBlue1000;
      IconComponent = DocumentIcon;
      break;
    case "Photo":
      backgroundColor = COLORS.green1000;
      IconComponent = PhotoIcon;
      break;
    case "Link":
      backgroundColor = COLORS.navy1000;
      IconComponent = LinkIcon;
      break;
    default:
      return null;
  }

  return (
    <View style={[styles.iconWrapper, { backgroundColor }]}>
      <IconComponent />
    </View>
  );
};

const styles = StyleSheet.create({
  iconWrapper: {
    width: 34,
    height: 34,
    borderRadius: 34 / 2,
    alignItems: "center",
    justifyContent: "center",
  },
});
