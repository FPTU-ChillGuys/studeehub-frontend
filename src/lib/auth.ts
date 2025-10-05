// Authentication utilities
export interface User {
  id: string;
  email: string;
  name: string;
  role: "user" | "admin";
  avatar?: string;
}

// Simulate user database
const MOCK_USERS = {
  "admin@studeehub.com": {
    id: "1",
    email: "admin@studeehub.com",
    name: "Admin User",
    role: "admin" as const,
    password: "12345aA@",
  },
  "user@studeehub.com": {
    id: "2",
    email: "user@studeehub.com",
    name: "Regular User",
    role: "user" as const,
    password: "12345aA@",
  },
};

export const authenticateUser = async (
  email: string,
  password: string
): Promise<User | null> => {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 1000));

  const mockUser = MOCK_USERS[email as keyof typeof MOCK_USERS];

  if (mockUser && mockUser.password === password) {
    const { password: _, ...user } = mockUser;
    return user;
  }

  return null;
};

export const getCurrentUser = (): User | null => {
  try {
    const userStr = localStorage.getItem("user");
    if (userStr) {
      return JSON.parse(userStr);
    }
  } catch (error) {
    console.error("Error getting current user:", error);
  }
  return null;
};

export const setCurrentUser = (user: User): void => {
  localStorage.setItem("user", JSON.stringify(user));
};

export const logout = (): void => {
  localStorage.removeItem("user");
  window.location.href = "/";
};

export const redirectBasedOnRole = (user: User): void => {
  if (user.role === "admin") {
    window.location.href = "/admin";
  } else {
    window.location.href = "/dashboard";
  }
};

// Check if user has admin access
export const isAdmin = (user: User | null): boolean => {
  return user?.role === "admin";
};

// Check if user is authenticated
export const isAuthenticated = (): boolean => {
  return getCurrentUser() !== null;
};
