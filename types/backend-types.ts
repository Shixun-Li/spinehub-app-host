import { components } from "@/backend-sdk/schema";

export type UserLoggedIn = components["schemas"]["UserPayloadDto"];

export type PatientList = components["schemas"]["UserPatientListResultDto"];
export type Patient = components["schemas"]["PatientPayloadBookingDto"];
export type PatientData = components["schemas"]["UserPatientPayloadDto"];

export type StaffList = components["schemas"]["UserStaffListResultDto"];
export type Staff = components["schemas"]["UserStaffPayloadDto"];

export type StaffAccessLevel =
  components["schemas"]["UserStaffCreateDto"]["accessLevel"];

export type StaffRole =
  components["schemas"]["UserStaffCreateDto"]["staff"]["roleId"];

export type Role = components["schemas"]["StaffRoleBaseDto"];

export type CreatStaff = components["schemas"]["UserStaffCreateDto"];

export type Template = components["schemas"]["TemplateBaseDto"];

export type Surgery = components["schemas"]["SurgeryBaseDto"];

export type SurgeryDetails = components["schemas"]["SurgeryDetailCreateDto"];

export type SurgeryList = components["schemas"]["SurgeryPayloadDto"];

export type Team = components["schemas"]["SurgeryStaffPayloadDto"];

export type Equipment = components["schemas"]["SurgeryItemBaseDto"];

export type Implants = components["schemas"]["SurgeryItemPayloadDto"];

export type mbsItems = components["schemas"]["SurgeryItemPayloadDto"];

export type CreateBooking = components["schemas"]["BookingCreateDto"];

export type Booking = components["schemas"]["BookingListPayloadDto"];

export type BookingData = components["schemas"]["BookingPayloadDto"];

export type Event = components["schemas"]["EventDatePayloadDto"];

export type BookingStatus =
  components["schemas"]["BookingListPayloadDto"]["status"];

export type EventData = components["schemas"]["EventPayloadDto"];
export type CalendarItem =
  components["schemas"]["CalendarBookingListResultDto"];
