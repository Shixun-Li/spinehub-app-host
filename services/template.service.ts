import fetcher from "@/utils/fetcher";

namespace TemplateService {
  export const addTemplate = fetcher
    .path("/api/v1/template")
    .method("post")
    .create();
  export const getTemplate = fetcher
    .path("/api/v1/template")
    .method("get")
    .create();
  export const editTemplate = fetcher
    .path("/api/v1/template/{templateId}")
    .method("patch")
    .create();
  export const deleteTemplate = fetcher
    .path("/api/v1/template/{templateId}")
    .method("delete")
    .create();
}
export default TemplateService;
