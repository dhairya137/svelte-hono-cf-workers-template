import { writable } from 'svelte/store';
import type { AuthState, User } from '$lib/types/auth';

// Initial auth state
const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  isLoading: false,
  error: null
};

// Create the auth store
const createAuthStore = () => {
  const { subscribe, set, update } = writable<AuthState>(initialState);

  return {
    subscribe,
    
    // Set user data and authentication status
    setUser: (user: User | null) => {
      update(state => ({
        ...state,
        user,
        isAuthenticated: !!user,
        error: null
      }));
    },
    
    // Set loading state
    setLoading: (isLoading: boolean) => {
      update(state => ({
        ...state,
        isLoading
      }));
    },
    
    // Set error message
    setError: (error: string | null) => {
      update(state => ({
        ...state,
        error
      }));
    },
    
    // Clear authentication state (logout)
    clearAuth: () => {
      set(initialState);
    }
  };
};

// Export the auth store
export const authStore = createAuthStore(); 