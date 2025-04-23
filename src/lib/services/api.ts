/**
 * API client for making API requests
 */
import { getCookie } from '$lib/utils/cookies';

// Default API URL
const API_BASE_URL = '/api';

// Default request options
const defaultOptions: RequestInit = {
  headers: {
    'Content-Type': 'application/json'
  },
  credentials: 'include'
};

// API error response interface
interface ApiErrorResponse {
  message?: string;
  [key: string]: any;
}

/**
 * Make a GET request to the API
 * 
 * @param endpoint API endpoint
 * @param options Request options
 * @returns Promise with the response data
 */
export async function get<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const csrfToken = getCookie('csrf_token');
  
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...defaultOptions,
    ...options,
    method: 'GET',
    headers: {
      ...defaultOptions.headers,
      ...(csrfToken ? { 'X-CSRF-Token': csrfToken } : {}),
      ...options.headers
    }
  });
  
  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'An error occurred' })) as ApiErrorResponse;
    throw new Error(error.message || `${response.status}: ${response.statusText}`);
  }
  
  return response.json() as Promise<T>;
}

/**
 * Make a POST request to the API
 * 
 * @param endpoint API endpoint
 * @param data Request body data
 * @param options Request options
 * @returns Promise with the response data
 */
export async function post<T>(endpoint: string, data: any, options: RequestInit = {}): Promise<T> {
  const csrfToken = getCookie('csrf_token');
  
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...defaultOptions,
    ...options,
    method: 'POST',
    body: JSON.stringify(data),
    headers: {
      ...defaultOptions.headers,
      ...(csrfToken ? { 'X-CSRF-Token': csrfToken } : {}),
      ...options.headers
    }
  });
  
  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'An error occurred' })) as ApiErrorResponse;
    throw new Error(error.message || `${response.status}: ${response.statusText}`);
  }
  
  return response.json() as Promise<T>;
}

/**
 * Make a PUT request to the API
 * 
 * @param endpoint API endpoint
 * @param data Request body data
 * @param options Request options
 * @returns Promise with the response data
 */
export async function put<T>(endpoint: string, data: any, options: RequestInit = {}): Promise<T> {
  const csrfToken = getCookie('csrf_token');
  
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...defaultOptions,
    ...options,
    method: 'PUT',
    body: JSON.stringify(data),
    headers: {
      ...defaultOptions.headers,
      ...(csrfToken ? { 'X-CSRF-Token': csrfToken } : {}),
      ...options.headers
    }
  });
  
  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'An error occurred' })) as ApiErrorResponse;
    throw new Error(error.message || `${response.status}: ${response.statusText}`);
  }
  
  return response.json() as Promise<T>;
}

/**
 * Make a DELETE request to the API
 * 
 * @param endpoint API endpoint
 * @param options Request options
 * @returns Promise with the response data
 */
export async function del<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const csrfToken = getCookie('csrf_token');
  
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...defaultOptions,
    ...options,
    method: 'DELETE',
    headers: {
      ...defaultOptions.headers,
      ...(csrfToken ? { 'X-CSRF-Token': csrfToken } : {}),
      ...options.headers
    }
  });
  
  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'An error occurred' })) as ApiErrorResponse;
    throw new Error(error.message || `${response.status}: ${response.statusText}`);
  }
  
  return response.json() as Promise<T>;
} 