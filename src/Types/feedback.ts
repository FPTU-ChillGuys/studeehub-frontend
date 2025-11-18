export enum FeedbackStatus {
  Pending = 1,
  InProgress = 2,
  Resolved = 3,
  Closed = 4,
  Acknowledged = 5,
}

export const feedbackStatusLabels: { [key in FeedbackStatus]: string } = {
  [FeedbackStatus.Pending]: "Pending",
  [FeedbackStatus.InProgress]: "In Progress",
  [FeedbackStatus.Resolved]: "Resolved",
  [FeedbackStatus.Closed]: "Closed",
  [FeedbackStatus.Acknowledged]: "Acknowledged",
};

export const feedbackStatusColors: { [key in FeedbackStatus]: string } = {
  [FeedbackStatus.Pending]: "bg-yellow-100 text-yellow-800",
  [FeedbackStatus.InProgress]: "bg-blue-100 text-blue-800",
  [FeedbackStatus.Resolved]: "bg-green-100 text-green-800",
  [FeedbackStatus.Closed]: "bg-gray-100 text-gray-800",
  [FeedbackStatus.Acknowledged]: "bg-purple-100 text-purple-800",
};

export enum CategoryType {
  SuggestionGeneral = 1,  // Góp ý chung
  BugReport = 2,          // Báo lỗi
  FeatureRequest = 3,     // Đề xuất tính năng mới
  UserExperience = 4,     // Cảm nhận trải nghiệm tổng thể
  UIEnhancement = 5,      // Góp ý giao diện
  Performance = 6,        // Hiệu năng (lag, chậm)
  AccountIssue = 7,       // Lỗi tài khoản / đăng nhập
  SubscriptionIssue = 8,  // Thanh toán / gói dịch vụ
  ContentIssue = 9,       // Lỗi nội dung: flashcard, note, AI output
  IntegrationIssue = 10,  // Lỗi kết nối: Google, Firebase, API
  DataAccuracy = 11,      // Phản hồi về tính đúng/sai của AI/RAG
}

export const categoryLabels: { [key in CategoryType]: string } = {
  [CategoryType.SuggestionGeneral]: "Góp ý chung",
  [CategoryType.BugReport]: "Báo lỗi",
  [CategoryType.FeatureRequest]: "Đề xuất tính năng mới",
  [CategoryType.UserExperience]: "Cảm nhận trải nghiệm tổng thể",
  [CategoryType.UIEnhancement]: "Góp ý giao diện",
  [CategoryType.Performance]: "Hiệu năng (lag, chậm)",
  [CategoryType.AccountIssue]: "Lỗi tài khoản / đăng nhập",
  [CategoryType.SubscriptionIssue]: "Thanh toán / gói dịch vụ",
  [CategoryType.ContentIssue]: "Lỗi nội dung: flashcard, note, AI output",
  [CategoryType.IntegrationIssue]: "Lỗi kết nối: Google, Firebase, API",
  [CategoryType.DataAccuracy]: "Phản hồi về tính đúng/sai của AI/RAG",
};

export interface Feedback {
  id: string;
  category: CategoryType;
  rating: number; // 1-5
  title: string;
  message: string;
  status: FeedbackStatus;
  createdAt: string;
  updatedAt: string;
  response?: string | null;
  respondedAt?: string | null;
  deletedAt?: string | null;
  user?: {
    id: string;
    fullName: string;
    userName: string;
    userEmail: string;
  };
  attachments?: {
    id: string;
    fileName: string;
    fileUrl: string;
  }[];
}

export interface FeedbackData {
  category: CategoryType;
  rating: number; // 1-5
  title: string;
  message: string;
  files?: File[];
}

export interface FeedbackResponse {
  success: boolean;
  message: string;
  data?: unknown;
}

