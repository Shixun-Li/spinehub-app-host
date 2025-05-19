import { z } from "zod";
import {
  emailValidation,
  passwordValidation,
  phoneNumberValidation,
  confirmNewPasswordValidation,
  confirmPasswordValidation,
  verificationCodeValidation,
} from "./validation-fields";

export const signInSchema = z.object({
  email: emailValidation,
  password: passwordValidation,
});

export const editProfileSchema = z.object({
  email: emailValidation,
  phoneNumber: phoneNumberValidation,
});

export const changePasswordSchema = z
  .object({
    currentPassword: passwordValidation,
    newPassword: passwordValidation,
    newConfirmPassword: confirmNewPasswordValidation,
  })
  .superRefine(({ newPassword, newConfirmPassword }, ctx) => {
    if (newPassword !== newConfirmPassword) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Passwords must match",
        path: ["newConfirmPassword"],
      });
    }
  });

export const emailSchema = z.object({
  email: emailValidation,
});

export const passwordSchema = z
  .object({
    password: passwordValidation,
    confirmPassword: confirmPasswordValidation,
  })
  .superRefine(({ password, confirmPassword }, ctx) => {
    if (password !== confirmPassword) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Passwords must match",
        path: ["confirmPassword"],
      });
    }
  });

export const verificationCodeSchema = z.object({
  code: verificationCodeValidation,
});
