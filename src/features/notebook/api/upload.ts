export const uploadNotebookFile = async (
  files: File[],
  notebookId: string
): Promise<{ status: number, data: any }> => {
  const formData = new FormData();
  files.forEach((file) => {
    formData.append("files", file);
  });
  formData.append("notebookId", notebookId);

  const response = await fetch("/api/file/upload", {
    method: "POST",
    body: formData,
  });
  const status = response.status;
  const data = await response.json();

  return { status, data };
};
