import {
  StaffRoleId,
  ClinicalRoleId,
  CommercialRoleId,
  FinancialRoleId,
  AssociateRoleId,
} from "@/constants/cometchat-constants";
let CometChat: any;

if (typeof window !== "undefined") {
  import("@cometchat/chat-sdk-react-native").then((module) => {
    CometChat = module.CometChat;
  });
}
import { getCurrentUserId } from "./comet-chat-users.service";
import {
  CometchatBaseMessage,
  CometchatConversationList,
  CometchatTextMessage,
  CometchatUser,
  MessageType,
  StaffType,
} from "@/types/types";

export const fetchStaffChats = async (
  debouncedStaffSearchKey: string
): Promise<StaffType[]> => {
  try {
    const userId = await getCurrentUserId();
    if (!userId) throw new Error("❌ User ID not found");

    const pinnedRequest = new CometChat.ConversationsRequestBuilder()
      .setLimit(50)
      .setTags([`pinned${userId}`])
      .setConversationType(CometChat.RECEIVER_TYPE.USER)
      .build();

    const unpinnedRequest = new CometChat.ConversationsRequestBuilder()
      .setLimit(50)
      .setTags([`unpinned${userId}`])
      .setConversationType(CometChat.RECEIVER_TYPE.USER)
      .build();

    const [pinned, unpinned] = await Promise.all([
      pinnedRequest.fetchNext(),
      unpinnedRequest.fetchNext(),
    ]);

    const knownUserIds = new Set<string>();
    let usersWithChatHistory: StaffType[] = [];

    const process = (list: CometchatConversationList, isPinned: boolean) => {
      list.forEach((convo) => {
        const user = convo.getConversationWith() as CometchatUser;
        const uid = user.getUid();
        if (uid && !knownUserIds.has(uid)) {
          knownUserIds.add(uid);
          usersWithChatHistory.push({
            uid,
            name: user.getName(),
            unreadMessagesCount: convo.getUnreadMessageCount(),
            lastMessage: convo.getLastMessage(),
            isPinned,
          });
        }
      });
    };

    process(pinned, true);
    process(unpinned, false);

    if (debouncedStaffSearchKey.trim()) {
      const lower = debouncedStaffSearchKey.toLowerCase();
      usersWithChatHistory = usersWithChatHistory.filter(
        (user) =>
          user.name.toLowerCase().includes(lower) ||
          user.uid.toLowerCase().includes(lower)
      );
    }

    const userReq = new CometChat.UsersRequestBuilder()
      .setLimit(100)
      .setRoles([
        StaffRoleId,
        ClinicalRoleId,
        CommercialRoleId,
        FinancialRoleId,
        AssociateRoleId,
        "011100",
      ])
      .setSearchKeyword(debouncedStaffSearchKey)
      .build();

    const filtered = await userReq.fetchNext();

    const usersWithoutChat: StaffType[] = filtered
      .filter((u: { getUid: () => string }) => !knownUserIds.has(u.getUid()))
      .map((u: { getUid: () => any; getName: () => any }) => ({
        uid: u.getUid(),
        name: u.getName(),
        unreadMessagesCount: 0,
        lastMessage: undefined,
        isPinned: false,
      }));

    return [...usersWithChatHistory, ...usersWithoutChat];
  } catch (error) {
    console.error("❌ Error fetching staff chats:", error);
    return [];
  }
};

