import AsyncStorage from "@react-native-async-storage/async-storage";
import { Fetcher } from "openapi-typescript-fetch";
import { Middleware } from "openapi-typescript-fetch";
import { paths } from "@/backend-sdk/schema";
import { APP_TOKEN } from "@/constants/primitives";
import { isAPIError } from "./error-handler";
import { REFRESH_TOKEN } from "@/constants/primitives";
import createClient, { wrapAsPathBasedClient } from "openapi-fetch";

const fetcher = Fetcher.for<paths>();

const attachAuthToken: Middleware = async (url, init, next) => {
  try {
    const token = await AsyncStorage.getItem(APP_TOKEN);
    if (!token) return await next(url, init);

    const newInit = {
      ...init,
      headers: {
        ...init.headers,
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    };
    return await next(url, newInit);
  } catch (error) {
    if (isAPIError(error) && error.status === 401) {
      const { success, accessToken } = await refresh();
      if (success && accessToken) {
        const newInit = {
          ...init,
          headers: {
            ...init.headers,
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
        };
        return await next(url, newInit);
      }
    }
    throw error;
  }
};

const isServer = typeof window === "undefined";
const baseUrl = isServer ? process.env.EXPO_PUBLIC_API_URL : "/backend";
const baseFetcher = createClient<paths>({
  baseUrl,
});
const refreshFetcher = wrapAsPathBasedClient(baseFetcher);

export const refresh = async () => {
  const refreshh = await AsyncStorage.getItem(REFRESH_TOKEN);
  try {
    const { data, error } = await refreshFetcher["/api/v1/auth/refresh"][
      "POST"
    ]({
      headers: { Authorization: `Bearer ${refreshh}` },
    });
    if (error) {
      return { success: false };
    }
    await AsyncStorage.setItem(APP_TOKEN, data.accessToken);
    await AsyncStorage.setItem(REFRESH_TOKEN, data.refreshToken);
    return { success: true, accessToken: data.accessToken };
  } catch (error) {
    return { success: false, accessToken: null };
  }
};

fetcher.configure({
  baseUrl: process.env.EXPO_PUBLIC_API_URL,
  use: [attachAuthToken],
});

export default fetcher;
