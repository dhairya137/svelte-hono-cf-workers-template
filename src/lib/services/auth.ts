import type { AuthResponse, LoginCredentials, NewUserData, User } from '$lib/types/auth';
import { authStore } from '$lib/stores/authStore';
import { getCookie, setCookie } from '$lib/utils/cookies';
import * as api from './api';

const AUTH_ENDPOINT = '/auth';

/**
 * Sign up a new user
 * 
 * @param userData User signup data
 * @returns Promise with the created user or error
 */
export async function signup(userData: NewUserData): Promise<{ success: boolean; user?: User; error?: string; errors?: Record<string, string> }> {
  authStore.setLoading(true);
  
  try {
    const data = await api.post<AuthResponse>(`${AUTH_ENDPOINT}/signup`, userData);
    
    if (data.success && data.user) {
      authStore.setUser(data.user);
      return { success: true, user: data.user };
    } else {
      authStore.setError(data.message || 'Error during signup');
      return { 
        success: false, 
        error: data.message || 'Error during signup',
        errors: data.errors
      };
    }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    authStore.setError(errorMessage);
    return { success: false, error: errorMessage };
  } finally {
    authStore.setLoading(false);
  }
}

/**
 * Log in a user
 * 
 * @param credentials Login credentials
 * @returns Promise with the authenticated user or error
 */
export async function login(credentials: LoginCredentials): Promise<{ success: boolean; user?: User; error?: string }> {
  authStore.setLoading(true);
  
  try {
    const data = await api.post<AuthResponse>(`${AUTH_ENDPOINT}/login`, credentials);
    
    if (data.success && data.user) {
      authStore.setUser(data.user);
      return { success: true, user: data.user };
    } else {
      authStore.setError(data.message || 'Invalid credentials');
      return { success: false, error: data.message || 'Invalid credentials' };
    }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    authStore.setError(errorMessage);
    return { success: false, error: errorMessage };
  } finally {
    authStore.setLoading(false);
  }
}

/**
 * Log out the current user
 * 
 * @returns Promise with success indicator
 */
export async function logout(): Promise<{ success: boolean; error?: string }> {
  authStore.setLoading(true);
  
  try {
    const data = await api.post<{ success: boolean; message?: string }>(`${AUTH_ENDPOINT}/logout`, {});
    
    if (data.success) {
      authStore.clearAuth();
      return { success: true };
    } else {
      authStore.setError(data.message || 'Error during logout');
      return { success: false, error: data.message || 'Error during logout' };
    }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    authStore.setError(errorMessage);
    return { success: false, error: errorMessage };
  } finally {
    authStore.setLoading(false);
  }
}

/**
 * Get the current authenticated user
 * 
 * @returns Promise with the current user or error
 */
export async function getCurrentUser(): Promise<{ success: boolean; user?: User; error?: string }> {
  authStore.setLoading(true);
  
  try {
    // Use our API client which already handles CSRF tokens
    const data = await api.get<AuthResponse>(`${AUTH_ENDPOINT}/me`);
    
    if (data.success && data.user) {
      authStore.setUser(data.user);
      return { success: true, user: data.user };
    } else {
      authStore.clearAuth();
      return { success: false, error: data.message || 'Error retrieving user data' };
    }
  } catch (error) {
    // Handle 401 errors differently
    if (error instanceof Error && error.message.includes('401')) {
      authStore.clearAuth();
      return { success: false, error: 'Unauthorized' };
    }
    
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    authStore.clearAuth();
    return { success: false, error: errorMessage };
  } finally {
    authStore.setLoading(false);
  }
}

/**
 * Check if the user is authenticated
 * 
 * @returns Promise with authentication state
 */
export async function checkAuth(): Promise<boolean> {
  // Check if auth cookie exists
  const authCookie = getCookie('auth_token');
  
  if (!authCookie) {
    authStore.clearAuth();
    return false;
  }
  
  // Fetch current user data
  const { success } = await getCurrentUser();
  return success;
} 