import { User } from "@/types/user";
import { create } from "zustand";

export type States = {
  user?: User;
  viewedTutorial: boolean;
};

export type Actions = {
  setUser: (user: User) => void;
  setViewedTutorial: (viewedTutorial: boolean) => void;
};

const useUserStore = create<States & Actions>((set) => ({
  user: undefined,
  viewedTutorial: false,
  setUser(user) {
    set({ user });
  },
  setViewedTutorial(viewedTutorial) {
    set({ viewedTutorial });
  },
}));

export default useUserStore;
