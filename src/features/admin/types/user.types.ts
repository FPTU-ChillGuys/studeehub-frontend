export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  avatarUrl?: string;
  status: 'active' | 'inactive' | 'suspended';
  role: 'admin' | 'user' | 'moderator';
  lastLoginAt?: string;
  createdAt: string;
  updatedAt: string;
  emailVerified: boolean;
  subscriptionStatus?: string;
  subscriptionExpiryDate?: string;
}

export interface UserListFilters {
  status?: 'active' | 'inactive' | 'suspended';
  role?: string;
  searchTerm?: string;
  dateFrom?: string;
  dateTo?: string;
}

export interface PaginationParams {
  pageNumber?: number;
  pageSize?: number;
  sortBy?: string;
  sortDescending?: boolean;
  [key: string]: string | number | boolean | undefined;
}

export interface UserUpdateData {
  firstName?: string;
  lastName?: string;
  email?: string;
  status?: 'active' | 'inactive' | 'suspended';
  role?: 'admin' | 'user' | 'moderator';
}
