import fetcher from "@/utils/fetcher";

namespace BookingService {
  export const addBooking = fetcher
    .path("/api/v1/booking")
    .method("post")
    .create();
  export const getBooking = fetcher
    .path("/api/v1/booking")
    .method("get")
    .create();
  export const bookingDetail = fetcher
    .path("/api/v1/booking/{bookingId}")
    .method("get")
    .create();
  export const editBookingDetail = fetcher
    .path("/api/v1/booking/{bookingId}")
    .method("patch")
    .create();
  export const deleteBooking = fetcher
    .path("/api/v1/booking/{bookingId}")
    .method("delete")
    .create();
  export const statusBooking = fetcher
    .path("/api/v1/booking/{bookingId}/status")
    .method("put")
    .create();
}
export default BookingService;
