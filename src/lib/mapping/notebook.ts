import { Notebook } from "@/Types";

export const ConvertAnyToNotebook = (data: any): Notebook => {
  return {
    id: data.id,
    title: data.title,
    description: data.description,
    createdDate: data.createdDate,
    lastModified: data.updatedDate,
    documentsCount: data.resourceCount || 0,
    status: data.status,
    documents: [],
    thumbnail: data.thumbnail,
  };
};

export const NewNotebook = (): Notebook => {
  return {
    id: Date.now().toString(),
    title: "New Notebook",
    description: "",
    createdDate: new Date().toISOString().split("T")[0],
    lastModified: new Date().toISOString().split("T")[0],
    documentsCount: 0,
    status: "active",
    documents: [],
    thumbnail: "📚",
  };
};
