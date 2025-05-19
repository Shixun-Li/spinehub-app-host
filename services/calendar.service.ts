import fetcher from "@/utils/fetcher";

namespace CalendarService {
  export const getCalendar = fetcher
    .path("/api/v1/calendar/bookings")
    .method("get")
    .create();
  export const addEvent = fetcher
    .path("/api/v1/calendar/event")
    .method("post")
    .create();
  export const getEvent = fetcher
    .path("/api/v1/calendar/event")
    .method("get")
    .create();
  export const getEventDetail = fetcher
    .path("/api/v1/calendar/event/{eventId}")
    .method("get")
    .create();
  export const addEventDetail = fetcher
    .path("/api/v1/calendar/event/{eventId}")
    .method("put")
    .create();
  export const deleteEventDetail = fetcher
    .path("/api/v1/calendar/event/{eventId}")
    .method("delete")
    .create();
}
export default CalendarService;
