import { APIResponse } from "@/lib/api/client";
import { IFlashcard } from "react-quizlet-flashcard";
import type { DocumentType } from "@/config/fileTypes";

// User types
export interface User {
  id: string;
  name: string;
  email: string;
  image?: string;
  role: "user" | "admin";
  avatar?: string;
  // Additional profile fields from backend
  address?: string;
  userName?: string;
  phoneNumber?: string | null;
  createdAt?: string;
  updatedAt?: string;
}

// Detailed user profile from backend
export interface UserProfile {
  id: string;
  fullName: string;
  address: string;
  email: string;
  userName: string;
  phoneNumber: string | null;
  createdAt: string;
  updatedAt: string;
  isActive: boolean;
}

export interface UserProfileResponse {
  data: UserProfile;
  success: boolean;
  message: string;
  errors: string[] | null;
  errorType: number;
}

// Streak types
export interface Streak {
  id: string;
  type: number;
  currentCount: number;
  longestCount: number;
  lastUpdated: string;
  createdAt: string;
}

export interface StreakResponse {
  data: Streak[];
  success: boolean;
  message: string;
  errors: string[] | null;
  errorType: number;
}

export interface UpdateStreakRequest {
  type: number;
  isActive: boolean;
}

// Document types
export interface Document {
  id: string;
  name: string;
  type: DocumentType;
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

// API Error types
export interface ApiErrorResponse {
  data?: unknown;
  success?: boolean | false;
  message: string;
  errors?: Record<string, string[]> | string[];
  errorType: number;
}

export class ApiError extends Error {
  status: number;
  statusText: string;
  data?: ApiErrorResponse;

  constructor(response: Response, data: ApiErrorResponse) {
    super(data.message || `HTTP error! status: ${response.status}`);
    this.name = "ApiError";
    this.status = response.status;
    this.statusText = response.statusText;
    this.data = data;

    // Maintain proper stack trace in V8 environment
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, ApiError);
    }
  }
}

// API response types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string | ApiErrorResponse;
  message?: string;
}

export interface PaginatedResponse<T> extends APIResponse<T> {
  totalCount: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export interface FlashcardDeck {
  id: string;
  title: string;
  cardCount: number;
  cards: IFlashcard[];
}

export interface BaseResponse {
  success: boolean;
  message: string;
  errors: string[] | null;
  data?: any;
}