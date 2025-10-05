// User types
export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
}

// Document types
export interface Document {
  id: string;
  name: string;
  type: "PDF" | "DOCX" | "TXT" | "PPTX" | "IMAGE" | "VIDEO";
  size: string;
  uploadDate: string;
  status: "processing" | "completed" | "error";
  questionsGenerated?: number;
  url?: string;
  notebookId: string;
}

// Notebook types
export interface Notebook {
  id: string;
  title: string;
  description?: string;
  createdDate: string;
  lastModified: string;
  documentsCount: number;
  totalQuestions: number;
  status: "active" | "archived";
  documents: Document[];
  thumbnail?: string;
}

// Chat message types
export interface ChatMessage {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
  notebookId: string;
  sources?: string[]; // Document IDs that were referenced
}

// API response types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
  hasNext: boolean;
  hasPrev: boolean;
}
