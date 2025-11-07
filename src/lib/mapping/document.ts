import { Document } from "@/Types";

export interface DocumentApiResponse {
  id: string;
  fileName: string;
  type: string;
  url: string;
  status?: string;
  size?: string;
  uploadDate?: string;
  questionsGenerated?: number;
  notebookId?: string;
}

export const ConvertApiToDocument = (data: DocumentApiResponse): Document => {
  return {
    id: data.id,
    name: data.fileName,
    type: data.type as Document["type"],
    url: data.url,
    status: (data.status as Document["status"]) || "completed",
    size: data.size || "0 MB",
    uploadDate: data.uploadDate || new Date().toISOString().split("T")[0],
    questionsGenerated: data.questionsGenerated || 0,
    notebookId: data.notebookId || "",
  };
};

export const ConvertApiToDocuments = (dataArray: DocumentApiResponse[]): Document[] => {
  return dataArray.map(ConvertApiToDocument);
};
