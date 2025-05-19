export type SignInFormData = {
  email: string;
  password: string;
};

export type SignUpFormData = {
  firstName: string;
  lastName: string;
  email: string;
  code: string;
  password: string;
  confirmPassword: string;
};

export type SignUpStep = "password" | "userDetails";

export type EditProfileData = {
  email: string;
  phoneNumber?: string;
};

export type ChangePasswordFormData = {
  currentPassword: string;
  newPassword: string;
  newConfirmPassword: string;
};

export type EmailFormData = Pick<SignUpFormData, "email">;
export type PasswordFormData = Pick<
  SignUpFormData,
  "password" | "confirmPassword"
>;
export type VerificationCodeFormData = Pick<SignUpFormData, "code">;
