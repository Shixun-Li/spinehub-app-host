export type FontWeight =
  | "light"
  | "regular"
  | "medium"
  | "bold"
  | "semiBold"
  | "black";

export const monthNames = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

export const STATUS_OPTIONS = [
  "Contemplating",
  "Tentative",
  "Confirmed",
  "Finalised",
  "Cancelled",
  "InOR",
  "Closing",
  "Discharge",
] as const;
