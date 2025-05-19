import React, { useEffect, useRef, useState } from "react";
import {
  FlatList,
  StyleSheet,
  View,
  Image,
  TouchableOpacity,
  Linking,
  Keyboard,
  Platform,
  NativeSyntheticEvent,
  NativeScrollEvent,
  InteractionManager,
} from "react-native";
import { MessageType } from "@/types/types";
import ChatDivider from "./chat-divider";
import ChatMessage from "./chat-message";
import LinkCard from "./link-card";
import AppText from "../core/app-text";

type Props = {
  messages: MessageType[];
  currentUserId: string;
};

const ChatConversation = ({ messages, currentUserId }: Props) => {
  const flatListRef = useRef<FlatList>(null);
  const [isAtBottom, setIsAtBottom] = useState(true);
  const [didInitialScroll, setDidInitialScroll] = useState(false);

  useEffect(() => {
    if (!didInitialScroll && messages.length > 0) {
      setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: false });
        setDidInitialScroll(true);
      }, 100);
    }
  }, [messages, didInitialScroll]);
  useEffect(() => {
    if (!didInitialScroll && messages.length > 0) {
      requestAnimationFrame(() => {
        InteractionManager.runAfterInteractions(() => {
          setTimeout(() => {
            flatListRef.current?.scrollToEnd({ animated: false });
            setDidInitialScroll(true);
          }, 50);
        });
      });
    }
  }, [messages, didInitialScroll]);
  useEffect(() => {
    if (didInitialScroll) {
      InteractionManager.runAfterInteractions(() => {
        if (isAtBottom) {
          flatListRef.current?.scrollToEnd({ animated: true });
        }
      });
    }
  }, [messages]);

  useEffect(() => {
    const handleKeyboardShow = () => {
      setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: true });
      }, 100);
    };

    const handleKeyboardHide = () => {
      setIsAtBottom(false);
    };

    const showSub = Keyboard.addListener(
      Platform.OS === "ios" ? "keyboardWillShow" : "keyboardDidShow",
      handleKeyboardShow
    );
    const hideSub = Keyboard.addListener(
      Platform.OS === "ios" ? "keyboardWillHide" : "keyboardDidHide",
      handleKeyboardHide
    );

    return () => {
      showSub.remove();
      hideSub.remove();
    };
  }, []);

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const { contentOffset, contentSize, layoutMeasurement } = event.nativeEvent;
    const paddingToBottom = 24;
    const isBottom =
      contentOffset.y + layoutMeasurement.height + paddingToBottom >=
      contentSize.height;
    setIsAtBottom(isBottom);
  };

  const handleContentChange = () => {
    if (isAtBottom) {
      setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }
  };
  let lastDate: string | null = null;

  const renderItem = ({ item }: { item: MessageType }) => {
    const dateObj = new Date(item.sentAt * 1000);
    const dateString = dateObj.toLocaleDateString();
    const timeString = dateObj.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });

    const author: "self" | "other" =
      item.senderId === currentUserId ? "self" : "other";

    const showDivider = dateString !== lastDate;
    if (showDivider) lastDate = dateString;

    const linkRegex = /((https?:\/\/|www\.)[^\s]+)/gi;
    const hasLink = linkRegex.test(item.text ?? "");
    const linkUrl = (item.text?.match(linkRegex) || [])[0] ?? "";
    const isImage = item.mimeType?.startsWith("image/");
    const isFile = !!item.fileUrl && !isImage && !hasLink;

    return (
      <View>
        {showDivider && <ChatDivider date={dateString} />}
        <ChatMessage name={item.senderName} author={author} time={timeString}>
          {isImage ? (
            <TouchableOpacity
              onPress={() => Linking.openURL(item.fileUrl ?? "")}
            >
              <Image
                source={{ uri: item.fileUrl }}
                style={styles.image}
                resizeMode="cover"
              />
            </TouchableOpacity>
          ) : isFile ? (
            <LinkCard
              author={author}
              link={item.fileUrl ?? ""}
              title={item.text?.split("\n")[0] ?? "Link"}
              isFile
            />
          ) : hasLink ? (
            <LinkCard
              author={author}
              link={linkUrl}
              title={item.text?.split("\n")[0] ?? "Link"}
            />
          ) : (
            <AppText color={author === "self" ? "smoke1000" : "navy1000"}>
              {item.text}
            </AppText>
          )}
        </ChatMessage>
      </View>
    );
  };

  return (
    <FlatList
      ref={flatListRef}
      data={messages}
      keyExtractor={(item) => item.id}
      renderItem={renderItem}
      onScroll={handleScroll}
      contentContainerStyle={styles.container}
      onContentSizeChange={handleContentChange}
      showsVerticalScrollIndicator={false}
    />
  );
};

export default ChatConversation;

const styles = StyleSheet.create({
  container: {
    paddingVertical: 8,
    gap: 8,
  },
  image: {
    width: 200,
    height: 200,
    borderRadius: 8,
  },
  text: {
    fontSize: 14,
    color: "#333",
  },
});
