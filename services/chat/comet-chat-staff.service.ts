let CometChat: any;

if (typeof window !== "undefined") {
  import("@cometchat/chat-sdk-react-native").then((module) => {
    CometChat = module.CometChat;
  });
}
import { getCurrentUserId } from "./comet-chat-users.service";
import { getRandomAvatar } from "@/utils/use-random-avatr";

const COMET_CHAT_AUTH_KEY = process.env.EXPO_PUBLIC_COMET_CHAT_AUTH_KEY!;

const createCometChatStaffWithGroup = async (
  userId: string,
  name: string,
  role: string,
  jobType: string
) => {
  if (typeof window === "undefined" || !CometChat) return;

  try {
    const creatorId = await getCurrentUserId();
    if (!creatorId) throw new Error("❌ No logged-in user found.");

    const createdUser = await CometChat.createUser(
      { uid: userId, name, role },
      COMET_CHAT_AUTH_KEY
    );

    createdUser.setMetadata({ jobType });
    await CometChat.updateUser(createdUser, COMET_CHAT_AUTH_KEY);

    return createdUser;
  } catch (error) {
    console.error("❌ CometChat user creation failed:", error);
    throw new Error("CometChat user creation failed");
  }
};

const getUserDetails = async (uid: string) => {
  try {
    const user = await CometChat.getUser(uid);
    const avatarUrl = getRandomAvatar(user.getName());
    const metadata = (user.getMetadata?.() || {}) as { jobType?: string };

    const conversation = await CometChat.getConversation(
      uid,
      CometChat.RECEIVER_TYPE.USER
    );
    if (!conversation) return null;

    const loggedUserId = await getCurrentUserId();
    const existingTags = (conversation.getTags() || []).map(String);

    const tag = existingTags.find((tag: string | string[]) =>
      tag.includes(loggedUserId ?? " ")
    );
    const isPinned = tag ? tag.startsWith("pinned") : null;

    return {
      name: user.getName(),
      avatar: user.getAvatar() || avatarUrl,
      jobType: metadata.jobType ?? null,
      isPinned,
    };
  } catch (error) {
    return null;
  }
};

export { createCometChatStaffWithGroup, getUserDetails };
