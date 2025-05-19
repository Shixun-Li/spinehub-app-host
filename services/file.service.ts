import { RNFile } from "@/types/types";
import fetcher from "@/utils/fetcher";
import axios from "axios";
import dayjs from "dayjs";

namespace FileService {
  export const getUploadUrl = fetcher
    .path("/api/v1/files/upload/{rootFolder}")
    .method("get")
    .create();

  export const download = fetcher
    .path("/api/v1/files/download")
    .method("get")
    .create();

  export const downloadResize = fetcher
    .path("/api/v1/files/download/resize")
    .method("get")
    .create();

  export const uploadPresignedImageFile = async (url: string, file: File) => {
    try {
      await axios.put(url, file, {
        headers: {
          "Content-Type": file.type,
        },
      });
    } catch (error) {
      console.error("Error uploading file", error);
      throw new Error("Failed to upload image");
    }
  };

  export const uploadImage = async (
    file: File,
    folder: "avatar" = "avatar"
  ): Promise<string | null> => {
    try {
      const ext = file.name.split(".").pop();
      const timestampedName = `${dayjs().toISOString()}.${ext}`;

      const getPresignedUrlData = await FileService.getUploadUrl({
        fileName: file.name || timestampedName,
        folder,
        rootFolder: "images",
      });

      const { url, fileName } = getPresignedUrlData.data;
      if (!url) throw new Error("Failed to get presigned URL");

      await FileService.uploadPresignedImageFile(url, file);
      return fileName;
    } catch (error) {
      console.error("❌ Failed to upload image:", error);
      return null;
    }
  };

  export const uploadFile = async (
    file: RNFile,
    folder: "document" | "avatar" = "document"
  ): Promise<string | null> => {
    try {
      const getPresignedUrlData = await FileService.getUploadUrl({
        fileName: file.name ? file.name : dayjs().toISOString(),
        folder,
        rootFolder: "other",
      });

      const { url, fileName } = getPresignedUrlData.data;
      if (!url) throw new Error("Failed to get presigned URL");

      const fileResponse = await fetch(file.uri);
      const blob = await fileResponse.blob();

      const uploadResult = await fetch(url, {
        method: "PUT",
        headers: {
          "Content-Type": file.type,
        },
        body: blob,
      });

      if (!uploadResult.ok) {
        throw new Error(`Upload failed with status ${uploadResult.status}`);
      }

      return fileName;
    } catch (error) {
      console.error("❌ Failed to upload file", error);
      return null;
    }
  };
}

export default FileService;
