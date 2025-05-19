import React, { useEffect, useState } from "react";
import { ActivityIndicator, Image, StyleSheet, View } from "react-native";
import AppText from "../core/app-text";
import AssignmentIcon from "@/assets/svgs/icons/assignment-icon";
import { COLORS } from "@/constants/theme";
import PressableOpacity from "../core/pressable-opacity";
import { router } from "expo-router";
import PinIcon from "@/assets/svgs/icons/pin-icon";
import ClipIcon from "@/assets/svgs/icons/clip-icon";
import { getCurrentUserId } from "@/services/chat/comet-chat-users.service";
import { CometChat } from "@cometchat/chat-sdk-react-native";
import { togglePinGroupChat } from "@/services/chat/comet-chat.service";
import InvalidateKeys from "@/services/invalidate-keys";
import { useQueryClient } from "@tanstack/react-query";

type Props = {
  groupName: string;
  avatarUrl: string;
  patientId: string;
  selectedGroup?: CometChat.Group | null;
};

const SelectedPatientHeader = ({
  groupName,
  avatarUrl,
  patientId,
  selectedGroup,
}: Props) => {
  const [isUserPinned, setIsUserPinned] = useState<boolean | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const queryClient = useQueryClient();

  const onPinGroup = async () => {
    if (!selectedGroup) {
      return;
    }

    const groupId = selectedGroup.getGuid();
    await togglePinGroupChat(groupId, userId ?? "");

    await InvalidateKeys.chatList(queryClient);
  };
  useEffect(() => {
    const fetchUserId = async () => {
      const id = await getCurrentUserId();
      setUserId(id);
    };
    fetchUserId();
  }, []);
  useEffect(() => {
    if (!userId || !selectedGroup) return;

    const tags = selectedGroup.getTags() || [];
    const userTag = tags.find((tag) => tag.includes(userId));

    if (userTag) {
      setIsUserPinned(userTag.startsWith("pinned"));
    } else {
      setIsUserPinned(null);
    }
  }, [userId, selectedGroup]);
  const togglePinStatus = async () => {
    setIsLoading(true);
    try {
      await onPinGroup();
      setIsUserPinned((prev) => !prev);
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <View style={styles.userContainer}>
      <View style={styles.nameContiner}>
        <Image source={{ uri: avatarUrl }} style={styles.avatar} />
        <View>
          <AppText color="navy1000" fontWeight="semiBold" size={14}>
            {groupName}
          </AppText>
          <AppText color="navy600" fontWeight="medium" size={12}>
            Patient
          </AppText>
        </View>
      </View>
      <View style={{ flexDirection: "row", gap: 8 }}>
        {isLoading ? (
          <View style={styles.iconContainer}>
            <ActivityIndicator size="small" color="#fff" />
          </View>
        ) : (
          <PressableOpacity
            style={[
              styles.pinIconContainer,
              {
                backgroundColor: isUserPinned
                  ? COLORS.green1000
                  : COLORS.green100,
                borderWidth: 1,
                borderColor: COLORS.green1000,
              },
            ]}
            onPress={togglePinStatus}
          >
            {isUserPinned ? <PinIcon size={25} /> : <ClipIcon />}
          </PressableOpacity>
        )}
        <PressableOpacity
          style={styles.iconContainer}
          onPress={() =>
            router.push({
              pathname: "/(home)/(selectedGroupId)/(patientId)",
              params: { patientId },
            })
          }
        >
          <AssignmentIcon />
        </PressableOpacity>
      </View>
    </View>
  );
};

export default SelectedPatientHeader;

const styles = StyleSheet.create({
  userContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 8,
    alignItems: "center",
    paddingVertical: 16,
    paddingHorizontal: 8,
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 999,
  },
  nameContiner: {
    flexDirection: "row",
    gap: 8,
    alignItems: "center",
  },
  iconContainer: {
    width: 34,
    height: 34,
    borderRadius: 999,
    backgroundColor: COLORS.green1000,
    justifyContent: "center",
    alignItems: "center",
    padding: 8,
  },
  pinIconContainer: {
    width: 34,
    height: 34,
    borderRadius: 999,
    backgroundColor: COLORS.green1000,
    justifyContent: "center",
    alignItems: "center",
    padding: 8,
  },
});
