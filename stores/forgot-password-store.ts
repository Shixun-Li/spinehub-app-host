import { create } from "zustand";
import { FORGOT_PASSWORD_INITIAL_STATE } from "@/constants/init-values";

export type ForgotPasswordDetails = {
  email: string;
  code: string;
  password: string;
};

type ForgotPasswordState = {
  forgotPasswordDetails: ForgotPasswordDetails;
  actions: ForgotPasswordActions;
};

type ForgotPasswordActions = {
  updateForgotPasswordDetails: (
    details: Partial<ForgotPasswordDetails>
  ) => void;
  clearForgotPasswordDetails: () => void;
};

const useForgotPasswordStore = create<ForgotPasswordState>((set, get) => ({
  forgotPasswordDetails: FORGOT_PASSWORD_INITIAL_STATE,
  actions: {
    updateForgotPasswordDetails: (details) => {
      const { forgotPasswordDetails } = get();
      set(() => ({
        forgotPasswordDetails: {
          ...forgotPasswordDetails,
          ...details,
        },
      }));
    },
    clearForgotPasswordDetails: () => {
      set(() => ({
        forgotPasswordDetails: FORGOT_PASSWORD_INITIAL_STATE,
      }));
    },
  },
}));

export const useForgotPasswordActions = () =>
  useForgotPasswordStore((state) => state.actions);

export const useForgotPasswordDetails = () =>
  useForgotPasswordStore((state) => state.forgotPasswordDetails);
