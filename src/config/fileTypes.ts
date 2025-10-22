/**
 * Central configuration for supported file types
 * Add new file types here and they will be automatically available throughout the app
 */

// Supported file extensions
export const SUPPORTED_EXTENSIONS = [
  "pdf",
  "doc",
  "docx",
  "txt",
  "pptx",
  "xlsx",
  "csv",
] as const;

// Type for supported extensions
export type SupportedExtension = (typeof SUPPORTED_EXTENSIONS)[number];

// Supported file types for Document
export const DOCUMENT_TYPES = ["PDF", "DOCX", "TXT", "PPTX", "XLSX", "CSV"] as const;

// Type for document types
export type DocumentType = (typeof DOCUMENT_TYPES)[number];

// MIME types mapping
export const MIME_TYPES: Record<SupportedExtension, string> = {
  pdf: "application/pdf",
  doc: "application/msword",
  docx: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  txt: "text/plain",
  pptx: "application/vnd.openxmlformats-officedocument.presentationml.presentation",
  xlsx: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  csv: "text/csv",
};

// File extension to document type mapping
export const EXTENSION_TO_TYPE: Record<SupportedExtension, DocumentType> = {
  pdf: "PDF",
  doc: "DOCX",
  docx: "DOCX",
  txt: "TXT",
  pptx: "PPTX",
  xlsx: "XLSX",
  csv: "CSV",
};

// User-friendly file type names
export const FILE_TYPE_LABELS: Record<DocumentType, string> = {
  PDF: "PDF Document",
  DOCX: "Word Document",
  TXT: "Text File",
  PPTX: "PowerPoint Presentation",
  XLSX: "Excel Spreadsheet",
  CSV: "CSV File",
};

// File validation message
export const INVALID_FILE_TYPE_MESSAGE = `Only ${SUPPORTED_EXTENSIONS.map(ext => ext.toUpperCase()).join(", ")} files are supported`;

// Accept attribute for file input
export const FILE_INPUT_ACCEPT = SUPPORTED_EXTENSIONS.map(ext => `.${ext}`).join(",");

// Helper functions
export const isValidExtension = (extension: string): extension is SupportedExtension => {
  return SUPPORTED_EXTENSIONS.includes(extension.toLowerCase() as SupportedExtension);
};

export const getDocumentType = (filename: string): DocumentType | null => {
  const extension = filename.split(".").pop()?.toLowerCase();
  if (!extension || !isValidExtension(extension)) {
    return null;
  }
  return EXTENSION_TO_TYPE[extension];
};

export const getMimeType = (extension: string): string | null => {
  if (!isValidExtension(extension.toLowerCase())) {
    return null;
  }
  return MIME_TYPES[extension.toLowerCase() as SupportedExtension];
};