export const getMessages = async (uid: string): Promise<MessageType[]> => {
  try {
    const allMessages: CometchatBaseMessage[] = [];
    const req = new CometChat.MessagesRequestBuilder()
      .setUID(uid)
      .setLimit(50)
      .build();
    let hasMore = true;
    while (hasMore) {
      const batch = await req.fetchPrevious();
      if (!batch.length) hasMore = false;
      else allMessages.push(...batch);
    }

    return allMessages
      .map((msg: CometchatBaseMessage) => {
        const base = {
          id: String(msg.getId()),
          senderId: msg.getSender()?.getUid() || "",
          senderName: msg.getSender()?.getName() || "",
          sentAt: msg.getSentAt() ?? Date.now(),
        };

        const type = msg.getType?.();

        if (type === "text") {
          return {
            ...base,
            text: (msg as CometchatTextMessage).getText?.() || "",
          };
        }

        if (type === "file") {
          const data = msg.getData?.();
          const attachment = data?.attachments?.[0];
          const caption = data?.metadata?.caption || "";

          return {
            ...base,
            text: caption || "[Media File]",
            fileUrl: attachment?.url ?? "",
            mimeType: attachment?.mimeType ?? "",
          };
        }

        return {
          ...base,
          text: "[Unsupported message type]",
        };
      })
      .sort((a, b) => a.sentAt - b.sentAt);
  } catch (error) {
    console.error("❌ Failed to fetch all staff messages:", error);
    return [];
  }
};

export const markAllMessagesAsRead = async (uid: string) => {
  const userId = await getCurrentUserId();
  const req = new CometChat.MessagesRequestBuilder()
    .setUID(uid)
    .setLimit(50)
    .build();
  const messages = await req.fetchPrevious();
  for (const msg of messages) {
    await CometChat.markAsRead(
      msg.getId(),
      uid,
      CometChat.RECEIVER_TYPE.USER,
      userId
    );
  }
};

export const sendDirectMessage = async (
  receiverUid: string,
  text: string
): Promise<MessageType | null> => {
  const userId = await getCurrentUserId();
  if (!userId) throw new Error("❌ User ID not found");

  const message = new CometChat.TextMessage(
    receiverUid,
    text,
    CometChat.RECEIVER_TYPE.USER
  );
  const sentMessage = await CometChat.sendMessage(message);

  const mappedMessage: MessageType = {
    id: String(sentMessage.getId()),
    text:
      sentMessage instanceof CometChat.TextMessage
        ? sentMessage.getText() || ""
        : "",
    senderId: sentMessage.getSender()?.getUid() || "",
    senderName: sentMessage.getSender()?.getName() || "",
    sentAt: sentMessage.getSentAt() ?? Date.now(),
  };

  await processConversationFlow(receiverUid, userId);
  return mappedMessage;
};

export const processConversationFlow = async (
  receiverUid: string,
  userId: string
) => {
  let conversation = await CometChat.getConversation(
    receiverUid,
    CometChat.RECEIVER_TYPE.USER
  ).catch(() => null);
  const existingTags = conversation?.getTags()?.map(String) || [];
  const hasPinned = existingTags.some((tag: string) =>
    tag.startsWith(`pinned`)
  );
  const hasUnpinned = existingTags.some((tag: string) =>
    tag.startsWith(`unpinned`)
  );
  if (!hasPinned && !hasUnpinned) {
    await CometChat.tagConversation(receiverUid, CometChat.RECEIVER_TYPE.USER, [
      `unpinned${userId}`,
    ]);
  }
};

export const deleteConversation = async (
  receiverUid: string
): Promise<boolean> => {
  try {
    if (!receiverUid) throw new Error("❌ Invalid receiver UID");
    await CometChat.deleteConversation(
      receiverUid,
      CometChat.RECEIVER_TYPE.USER
    );
    return true;
  } catch (error) {
    console.error("❌ Error deleting chat:", error);
    return false;
  }
};

export const togglePinChat = async (receiverId: string, userId: string) => {
  const convo = await CometChat.getConversation(
    receiverId,
    CometChat.RECEIVER_TYPE.USER
  );
  if (!convo) return null;

  const tags = convo.getTags()?.map(String) || [];
  const pinnedTag = `pinned${userId}`;
  const unpinnedTag = `unpinned${userId}`;
  const isPinned = tags.includes(pinnedTag);

  const updatedTags = isPinned
    ? [...tags.filter((tag: string) => tag !== pinnedTag), unpinnedTag]
    : [...tags.filter((tag: string) => tag !== unpinnedTag), pinnedTag];

  return await CometChat.tagConversation(
    receiverId,
    CometChat.RECEIVER_TYPE.USER,
    updatedTags
  );
};
