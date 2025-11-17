// Subscription related types

export interface SubscriptionPlanDetail {
  id: string;
  name: string;
  description: string;
  price: number;
  durationInDays: number;
}

export interface SubscriptionUser {
  id: string;
  fullName: string;
  email: string;
}

export interface Subscription {
  id: string;
  userId: string;
  subscriptionPlanId: string;
  startDate: string;
  endDate: string;
  status: number;
  subscriptionPlan: SubscriptionPlanDetail;
  user: SubscriptionUser;
}

export interface SubscriptionsResponse {
  totalCount: number;
  page: number;
  pageSize: number;
  totalPages: number;
  data: Subscription[];
  success: boolean;
  message: string;
  errors: string[] | null;
  errorType: number;
}

export interface SubscriptionFilters {
  userId: string;
  subscriptionPlanId: string;
  status: string;
  startDateFrom: string;
  startDateTo: string;
  endDateFrom: string;
  endDateTo: string;
  searchTerm: string;
  pageNumber: number;
  pageSize: number;
  sortBy: string;
  sortDescending: boolean;
}
