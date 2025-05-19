import { COMETCHAT_ITEMS_PER_PAGE } from "@/constants/primitives";
let CometChat: any;

if (typeof window !== "undefined") {
  import("@cometchat/chat-sdk-react-native").then((module) => {
    CometChat = module.CometChat;
  });
}
import InvalidateKeys from "../invalidate-keys";
import { QueryClient } from "@tanstack/react-query";
import { getCurrentUserId } from "./comet-chat-users.service";

interface GroupWithLastMessage {
  isPinned: boolean;
  lastMessage: {
    timestamp: number;
  } | null;
}
const fetchUserGroupChats = async (searchKeyword?: string) => {
  try {
    const userId = await getCurrentUserId();
    if (!userId) throw new Error("❌ User ID not found");

    const createGroupRequest = (tag: string) => {
      let request = new CometChat.GroupsRequestBuilder()
        .setLimit(COMETCHAT_ITEMS_PER_PAGE)
        .withTags(true)
        .setTags([tag])
        .joinedOnly(true);

      return searchKeyword ? request.setSearchKeyword(searchKeyword) : request;
    };

    const fetchAndProcessGroups = async (tag: string, isPinned: boolean) => {
      const groups = await createGroupRequest(tag).build().fetchNext();
      return Promise.all(
        groups.map(
          async (group: {
            getGuid: () => any;
            getName: () => any;
            getMembersCount: () => any;
          }) => {
            const guid = group.getGuid();
            return {
              group,
              guid,
              name: group.getName(),
              membersCount: group.getMembersCount(),
              unreadMessagesCount: 0,
              lastMessage: null,
              isPinned,
              groupThreads: [],
            } as GroupWithLastMessage;
          }
        )
      );
    };

    const [updatedPinnedGroups, updatedNormalGroups] = await Promise.all([
      fetchAndProcessGroups(`pinned${userId}`, true),
      fetchAndProcessGroups(`unpinned${userId}`, false),
    ]);

    const allGroups = [...updatedPinnedGroups, ...updatedNormalGroups];

    return allGroups.sort((a, b) => {
      if (a.isPinned !== b.isPinned) {
        return a.isPinned ? -1 : 1;
      }
      const timeA = a.lastMessage?.timestamp ?? 0;
      const timeB = b.lastMessage?.timestamp ?? 0;
      return timeB - timeA;
    });
  } catch (error) {
    console.error("❌ Error fetching groups:", error);
    return [];
  }
};

const sendReplyMessage = async (
  groupId: string,
  parentMessageId: number,
  message: string
) => {
  try {
    const userId = await getCurrentUserId();
    const textMessage = new CometChat.TextMessage(
      groupId,
      message,
      CometChat.RECEIVER_TYPE.GROUP
    );
    textMessage.setParentMessageId(parentMessageId);

    if (userId) {
      textMessage.setMetadata({ readStatus: { [userId]: true } });
    }

    return await CometChat.sendMessage(textMessage);
  } catch (error) {
    console.error("❌ Error sending message:", error);
    return null;
  }
};

const removeMessageListener = (listenerId: string) => {
  CometChat.removeMessageListener(listenerId);
};

const markThreadMessagesAsRead = async (groupId: string, threadId: number) => {
  try {
    const userId = await getCurrentUserId();
    if (!userId) return;

    const messages = await new CometChat.MessagesRequestBuilder()
      .setGUID(groupId)
      .setParentMessageId(threadId)
      .setLimit(100)
      .build()
      .fetchPrevious();

    if (!messages.length) return;
    const newest = messages[messages.length - 1];
    const newestMeta = (newest as any).metadata as Record<string, any>;
    if (newestMeta?.readStatus?.[userId]) return;

    const unread = messages.filter((m: any) => {
      const meta = (m as any).metadata as Record<string, any>;
      return !meta?.readStatus?.[userId];
    });

    for (const msg of unread) {
      const meta = ((msg as any).metadata || {}) as Record<string, any>;
      meta.readStatus = { ...(meta.readStatus || {}), [userId]: true };
      (msg as any).setMetadata(meta);
      await CometChat.editMessage(msg);
    }

    return "Read";
  } catch (error) {
    console.error("❌ Error updating read status for thread messages:", error);
  }
};

const initializeCometChatListeners = async (queryClient: QueryClient) => {
  const listenerId = "NEW_MESSAGE_LISTENER";

  try {
    await waitForCometChatInitialization();
    const user = await CometChat.getLoggedinUser();
    if (!user) {
      console.error("❌ No logged-in user. CometChat login required.");
      return;
    }
  } catch (error) {
    console.error("❌ CometChat initialization failed:", error);
    return;
  }

  CometChat.removeMessageListener(listenerId);
  CometChat.addMessageListener(
    listenerId,
    new CometChat.MessageListener({
      onTextMessageReceived: () => {
        InvalidateKeys.chatList?.(queryClient);
        InvalidateKeys.staffChatList?.(queryClient);
      },
      onMediaMessageReceived: () => {
        InvalidateKeys.chatList?.(queryClient);
        InvalidateKeys.staffChatList?.(queryClient);
      },
    })
  );
};

const waitForCometChatInitialization = async (): Promise<void> => {
  let retry = 0;
  while (!CometChat?.isInitialized?.()) {
    if (retry++ >= 10)
      throw new Error(
        "❌ CometChat failed to initialize after multiple attempts."
      );
    console.warn("⏳ Waiting for CometChat initialization...");
    await new Promise((r) => setTimeout(r, 500));
  }
};

const removeCometChatListeners = () => {
  CometChat.removeMessageListener("NEW_MESSAGE_LISTENER");
};

export {
  fetchUserGroupChats,
  sendReplyMessage,
  removeMessageListener,
  markThreadMessagesAsRead,
  initializeCometChatListeners,
  removeCometChatListeners,
  waitForCometChatInitialization,
};
