import { MainPage } from "@/components/core/bottom-tab-bar";

export function getNavBarPath(page: MainPage): string {
  switch (page) {
    case "Calendar":
      return "/home";
    case "Chats":
      return "/chats";
    case "Profile":
      return "/profile";
  }
}
