import AsyncStorage from "@react-native-async-storage/async-storage";

namespace CometChatService {
  const COMET_CHAT_REGION = process.env.EXPO_PUBLIC_COMET_CHAT_REGION;
  const COMET_CHAT_APP_ID = process.env.EXPO_PUBLIC_COMET_CHAT_APP_ID;
  const COMET_CHAT_AUTH_KEY = process.env.EXPO_PUBLIC_COMET_CHAT_AUTH_KEY;
  let CometChat: any;

  const loadCometChat = async () => {
    if (!CometChat) {
      const module = await import("@cometchat/chat-sdk-react-native");
      CometChat = module.CometChat;
    }
  };

  export const initializeCometChat = async () => {
    try {
      await loadCometChat();

      const cometChatAppSetting = new CometChat.AppSettingsBuilder()
        .subscribePresenceForAllUsers()
        .setRegion(COMET_CHAT_REGION)
        .autoEstablishSocketConnection(true)
        .build();

      await CometChat.init(COMET_CHAT_APP_ID, cometChatAppSetting);
      console.log("cometChat succesfully initialized");
    } catch (error) {
      console.log("Initialization failed with error:", error);
    }
  };
  export const cometChatLogin = async (userId: string) => {
    try {
      await CometChat.login(userId, COMET_CHAT_AUTH_KEY).then(() => {});
    } catch (error) {
      console.log(
        "Error while logging inside the comet chat",
        JSON.stringify(error, null, 4)
      );
    }
  };

  export const getCurrentUserRole = async (): Promise<string | null> => {
    const storedRole = AsyncStorage.getItem("cometChatRole");
    if (storedRole) return storedRole;

    const user = await CometChat.getLoggedinUser();
    if (!user) return null;

    const role = user.getRole();
    if (!role) return null;

    AsyncStorage.setItem("cometChatRole", role);
    return role;
  };
}
export default CometChatService;
