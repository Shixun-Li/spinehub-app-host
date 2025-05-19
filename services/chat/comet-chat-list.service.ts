import { COMETCHAT_ITEMS_PER_PAGE } from "@/constants/primitives";
let CometChat: any;

if (typeof window !== "undefined") {
  import("@cometchat/chat-sdk-react-native").then((module) => {
    CometChat = module.CometChat;
  });
}
import { getCurrentUserId } from "./comet-chat-users.service";
import { Thread } from "@/types/types";

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
        groups.map((group) => processGroupData(group, isPinned))
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

const processGroupData = async (group: CometChat.Group, isPinned: boolean) => {
  try {
    const guid = group.getGuid();
    const groupThreads = await getGroupThreads(guid);

    const totalUnreadReplies =
      groupThreads?.threads?.reduce(
        (sum, thread) => sum + Number(thread.unreadCount || 0),
        0
      ) || 0;

    const latestThread = groupThreads?.threads?.reduce<Thread | null>(
      (latest, thread) => {
        return thread.timestamp > (latest?.timestamp ?? 0) ? thread : latest;
      },
      null
    );

    let lastMessage = null;

    if (latestThread) {
      const messages = await new CometChat.MessagesRequestBuilder()
        .setGUID(guid)
        .setParentMessageId(latestThread.id)
        .setLimit(1)
        .build()
        .fetchPrevious();

      const msg = messages[0];
      lastMessage = msg
        ? {
            text: (msg as CometChat.TextMessage).getText?.() || "",
            sender: msg.getSender?.()?.getName?.() || "Unknown",
            timestamp: msg.getSentAt?.() ?? null,
          }
        : null;
    }

    return {
      group,
      guid,
      name: group.getName(),
      membersCount: group.getMembersCount(),
      unreadMessagesCount: totalUnreadReplies,
      lastMessage,
      isPinned,
      groupThreads: groupThreads?.threads || [],
    };
  } catch (error) {
    console.error(`❌ Error processing group ${group.getGuid()}:`, error);
    return {
      group,
      guid: group.getGuid(),
      name: group.getName(),
      membersCount: group.getMembersCount(),
      unreadMessagesCount: 0,
      lastMessage: null,
      isPinned,
      groupThreads: [],
    };
  }
};

const getGroupThreads = async (GUID: string) => {
  try {
    const userId = await getCurrentUserId();
    const group = await CometChat.getGroup(GUID);

    const threadRequest = new CometChat.MessagesRequestBuilder()
      .setGUID(GUID)
      .setLimit(20)
      .setTags([userId ?? ""])
      .withTags(true)
      .build();

    const parentMessages = await threadRequest.fetchPrevious();

    const validMessages = parentMessages.filter(
      (msg) =>
        (msg as CometChat.TextMessage).getText?.()?.trim() !== "" &&
        msg.getId?.() !== undefined
    );

    const threadMessages = await Promise.all(
      validMessages.map(async (msg) => {
        const latestMessages = await new CometChat.MessagesRequestBuilder()
          .setGUID(GUID)
          .setParentMessageId(msg.getId())
          .setLimit(1)
          .build()
          .fetchPrevious();

        return {
          id: msg.getId(),
          text: (msg as CometChat.TextMessage).getText(),
          unreadCount: await getUnreadCount(GUID, msg.getId()),
          timestamp: latestMessages[0]?.getSentAt?.() ?? 0,
        };
      })
    );

    return { group, threads: threadMessages };
  } catch (error) {
    console.error("❌ Error fetching group threads:", error);
    return null;
  }
};

const getUnreadCount = async (
  GUID: string,
  parentMessageId: number | string
) => {
  try {
    const userId = await getCurrentUserId();
    if (!userId) return 0;

    const messagesRequest = new CometChat.MessagesRequestBuilder()
      .setGUID(GUID)
      .setParentMessageId(Number(parentMessageId))
      .setLimit(50)
      .build();

    const childMessages = await messagesRequest.fetchPrevious();

    let unreadCount = 0;
    for (const msg of childMessages) {
      const meta = (msg as CometChat.TextMessage).getMetadata?.() as {
        readStatus?: { [userId: string]: boolean };
      };
      if (!meta?.readStatus || !meta.readStatus[userId]) {
        unreadCount++;
      }
    }
    return unreadCount;
  } catch (error) {
    console.error("❌ Error fetching unread count:", error);
    return 0;
  }
};

export { fetchUserGroupChats, getGroupThreads };
