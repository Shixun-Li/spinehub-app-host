"use client";

import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useRef,
  ReactNode,
} from "react";
import CometChatService from "@/services/chat/comet-chat-auth.service";

interface CometChatContextType {
  isInitialized: boolean;
}

const CometChatContext = createContext<CometChatContextType | undefined>(
  undefined
);

export const CometChatProvider = ({ children }: { children: ReactNode }) => {
  const [isInitialized, setIsInitialized] = useState(false);
  const hasInitialized = useRef(false);
  useEffect(() => {
    if (typeof window !== "undefined" && !hasInitialized.current) {
      hasInitialized.current = true;
      (async () => {
        try {
          await CometChatService.initializeCometChat();
          // initializeCometChat() doesn't return anything, but if no error, we assume success
          setIsInitialized(true);
        } catch (error) {
          console.error("Error initializing CometChat:", error);
          setIsInitialized(false);
        }
      })();
    }
  }, []);

  return (
    <CometChatContext.Provider value={{ isInitialized }}>
      {children}
    </CometChatContext.Provider>
  );
};

export const useCometChat = () => {
  const context = useContext(CometChatContext);
  if (!context) {
    throw new Error("useCometChat must be used within a CometChatProvider");
  }
  return context;
};
