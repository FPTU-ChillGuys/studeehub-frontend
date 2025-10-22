/**
 * Example: How to use the centralized file type configuration
 */

import {
  SUPPORTED_EXTENSIONS,
  DOCUMENT_TYPES,
  FILE_INPUT_ACCEPT,
  FILE_TYPE_LABELS,
  INVALID_FILE_TYPE_MESSAGE,
  isValidExtension,
  getDocumentType,
  getMimeType,
  type SupportedExtension,
  type DocumentType,
} from "@/config/fileTypes";

// Example 1: Validate file extension
function validateFile(filename: string): boolean {
  const extension = filename.split(".").pop()?.toLowerCase();
  if (!extension) return false;
  
  return isValidExtension(extension);
}

// Example 2: Get document type from filename
function processUploadedFile(filename: string) {
  const docType = getDocumentType(filename);
  
  if (!docType) {
    console.error(INVALID_FILE_TYPE_MESSAGE);
    return;
  }
  
  console.log(`Processing ${FILE_TYPE_LABELS[docType]}: ${filename}`);
  // ... process file
}

// Example 3: Use in React component (JSX)
// <input
//   type="file"
//   accept={FILE_INPUT_ACCEPT}
//   // This will automatically accept all supported extensions
//   // No need to manually type ".pdf,.docx,..."
// />

// Example 4: Display supported formats message
function getSupportedFormatsMessage(): string {
  return `Supported formats: ${DOCUMENT_TYPES.join(", ")}`;
  // Returns: "Supported formats: PDF, DOCX, TXT, PPTX, XLSX, CSV"
}

// Example 5: Type-safe document handling
function handleDocument(doc: { name: string; type: DocumentType }) {
  // TypeScript will ensure type is one of the valid document types
  switch (doc.type) {
    case "PDF":
      return "Processing PDF";
    case "DOCX":
      return "Processing Word document";
    case "TXT":
      return "Processing Text file";
    case "PPTX":
      return "Processing PowerPoint";
    case "XLSX":
      return "Processing Excel";
    case "CSV":
      return "Processing CSV";
    default:
      // TypeScript will error if we add a new type and forget to handle it
      const exhaustiveCheck: never = doc.type;
      return exhaustiveCheck;
  }
}

// Example 6: Server-side validation
function validateUploadedFiles(files: File[]) {
  const validFiles: File[] = [];
  const invalidFiles: File[] = [];
  
  files.forEach(file => {
    if (validateFile(file.name)) {
      validFiles.push(file);
    } else {
      invalidFiles.push(file);
    }
  });
  
  if (invalidFiles.length > 0) {
    throw new Error(INVALID_FILE_TYPE_MESSAGE);
  }
  
  return validFiles;
}

// Example 7: Get MIME type for file
function getFileMimeType(filename: string): string | null {
  const extension = filename.split(".").pop()?.toLowerCase();
  if (!extension) return null;
  
  return getMimeType(extension);
}

// Example 8: Dynamic file type checking
function isSupportedFileType(extension: string): extension is SupportedExtension {
  return isValidExtension(extension);
}

export {
  validateFile,
  processUploadedFile,
  getSupportedFormatsMessage,
  handleDocument,
  validateUploadedFiles,
  getFileMimeType,
  isSupportedFileType,
};
