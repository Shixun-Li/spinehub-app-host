// import { UserForgotPasswordFinishDto } from '@/types/user';

export const FORGOT_PASSWORD_INITIAL_STATE: any & {
  confirmPassword: string;
} = {
  email: "",
  code: "",
  password: "",
  confirmPassword: "",
};

// export const FORGOT_PASSWORD_INITIAL_STATE: UserForgotPasswordFinishDto & {
// 	confirmPassword: string;
// } = {
// 	email: '',
// 	code: '',
// 	password: '',
// 	confirmPassword: '',
// };
