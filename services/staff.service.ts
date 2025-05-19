import fetcher from "@/utils/fetcher";

namespace StaffService {
  export const addStaff = fetcher.path("/api/v1/staff").method("post").create();
  export const getStaff = fetcher.path("/api/v1/staff").method("get").create();
  export const staffDetail = fetcher
    .path("/api/v1/staff/{staffId}")
    .method("get")
    .create();
  export const editStaffDetail = fetcher
    .path("/api/v1/staff/{staffId}")
    .method("patch")
    .create();
  export const deleteStaff = fetcher
    .path("/api/v1/staff/{staffId}")
    .method("delete")
    .create();
  export const activateStaff = fetcher
    .path("/api/v1/staff/{staffId}/activate")
    .method("put")
    .create();
  export const deactivateStaff = fetcher
    .path("/api/v1/staff/{staffId}/deactivate")
    .method("put")
    .create();
}
export default StaffService;
