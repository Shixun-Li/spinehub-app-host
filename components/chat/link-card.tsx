import React from "react";
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Linking,
} from "react-native";

import { COLORS } from "@/constants/theme";
import ChatFileIcon from "@/assets/svgs/icons/chat-file-icon";
import FileIcon from "./file-icon";
import AppText from "../core/app-text";
import { normalizeUrl } from "@/utils/formator";

type LinkCardProps = {
  link: string;
  title: string;
  isFile?: boolean;
  author?: "self" | "other";
};

const LinkCard = ({
  link,
  title,
  isFile = false,
  author = "other",
}: LinkCardProps) => {
  const handlePress = () => {
    if (link) Linking.openURL(normalizeUrl(link));
  };

  const isSelf = author === "self";

  return (
    <TouchableOpacity style={styles.card} onPress={handlePress}>
      <View
        style={[
          styles.iconWrapper,
          { backgroundColor: isSelf ? COLORS.smoke100 : COLORS.navy100 },
        ]}
      >
        {isFile ? <ChatFileIcon /> : <FileIcon />}
      </View>

      <View style={styles.textWrapper}>
        <Text
          style={[
            styles.titleText,
            { color: isSelf ? COLORS.smoke1000 : COLORS.navy1000 },
          ]}
          numberOfLines={2}
          ellipsizeMode="tail"
        >
          {title}
        </Text>

        <AppText
          color={isSelf ? "smoke1000" : "navy1000"}
          fontWeight="medium"
          size={10}
        >
          {isFile ? "File" : "Link"}
        </AppText>
      </View>
    </TouchableOpacity>
  );
};

export default LinkCard;

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    maxWidth: "70%",
    minWidth: 90,
  },
  iconWrapper: {
    width: 34,
    height: 34,
    borderRadius: 17,
    alignItems: "center",
    justifyContent: "center",
  },
  textWrapper: {
    flexDirection: "column",
    maxWidth: 280,
    overflow: "hidden",
  },
  titleText: {
    fontSize: 14,
    fontWeight: "500",
    flexShrink: 1,
  },
});
