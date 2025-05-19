import { z } from "zod";

const AUSTRALIAN_PHONE_REGEX = /^(?:\+?61|0)[2-478](?:[ -]?\d){8}$/;

export const emailValidation = z
  .string({ required_error: "Email is required" })
  .email({ message: "Must be a valid email" });

export const passwordValidation = z
  .string({ required_error: "Required" })
  .min(8, { message: "Password must be at least 8 characters long" })
  .regex(/[a-z]/, {
    message: "Password must contain at least one lowercase letter",
  })
  .regex(/[A-Z]/, {
    message: "Password must contain at least one uppercase letter",
  })
  .regex(/\d/, {
    message: "Password must contain at least one numerical value",
  })
  .regex(/[@$!%*?&]/, {
    message: "Password must contain at least one special character",
  });

export const phoneNumberValidation = z
  .string()
  .regex(AUSTRALIAN_PHONE_REGEX, {
    message: "Invalid Australian phone number.",
  })
  .optional();

export const confirmNewPasswordValidation = z
  .string({ required_error: "Required" })
  .min(1, { message: "Required" });

export const confirmPasswordValidation = z
  .string({ required_error: "Required" })
  .min(1, { message: "Required" });

export const verificationCodeValidation = z
  .string({ required_error: "Required" })
  .regex(/^\d{6}$/, { message: "Code must be exactly 6 numbers" });
