/**
 * User data returned from the API
 */
export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Data required to create a new user
 */
export interface NewUserData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}

/**
 * Login credentials
 */
export interface LoginCredentials {
  email: string;
  password: string;
  remember?: boolean;
}

/**
 * Authentication state
 */
export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

/**
 * API response for authentication-related endpoints
 */
export interface AuthResponse {
  success: boolean;
  user?: User;
  message?: string;
  errors?: Record<string, string>;
} 