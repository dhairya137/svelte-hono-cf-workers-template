/**
 * Navigation utility to handle page navigation
 */
import { router } from 'tinro';

/**
 * Navigate to a different page using client-side routing
 * @param url URL to navigate to
 */
export function goto(url: string): void {
  // Make sure URL starts with a slash
  if (!url.startsWith('/')) {
    url = '/' + url;
  }
  router.goto(url);
}

/**
 * Reload the current page
 */
export function reload(): void {
  window.location.reload();
}

/**
 * Navigate back in history
 */
export function back(): void {
  window.history.back();
}

/**
 * Navigate forward in history
 */
export function forward(): void {
  window.history.forward();
}

/**
 * Check if a route is active
 * @param path Path to check
 * @returns Boolean indicating if the path is active
 */
export function isActive(path: string): boolean {
  // Make sure path starts with a slash
  if (!path.startsWith('/')) {
    path = '/' + path;
  }
  
  // Get the current path from the location
  const currentPath = window.location.pathname;
  
  // Check if the current path matches the given path
  return currentPath === path;
} 