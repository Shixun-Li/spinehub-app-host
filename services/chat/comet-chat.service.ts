"use client";
import { CometChat } from "@cometchat/chat-sdk-react-native";

const togglePinGroupChat = async (groupId: string, userId: string) => {
  if (typeof window === "undefined" || !CometChat) return null;
  try {
    if (!groupId) {
      console.error("❌ Invalid groupId:", groupId);
      return null;
    }
    const group = await CometChat.getGroup(groupId);
    if (!group) {
      console.error("❌ Group not found:", groupId);
      return null;
    }
    const existingTags = group.getTags() || [];
    const pinnedTag = `pinned${userId}`;
    const unpinnedTag = `unpinned${userId}`;
    const isPinned = existingTags.includes(pinnedTag);
    let updatedTags;
    if (isPinned) {
      updatedTags = existingTags.filter((tag) => tag !== pinnedTag);
      updatedTags.push(unpinnedTag);
    } else {
      updatedTags = existingTags.filter((tag) => tag !== unpinnedTag);
      updatedTags.push(pinnedTag);
    }
    const updatedGroup = new CometChat.Group(
      groupId,
      group.getName(),
      group.getType()
    );
    updatedGroup.setTags(updatedTags);

    const response = await CometChat.updateGroup(updatedGroup);
    return response;
  } catch (error) {
    console.error("❌ Error toggling pin state:", error);
    return null;
  }
};

export { togglePinGroupChat };
