import React from "react";
import { View, Text, Pressable, StyleSheet, Linking } from "react-native";
import { format } from "date-fns";
import { renderIcon } from "./render-icon";
import { DocType } from "@/types/types";
import { COLORS } from "@/constants/theme";
import FileService from "@/services/file.service";

type FileCardProps = {
  link: string;
  title: string;
  docType: DocType;
  createdAt: string;
};

const FileCard = ({ link, title, docType, createdAt }: FileCardProps) => {
  const handlePress = async () => {
    if (docType === "Link") {
      Linking.openURL(link);
    } else {
      const res = await FileService.download({ fileName: link });
      const presignedUrl = res.data.url;
      if (presignedUrl) {
        Linking.openURL(presignedUrl);
      }
    }
  };

  return (
    <Pressable style={styles.container} onPress={handlePress}>
      {renderIcon({ docType })}
      <View style={styles.textContainer}>
        <Text style={styles.title} numberOfLines={1}>
          {title}
        </Text>
        <Text style={styles.date}>
          Uploaded {format(new Date(createdAt), "MMMM do")}
        </Text>
      </View>
    </Pressable>
  );
};

export default FileCard;

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingVertical: 16,
    paddingHorizontal: 8,
    backgroundColor: COLORS.navy50,
    borderRadius: 8,
  },
  textContainer: {
    flex: 1,
    flexDirection: "column",
  },
  title: {
    fontSize: 12,
    fontWeight: "600",
    maxWidth: 400,
  },
  date: {
    fontSize: 12,
    fontWeight: "500",
    color: COLORS.navy600,
  },
});
