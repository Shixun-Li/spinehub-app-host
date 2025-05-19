import fetcher from "@/utils/fetcher";

namespace SettingsService {
  export const addRole = fetcher
    .path("/api/v1/settings/staff-role")
    .method("post")
    .create();
  export const getRole = fetcher
    .path("/api/v1/settings/staff-roles")
    .method("get")
    .create();
  export const editRole = fetcher
    .path("/api/v1/settings/staff-role/{staffRoleId}")
    .method("patch")
    .create();
  export const deleteRole = fetcher
    .path("/api/v1/settings/staff-role/{staffRoleId}")
    .method("delete")
    .create();

  export const addImplant = fetcher
    .path("/api/v1/settings/category/{categoryId}/implant")
    .method("post")
    .create();
  export const getImplant = fetcher
    .path("/api/v1/settings/category/{categoryId}/implant")
    .method("get")
    .create();
  export const editImplant = fetcher
    .path("/api/v1/settings/category/{categoryId}/implant/{implantId}")
    .method("patch")
    .create();
  export const deleteImplant = fetcher
    .path("/api/v1/settings/category/{categoryId}/implant/{implantId}")
    .method("delete")
    .create();

  export const addEquipment = fetcher
    .path("/api/v1/settings/category/{categoryId}/equipment")
    .method("post")
    .create();
  export const getEquipment = fetcher
    .path("/api/v1/settings/category/{categoryId}/equipment")
    .method("get")
    .create();
  export const editEquipment = fetcher
    .path("/api/v1/settings/category/{categoryId}/equipment/{equipmentId}")
    .method("patch")
    .create();
  export const deleteEquipment = fetcher
    .path("/api/v1/settings/category/{categoryId}/equipment/{equipmentId}")
    .method("delete")
    .create();

  export const addFlag = fetcher
    .path("/api/v1/settings/flag")
    .method("post")
    .create();
  export const getFlag = fetcher
    .path("/api/v1/settings/flags")
    .method("get")
    .create();
  export const editFlag = fetcher
    .path("/api/v1/settings/flag/{flagId}")
    .method("patch")
    .create();
  export const deleteFlag = fetcher
    .path("/api/v1/settings/flag/{flagId}")
    .method("delete")
    .create();
}
export default SettingsService;
