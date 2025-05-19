import useUserStore from "@/stores/user-store";
let CometChat: any;

if (typeof window !== "undefined") {
  import("@cometchat/chat-sdk-react-native").then((module) => {
    CometChat = module.CometChat;
  });
}
import AsyncStorage from "@react-native-async-storage/async-storage";

const APP_ID = process.env.EXPO_PUBLIC_COMET_CHAT_APP_ID ?? "";
const REGION = process.env.EXPO_PUBLIC_COMET_CHAT_REGION ?? "";
const API_KEY = process.env.EXPO_PUBLIC_COMET_CHAT_API_KEY ?? "";

const getCurrentUserId = async (): Promise<string | null> => {
  try {
    const userIdFromStore = useUserStore.getState().user?.id;

    if (userIdFromStore) return userIdFromStore;

    const userInfo = await CometChat.getLoggedinUser();
    if (!userInfo) return null;

    const uid = userInfo.getUid();
    await AsyncStorage.setItem("cometChatUid", uid);
    return uid;
  } catch (error) {
    console.error("❌ Error fetching logged-in user:", error);
    return null;
  }
};

const deleteStaffUser = async (uid: string) => {
  const url = `https://api-${REGION}.cometchat.io/v3/users/${uid}`;

  await fetch(url, {
    method: "DELETE",
    headers: {
      appId: APP_ID,
      apiKey: API_KEY,
      "Content-Type": "application/json",
    },
  });
};

export { deleteStaffUser, getCurrentUserId };
