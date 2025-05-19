import fetcher from "@/utils/fetcher";

namespace CategoryService {
  export const addCategory = fetcher
    .path("/api/v1/settings/category")
    .method("post")
    .create();
  export const getCategory = fetcher
    .path("/api/v1/settings/category")
    .method("get")
    .create();
  export const editCategory = fetcher
    .path("/api/v1/settings/category/{categoryId}")
    .method("patch")
    .create();
  export const deleteCategory = fetcher
    .path("/api/v1/settings/category/{categoryId}")
    .method("delete")
    .create();
}
export default CategoryService;
