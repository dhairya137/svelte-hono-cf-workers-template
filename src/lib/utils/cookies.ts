/**
 * Get a cookie value by name
 * 
 * @param name Cookie name
 * @returns Cookie value or empty string if not found
 */
export function getCookie(name: string): string {
  const cookies = document.cookie.split(';');
  for (let i = 0; i < cookies.length; i++) {
    const cookie = cookies[i].trim();
    if (cookie.startsWith(name + '=')) {
      return cookie.substring(name.length + 1);
    }
  }
  return '';
}

/**
 * Set a cookie
 * 
 * @param name Cookie name
 * @param value Cookie value
 * @param options Cookie options (maxAge, path, secure, etc.)
 */
export function setCookie(name: string, value: string, options: { maxAge?: number; path?: string; secure?: boolean; sameSite?: 'Strict' | 'Lax' | 'None' } = {}): void {
  let cookieString = `${name}=${value}`;
  
  if (options.maxAge) {
    cookieString += `; Max-Age=${options.maxAge}`;
  }
  
  if (options.path) {
    cookieString += `; Path=${options.path}`;
  } else {
    cookieString += '; Path=/';
  }
  
  if (options.secure) {
    cookieString += '; Secure';
  }
  
  if (options.sameSite) {
    cookieString += `; SameSite=${options.sameSite}`;
  }
  
  document.cookie = cookieString;
}

/**
 * Delete a cookie
 * 
 * @param name Cookie name
 * @param path Cookie path
 */
export function deleteCookie(name: string, path = '/'): void {
  setCookie(name, '', { maxAge: 0, path });
} 