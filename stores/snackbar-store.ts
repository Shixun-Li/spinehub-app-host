import { SNACKBAR_TIMEOUT_MS } from "@/constants/primitives";
import { SnackbarSeverity } from "@/types/core";
import { create } from "zustand";

type Snack = {
  message: string;
  severity: SnackbarSeverity;
};

type SnackbarActions = {
  addSnack: (snack: Snack) => void;
  removeSnack: (snackToDelete: Snack) => void;
};

type SnackbarState = {
  snacks: Array<Snack>;
  actions: SnackbarActions;
};

const useSnackbarStore = create<SnackbarState>((set, get) => ({
  snacks: [],
  actions: {
    addSnack: (snack) => {
      const { snacks } = get();
      const updatedSnacks = [...snacks, snack];
      set(() => ({ snacks: updatedSnacks }));

      setTimeout(() => {
        const { snacks } = get();
        const filteredSnacks = snacks.filter((item) => item !== snack);
        set(() => ({ snacks: filteredSnacks }));
      }, SNACKBAR_TIMEOUT_MS);
    },
    removeSnack: (snackToDelete) => {
      const { snacks } = get();
      const filteredSnacks = snacks.filter((snack) => snack !== snackToDelete);
      set(() => ({ snacks: filteredSnacks }));
    },
  },
}));

export const useSnackbarActions = () =>
  useSnackbarStore((state) => state.actions);

export const useSnacks = () => useSnackbarStore((state) => state.snacks);

export default useSnackbarStore;
