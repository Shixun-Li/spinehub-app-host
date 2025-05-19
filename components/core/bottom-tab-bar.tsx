import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React, { useEffect, useState } from "react";
import { COLORS } from "@/constants/theme";
import { usePathname, useRouter } from "expo-router";
import { getNavBarPath } from "@/utils/navigation";
import CalendarIcon from "@/assets/svgs/icons/calendar-icon";
import ChatsIcon from "@/assets/svgs/icons/chats-icon";
import ProfileIcon from "@/assets/svgs/icons/profile-icon";
import { isSmallDevice } from "@/utils/formator";

export type MainPage = "Calendar" | "Chats" | "Profile";
const MAIN_PAGES: MainPage[] = ["Calendar", "Chats", "Profile"];

const BottomTabBar = () => {
  const pathName = usePathname();
  const [selectedPage, setSelectedPage] = useState<MainPage>("Calendar");

  useEffect(() => {
    const matchedPage = MAIN_PAGES.find((page) => {
      const path = getNavBarPath(page);
      return pathName === path || pathName.startsWith(`${path}/`);
    });

    if (matchedPage) {
      setSelectedPage(matchedPage);
    }
  }, [pathName]);

  return (
    <View style={styles.bar}>
      {MAIN_PAGES.map((page) => {
        const isFocus = page === selectedPage;
        return (
          <Tab
            key={page}
            page={page}
            isFocus={isFocus}
            setSelectedPage={setSelectedPage}
          />
        );
      })}
    </View>
  );
};

const Tab = ({
  page,
  isFocus,
  setSelectedPage,
}: {
  page: MainPage;
  isFocus: boolean;
  setSelectedPage: React.Dispatch<React.SetStateAction<MainPage>>;
}) => {
  const router = useRouter();

  function handleTabPress() {
    const targetPath = getNavBarPath(page);
    router.replace(targetPath as Parameters<typeof router.replace>[0]);
    setSelectedPage(page);
  }

  const iconColor = isFocus ? COLORS.navy1000 : "rgba(18, 27, 54, 0.4)";

  const renderIcon = () => {
    switch (page) {
      case "Calendar":
        return <CalendarIcon color={iconColor} />;
      case "Chats":
        return <ChatsIcon color={iconColor} />;
      case "Profile":
        return <ProfileIcon color={iconColor} />;
    }
  };

  return (
    <TouchableOpacity style={styles.tab} onPress={handleTabPress}>
      {renderIcon()}
      <Text style={[styles.text, isFocus && { color: COLORS.navy1000 }]}>
        {page}
      </Text>
    </TouchableOpacity>
  );
};

export default BottomTabBar;

const styles = StyleSheet.create({
  bar: {
    backgroundColor: COLORS.smoke1000,
    width: "100%",
    justifyContent: "space-between",
    gap: 8,
    paddingTop: isSmallDevice ? 0 : 8,
    flexDirection: "row",
    paddingBottom: isSmallDevice ? 8 : 0,
  },
  tab: {
    flex: 1,
    alignItems: "center",
    justifyContent: "space-between",
    flexDirection: "column",
    gap: 2,
  },
  text: {
    color: COLORS.navy400,
  },
  icon: { width: 32, height: 32, borderWidth: 1, padding: 2, borderRadius: 4 },
});
