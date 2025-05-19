"use client";
import { MediaMessageData } from "@/types/types";
import { CometChat } from "@cometchat/chat-sdk-react-native";
const getThreadMessages = async (GUID: string, threadTag: string) => {
  try {
    const threadRequest = new CometChat.MessagesRequestBuilder()
      .setGUID(GUID)
      .setLimit(50)
      .setTags([threadTag])
      .build();

    const threadMessages = await threadRequest.fetchPrevious();
    if (!threadMessages || threadMessages.length === 0) return "tryAgain";

    const parentMessageId = threadMessages[0].getId();
    const allReplies: CometChat.BaseMessage[] = [];

    const replyRequest = new CometChat.MessagesRequestBuilder()
      .setGUID(GUID)
      .setParentMessageId(parentMessageId)
      .setLimit(50)
      .build();

    let hasMore = true;
    while (hasMore) {
      const batch = await replyRequest.fetchPrevious();
      if (!batch.length) hasMore = false;
      else allReplies.push(...batch);
    }

    const sortedReplies = allReplies.sort(
      (a, b) => a.getSentAt() - b.getSentAt()
    );
    const mappedReplies = sortedReplies.map((msg: CometChat.BaseMessage) => {
      const base = {
        id: String(msg.getId()),
        senderId: msg.getSender()?.getUid(),
        senderName: msg.getSender()?.getName(),
        sentAt: msg.getSentAt(),
        parentMessageId: String(parentMessageId),
      };

      const type = msg.getType();
      if (type === CometChat.MESSAGE_TYPE.TEXT) {
        return {
          ...base,
          text: (msg as CometChat.TextMessage).getText?.() || "",
        };
      }

      if (type === CometChat.MESSAGE_TYPE.FILE) {
        const data = (
          msg as CometChat.MediaMessage
        ).getData?.() as MediaMessageData;
        return {
          ...base,
          text: data?.metadata?.caption ?? "[Media File]",
          fileUrl: data?.url || data?.attachments?.[0]?.url || "",
          mimeType: data?.attachments?.[0]?.mimeType || "",
        };
      }

      return {
        ...base,
        text: "[Unsupported message type]",
      };
    });

    return { replies: mappedReplies, parentMessageId };
  } catch (error) {
    console.error(
      `❌ Error fetching replies for thread '${threadTag}':`,
      error
    );
    return null;
  }
};
const addMessageListener = (
  listenerId: string,
  callback: (message: CometChat.TextMessage) => void
) => {
  CometChat.addMessageListener(
    listenerId,
    new CometChat.MessageListener({
      onTextMessageReceived: callback,
      onMediaMessageReceived: callback,
    })
  );
};
type ExtendedUser = CometChat.User & { deactivatedAt?: number };

const getGroupMembers = async (
  selectedGroup?: CometChat.Group,
  selectedThread?: string
): Promise<CometChat.User[]> => {
  try {
    if (!selectedGroup || !selectedThread) return [];

    const threadRequest = new CometChat.MessagesRequestBuilder()
      .setGUID(selectedGroup.getGuid())
      .setLimit(100)
      .setTags([selectedThread])
      .withTags(true)
      .build();

    const threadMessages = await threadRequest.fetchPrevious();

    const userIdsInThread = new Set(
      threadMessages
        .filter((msg: any) => typeof msg.getTags === "function")
        .flatMap((msg: any) => msg.getTags() || [])
        .filter(
          (tag: string) =>
            typeof tag === "string" && /^[a-f0-9-]{36}$/.test(tag)
        )
    );

    if (userIdsInThread.size === 0) return [];

    const usersInThread = await Promise.all(
      Array.from(userIdsInThread).map((uid) =>
        CometChat.getUser(uid).catch(() => null)
      )
    );

    return (usersInThread as ExtendedUser[]).filter(
      (user) =>
        user && (user.deactivatedAt === 0 || user.deactivatedAt === undefined)
    );
  } catch (error) {
    console.error("❌ Error fetching users in thread:", error);
    return [];
  }
};

export { getThreadMessages, addMessageListener, getGroupMembers };
