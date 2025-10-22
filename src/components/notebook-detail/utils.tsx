import { FileText } from "lucide-react";

export const getFileIcon = (type: string) => {
  switch (type.toLowerCase()) {
    case "pdf":
      return <FileText className="w-5 h-5 text-red-500" />;
    case "docx":
    case "doc":
      return <FileText className="w-5 h-5 text-blue-500" />;
    case "xlsx":
    case "csv":
      return <FileText className="w-5 h-5 text-green-500" />;
    case "txt":
      return <FileText className="w-5 h-5 text-gray-500" />;
    default:
      return <FileText className="w-5 h-5 text-gray-500" />;
  }
};
