let CometChat: any;

if (typeof window !== "undefined") {
  import("@cometchat/chat-sdk-react-native").then((module) => {
    CometChat = module.CometChat;
  });
}
import { getCurrentUserId } from "./comet-chat-users.service";

const COMET_CHAT_AUTH_KEY = process.env.EXPO_PUBLIC_COMET_CHAT_AUTH_KEY!;
const COMET_CHAT_GODMINID = process.env.EXPO_PUBLIC_COMET_CHAT_GODMINID;

const createGeneralThread = async (
  groupId: string,
  creatorId: string,
  patientId: string
) => {
  if (typeof window === "undefined" || !CometChat) return;
  try {
    const userId = await getCurrentUserId();
    if (!userId) throw new Error("❌ No logged-in user found.");

    const createTextMessage = (text: string, parentMessageId?: number) => {
      const message = new CometChat.TextMessage(
        groupId,
        text,
        CometChat.RECEIVER_TYPE.GROUP
      );
      if (parentMessageId) {
        message.setParentMessageId(parentMessageId);
      } else {
        const tags = ["thread", "general", creatorId, patientId];
        if (creatorId !== COMET_CHAT_GODMINID && COMET_CHAT_GODMINID) {
          tags.push(COMET_CHAT_GODMINID);
        }
        message.setTags(tags as string[]);
      }

      if (userId && COMET_CHAT_GODMINID) {
        const metadata = {
          readStatus: {
            [creatorId]: true,
            [userId]: true,
            ...(creatorId !== COMET_CHAT_GODMINID
              ? { [COMET_CHAT_GODMINID]: true }
              : {}),
          },
        };
        message.setMetadata(metadata);
      }
      return message;
    };

    const parentMessage = await CometChat.sendMessage(
      createTextMessage("General")
    );
    const sentReply = await CometChat.sendMessage(
      createTextMessage(
        "This is a reply to the General thread.",
        parentMessage.getId()
      )
    );
    return { parentMessage, reply: sentReply };
  } catch (error) {
    console.error("❌ General thread creation failed:", error);
    throw error;
  }
};

const updateCometChatPatientName = async (uid: string, fullName: string) => {
  if (typeof window === "undefined" || !CometChat) return;
  const groupId = `group_${uid}`;
  const user = await CometChat.getUser(uid);
  user.setName(fullName);
  await CometChat.updateUser(user, COMET_CHAT_AUTH_KEY);
  const group = await CometChat.getGroup(groupId);
  group.setName(fullName);
  await CometChat.updateGroup(group);
};

const updateCometChatStaffProfile = async (
  uid: string,
  fullName: string,
  roleId: string,
  jobType: string
) => {
  if (typeof window === "undefined" || !CometChat) return;
  const user = await CometChat.getUser(uid);
  user.setName(fullName);
  user.setRole(roleId);
  user.setMetadata({ ...(user.getMetadata() || {}), jobType });
  await CometChat.updateUser(user, COMET_CHAT_AUTH_KEY);
};

export {
  updateCometChatPatientName,
  updateCometChatStaffProfile,
  createGeneralThread,
};
