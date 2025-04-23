import { Hono } from 'hono';
import { AuthController } from './controller';
import { authMiddleware, csrfProtection, securityHeadersMiddleware } from './middleware';
import type { D1Database } from '@cloudflare/workers-types';

// Define the environment interface for auth routes
interface Env {
  DB: D1Database;
  JWT_PUBLIC_KEY: string;
  JWT_PRIVATE_KEY: string;
}

// Create a Hono app for auth routes with proper typing
const auth = new Hono<{ Bindings: Env }>();

// Apply security headers middleware to all routes
auth.use('*', securityHeadersMiddleware);

// Apply CSRF protection to all routes
auth.use('*', csrfProtection);

// Public routes
auth.post('/signup', AuthController.signup);
auth.post('/login', AuthController.login);
auth.post('/logout', AuthController.logout);

// Protected routes that require authentication
auth.use('/me', authMiddleware);
auth.get('/me', AuthController.getCurrentUser);

// Export the auth routes
export const authRoutes = auth; 