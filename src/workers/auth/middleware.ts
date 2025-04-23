import { Context, Next } from 'hono';
import { getCookie } from 'hono/cookie';
import { verifyJwt } from './utils';

// Environment interface for the middleware
interface Env {
  JWT_PUBLIC_KEY: string;
  JWT_PRIVATE_KEY: string;
}

/**
 * Authentication middleware
 * 
 * Verifies the JWT token from the cookie and attaches user data to the context
 */
export const authMiddleware = async (c: Context<{ Bindings: Env }>, next: Next) => {
  // Get the token from the cookie
  const token = getCookie(c, 'auth_token');
  
  // If no token, return unauthorized
  if (!token) {
    return c.json({ 
      success: false, 
      message: 'Authentication required' 
    }, 401);
  }
  
  try {
    // Verify the token
    const { valid, payload, error } = await verifyJwt(token, c.env.JWT_PUBLIC_KEY);
    
    // If invalid, return unauthorized
    if (!valid) {
      return c.json({ 
        success: false, 
        message: 'Invalid or expired token' 
      }, 401);
    }
    
    // Attach user data to the context
    c.set('user', {
      id: payload.sub as string,
      email: payload.email as string
    });
    
    // Continue to the next middleware/handler
    await next();
  } catch (error) {
    console.error('Error verifying token:', error);
    return c.json({ 
      success: false, 
      message: 'Authentication error' 
    }, 401);
  }
};

/**
 * CSRF protection middleware
 * 
 * Verifies that the CSRF token in the header matches the one in the cookie
 * Only applies to state-changing methods (POST, PUT, DELETE)
 */
export const csrfProtection = async (c: Context, next: Next) => {
  // Only check for state-changing methods
  const method = c.req.method;
  if (['POST', 'PUT', 'DELETE', 'PATCH'].includes(method)) {
    // Get the token from the cookie and header
    const csrfCookie = getCookie(c, 'csrf_token');
    const csrfHeader = c.req.header('X-CSRF-Token');
    
    // If missing or mismatch, return forbidden
    if (!csrfCookie || !csrfHeader || csrfCookie !== csrfHeader) {
      return c.json({ 
        success: false, 
        message: 'CSRF verification failed' 
      }, 403);
    }
  }
  
  // Continue to the next middleware/handler
  await next();
};

/**
 * Security headers middleware
 * 
 * Adds security headers to the response
 */
export const securityHeadersMiddleware = async (c: Context, next: Next) => {
  // Continue to the next middleware/handler
  await next();
  
  // Add security headers to the response
  c.header('Content-Security-Policy', "default-src 'self'");
  c.header('X-Content-Type-Options', 'nosniff');
  c.header('X-Frame-Options', 'DENY');
  c.header('X-XSS-Protection', '1; mode=block');
  c.header('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
  c.header('Referrer-Policy', 'strict-origin-when-cross-origin');
}; 