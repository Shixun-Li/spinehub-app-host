import { CometChat } from "@cometchat/chat-sdk-react-native";
import { processConversationFlow } from "./comet-chat-staff-list.service";
import { MessageType, RNFile } from "@/types/types";
import { getCurrentUserId } from "./comet-chat-users.service";

const mapCometMessage = (
  msg: CometChat.BaseMessage,
  caption?: string,
  parentMessageId?: number
): MessageType => {
  const sender = msg.getSender?.();
  const isMedia = msg instanceof CometChat.MediaMessage;
  let fileUrl: string | undefined = undefined;
  let mimeType: string = "";

  if (isMedia) {
    const data = (msg as CometChat.MediaMessage).getData() as {
      attachments?: { url?: string; mimeType?: string }[];
    };
    const attachment = data.attachments?.[0];
    fileUrl = attachment?.url;
    mimeType = attachment?.mimeType || "";
  }

  return {
    id: String(msg.getId()),
    text:
      (msg as CometChat.TextMessage).getText?.() || caption || "[Media File]",
    senderId: sender?.getUid() || "",
    senderName: sender?.getName() || "",
    sentAt: msg.getSentAt() ?? Date.now(),
    parentMessageId: parentMessageId ? String(parentMessageId) : undefined,
    fileUrl,
    mimeType,
  };
};

export const sendGroupReplyMediaFile = async (
  groupId: string,
  parentMessageId: number,
  file: RNFile,
  caption: string
): Promise<MessageType | null> => {
  try {
    const userId = await getCurrentUserId();
    if (!userId) return null;

    const mediaMessage = new CometChat.MediaMessage(
      groupId,
      file,
      CometChat.MESSAGE_TYPE.FILE,
      CometChat.RECEIVER_TYPE.GROUP
    );

    mediaMessage.setParentMessageId(parentMessageId);
    mediaMessage.setMetadata({
      caption,
      readStatus: { [userId]: true },
    });

    const sentMessage = await CometChat.sendMediaMessage(mediaMessage);
    return mapCometMessage(sentMessage, caption, parentMessageId);
  } catch (error) {
    console.error("sendGroupReplyMediaFile error", error);
    return null;
  }
};

export const sendDirectMediaFile = async (
  receiverUid: string,
  file: RNFile,
  caption: string
): Promise<MessageType | null> => {
  try {
    const userId = await getCurrentUserId();
    if (!userId) return null;

    const mediaMessage = new CometChat.MediaMessage(
      receiverUid,
      file,
      CometChat.MESSAGE_TYPE.FILE,
      CometChat.RECEIVER_TYPE.USER
    );

    mediaMessage.setMetadata({
      caption,
      readStatus: { [userId]: true },
    });

    const sentMessage = await CometChat.sendMediaMessage(mediaMessage);
    processConversationFlow(receiverUid, userId);

    return mapCometMessage(sentMessage, caption);
  } catch (error) {
    console.error("sendDirectMediaFile error", error);
    return null;
  }
};

export const sendDirectLinkMessage = async (
  receiverUid: string,
  link: string,
  title: string
): Promise<MessageType | null> => {
  try {
    const userId = await getCurrentUserId();
    if (!userId || !link.trim() || !title.trim()) return null;

    const textMessage = new CometChat.TextMessage(
      receiverUid,
      `${title}\n${link}`,
      CometChat.RECEIVER_TYPE.USER
    );

    const sentMessage = await CometChat.sendMessage(textMessage);
    processConversationFlow(receiverUid, userId);

    return mapCometMessage(sentMessage, undefined);
  } catch (error) {
    console.error("sendDirectLinkMessage error", error);
    return null;
  }
};

export const sendGroupLinkMessage = async (
  groupId: string,
  parentMessageId: number,
  link: string,
  title: string
): Promise<MessageType | null> => {
  try {
    const userId = await getCurrentUserId();
    if (!userId) return null;

    const textMessage = new CometChat.TextMessage(
      groupId,
      `${title}\n${link}`,
      CometChat.RECEIVER_TYPE.GROUP
    );

    textMessage.setParentMessageId(parentMessageId);
    textMessage.setMetadata({
      caption: title,
      readStatus: { [userId]: true },
    });

    const sentMessage = await CometChat.sendMessage(textMessage);
    return mapCometMessage(sentMessage, title, parentMessageId);
  } catch (error) {
    console.error("sendGroupLinkMessage error", error);
    return null;
  }
};
