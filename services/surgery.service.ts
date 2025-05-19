import fetcher from "@/utils/fetcher";

namespace SurgeryService {
  export const addSurgery = fetcher
    .path("/api/v1/template/{templateId}/surgery")
    .method("post")
    .create();
  export const getSurgeryList = fetcher
    .path("/api/v1/template/{templateId}/surgery")
    .method("get")
    .create();
  export const getSurgery = fetcher
    .path("/api/v1/template/{templateId}/surgery/{surgeryId}")
    .method("get")
    .create();
  export const editSurgery = fetcher
    .path("/api/v1/template/{templateId}/surgery/{surgeryId}")
    .method("patch")
    .create();
  export const deleteSurgery = fetcher
    .path("/api/v1/template/{templateId}/surgery/{surgeryId}")
    .method("delete")
    .create();
  export const editSurgeryDetial = fetcher
    .path("/api/v1/template/{templateId}/surgery/{surgeryId}/details")
    .method("put")
    .create();
  export const getSurgeryDetial = fetcher
    .path("/api/v1/template/{templateId}/surgery/{surgeryId}/details")
    .method("get")
    .create();

  export const getTeam = fetcher
    .path("/api/v1/template/{templateId}/surgery/{surgeryId}/team")
    .method("get")
    .create();

  export const updateTeam = fetcher
    .path("/api/v1/template/{templateId}/surgery/{surgeryId}/team")
    .method("put")
    .create();

  export const updateEquipment = fetcher
    .path("/api/v1/template/{templateId}/surgery/{surgeryId}/equipments")
    .method("put")
    .create();

  export const updateImplant = fetcher
    .path("/api/v1/template/{templateId}/surgery/{surgeryId}/implants")
    .method("put")
    .create();

  export const getMbsItem = fetcher
    .path("/api/v1/template/{templateId}/surgery/{surgeryId}/mbs-items")
    .method("get")
    .create();

  export const updateMbsItem = fetcher
    .path("/api/v1/template/{templateId}/surgery/{surgeryId}/mbs-items")
    .method("put")
    .create();
}
export default SurgeryService;
