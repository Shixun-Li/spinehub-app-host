import dayjs from "dayjs";
import isBetween from "dayjs/plugin/isBetween";
import customParseFormat from "dayjs/plugin/customParseFormat";
import { StatusType } from "@/components/calendar/status-select-modal";
import { Platform } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Dimensions } from "react-native";
import { PatientData } from "@/types/backend-types";

export const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  const today = new Date();

  const isToday =
    date.getFullYear() === today.getFullYear() &&
    date.getMonth() === today.getMonth() &&
    date.getDate() === today.getDate();

  if (isToday) {
    return "Today";
  }

  return date.toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  });
};

export const formatTime = (isoString: string | null | undefined) => {
  if (!isoString) return "No Time";
  const date = new Date(isoString);
  return date.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
};

export const getDuration = (startDate?: string, endDate?: string) => {
  if (!startDate || !endDate) return "N/A";

  const start = new Date(startDate);
  const end = new Date(endDate);

  const diffMs = end.getTime() - start.getTime();
  const diffMins = Math.floor(diffMs / 1000 / 60);

  if (diffMins < 0) return "Invalid time";

  const hours = Math.floor(diffMins / 60);
  const minutes = diffMins % 60;

  if (hours > 0) {
    return `${hours}h ${minutes}m`;
  }
  return `${minutes}m`;
};

export const formatDOB = (dob: string | undefined): string => {
  if (!dob) return "N/A";
  const date = new Date(dob);
  return date.toLocaleDateString("en-GB");
};

export const formatFullAddress = (
  address?: {
    id: string;
    street: string;
    suburb: string;
    state: string;
    postcode: string;
    country: string;
  } | null
): string => {
  if (!address) return "N/A";
  return `${address.street}, ${address.suburb}, ${address.state} ${address.postcode} `;
};

export const formatPhoneNumber = (phone: string | null) => {
  if (!phone) return "";
  const cleaned = phone.replace(/\D/g, "");
  if (cleaned.length === 10) {
    const formatted = `+61 ${cleaned.slice(1, 4)} ${cleaned.slice(
      4,
      7
    )} ${cleaned.slice(7)}`;
    return formatted;
  }
  return phone;
};
dayjs.extend(isBetween);
dayjs.extend(isBetween);
dayjs.extend(customParseFormat);
export function formatLastMessageTime(dateString: string): string {
  const cleanedDateString = dateString
    .normalize("NFKC")
    .replace(/[\u202f\u00a0\u2000-\u200B]/g, " ")
    .replace(/\b(am|pm)\b/i, (match) => match.toUpperCase())
    .trim();

  const date = dayjs(cleanedDateString, "D/M/YYYY, h:mm:ss A", true);
  if (!date.isValid()) {
    console.warn("Invalid date:", cleanedDateString);
    return "Invalid Date";
  }

  const now = dayjs();
  if (date.isSame(now, "day")) {
    return date.format("h:mm A");
  }
  if (date.isBetween(now.startOf("week"), now.endOf("week"), "day", "[]")) {
    return date.format("dddd");
  }
  return date.format("D MMM");
}

export const allowedNextStatuses: Record<StatusType, StatusType[]> = {
  Contemplating: [],
  Tentative: [],
  Confirmed: [],
  Finalised: ["InOR", "Closing", "Discharge"],
  Cancelled: [],
  InOR: ["Closing", "Discharge"],
  Closing: ["Discharge"],
  Discharge: [],
};
export const SCREEN_HEIGHT = Dimensions.get("window").height;
export const isSmallDevice = SCREEN_HEIGHT < 750;

export const useKeyboardOffset = () => {
  const insets = useSafeAreaInsets();
  if (Platform.OS !== "ios") return 0;
  const dynamicOffset = SCREEN_HEIGHT * 0.01;
  return dynamicOffset + insets.top;
};
export const mapToPatient = (user: PatientData) => ({
  userId: user.id ?? "",
  gender: user.patient?.gender ?? "Male",
  dob: user.patient?.dob ?? "",
  user: {
    ...user,
    staff: {
      companyName: null,
      companyPosition: null,
      userId: user.id ?? "",
      roleId: "",
    },
  },
});

export const normalizeUrl = (url: string) => {
  if (!url.startsWith("http://") && !url.startsWith("https://")) {
    return `https://${url}`;
  }
  return url;
};
