import { commonPost } from "@/features/common/api/common";

export const uploadNotebookFile = async (
  files: File[],
  notebookId: string
) => {
  const formData = new FormData();
  files.forEach((file) => {
    formData.append("files", file);
  });
  formData.append("notebookId", notebookId);

  // Don't set Content-Type header - browser will set it automatically with boundary
  return commonPost("/api/file/upload", formData, {});
};
