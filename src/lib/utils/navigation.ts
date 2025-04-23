/**
 * Navigation utility to handle page navigation
 */
/**
 * Navigate to a different page using manual client-side routing
 * @param url URL to navigate to
 */
export function goto(url: string): void {
  // Make sure URL starts with a slash
  if (!url.startsWith('/')) {
    url = '/' + url;
  }
  window.history.pushState({}, '', url);
  // Trigger route update: dispatch popstate and navigation events
  window.dispatchEvent(new PopStateEvent('popstate', { state: {} }));
  window.dispatchEvent(new Event('navigation'));
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