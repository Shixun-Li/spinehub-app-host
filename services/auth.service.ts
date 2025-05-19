import fetcher from "@/utils/fetcher";

export namespace AuthService {
  export const SignIn = fetcher
    .path("/api/v1/auth/sign-in")
    .method("post")
    .create();

  export const Refresh = fetcher
    .path("/api/v1/auth/refresh")
    .method("post")
    .create();

  export const ResetPasswordStart = fetcher
    .path("/api/v1/auth/reset-password/start")
    .method("put")
    .create();

  export const ResetPasswordCheck = fetcher
    .path("/api/v1/auth/reset-password/check")
    .method("put")
    .create();

  export const ResetPasswordFinish = fetcher
    .path("/api/v1/auth/reset-password/finish")
    .method("put")
    .create();

  export const GetMe = fetcher.path("/api/v1/auth/me").method("get").create();
}
