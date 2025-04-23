import type { Context } from 'hono';
import { setCookie } from 'hono/cookie';
import { UserRepository } from './repository';
import type { CreateUserData, UserCredentials } from './repository';
import { createJwt, generateCsrfToken, isStrongPassword, isValidEmail } from './utils';
import type { D1Database } from '@cloudflare/workers-types';

/**
 * Environment type for the controller
 */
interface Env {
  DB: D1Database;
  JWT_PRIVATE_KEY: string;
}

/**
 * Controller for authentication-related endpoints
 */
export class AuthController {
  /**
   * Handle user signup
   * 
   * @param c Hono context
   * @returns Response with user data or error
   */
  static async signup(c: Context<{ Bindings: Env }>) {
    try {
      // Get user data from request body
      const { email, password, firstName, lastName } = await c.req.json<CreateUserData>();
      
      // Validate input
      const errors: Record<string, string> = {};
      
      if (!email || !isValidEmail(email)) {
        errors.email = 'Please enter a valid email address';
      }
      
      if (!password || !isStrongPassword(password)) {
        errors.password = 'Password must be at least 8 characters and include uppercase, lowercase, number, and special character';
      }
      
      if (!firstName) {
        errors.firstName = 'First name is required';
      }
      
      if (!lastName) {
        errors.lastName = 'Last name is required';
      }
      
      // If there are validation errors, return them
      if (Object.keys(errors).length > 0) {
        return c.json({
          success: false,
          errors
        }, 400);
      }
      
      // Create user repository
      const userRepo = new UserRepository(c.env.DB);
      
      // Check if user with this email already exists
      const existingUser = await userRepo.findByEmail(email);
      
      if (existingUser) {
        return c.json({
          success: false,
          errors: {
            email: 'A user with this email already exists'
          }
        }, 400);
      }
      
      // Create the user
      const user = await userRepo.createUser({
        email,
        password,
        firstName,
        lastName
      });
      
      if (!user) {
        return c.json({
          success: false,
          message: 'Error creating user'
        }, 500);
      }
      
      // Generate JWT token
      const token = await createJwt({
        id: user.id,
        email: user.email
      }, c.env.JWT_PRIVATE_KEY);
      
      // Generate CSRF token
      const csrfToken = generateCsrfToken();
      
      // Set auth cookie (HTTP-only, secure)
      setCookie(c, 'auth_token', token, {
        httpOnly: true,
        secure: true,
        sameSite: 'Strict',
        path: '/',
        maxAge: 60 * 60 * 24 // 24 hours
      });
      
      // Set CSRF cookie (not HTTP-only)
      const host = c.req.header('host') || '';
      const isLocal = host.startsWith('localhost') || host.startsWith('127.0.0.1');
      setCookie(c, 'csrf_token', csrfToken, {
        httpOnly: false,
        secure: !isLocal, // Only secure in production
        sameSite: 'Strict',
        path: '/',
        maxAge: 60 * 60 * 24 // 24 hours
      });
      
      // Return success with user data
      return c.json({
        success: true,
        user: {
          id: user.id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          createdAt: user.createdAt,
          updatedAt: user.updatedAt
        },
        csrfToken
      }, 201);
    } catch (error) {
      console.error('Error signing up:', error);
      return c.json({
        success: false,
        message: 'An error occurred during signup'
      }, 500);
    }
  }

  /**
   * Handle user login
   * 
   * @param c Hono context
   * @returns Response with user data or error
   */
  static async login(c: Context<{ Bindings: Env }>) {
    try {
      // Get credentials from request body
      const { email, password, remember } = await c.req.json<UserCredentials & { remember?: boolean }>();
      
      // Validate input
      if (!email || !password) {
        return c.json({
          success: false,
          message: 'Email and password are required'
        }, 400);
      }
      
      // Create user repository
      const userRepo = new UserRepository(c.env.DB);
      
      // Verify credentials
      const user = await userRepo.verifyCredentials({ email, password });
      
      if (!user) {
        return c.json({
          success: false,
          message: 'Invalid email or password'
        }, 401);
      }
      
      // Generate JWT token
      const token = await createJwt({
        id: user.id,
        email: user.email
      }, c.env.JWT_PRIVATE_KEY);
      
      // Generate CSRF token
      const csrfToken = generateCsrfToken();
      
      // Calculate cookie expiration
      const maxAge = remember ? 60 * 60 * 24 * 7 : 60 * 60 * 24; // 7 days if remember, else 24 hours
      
      // Set auth cookie (HTTP-only, secure)
      setCookie(c, 'auth_token', token, {
        httpOnly: true,
        secure: true,
        sameSite: 'Strict',
        path: '/',
        maxAge
      });
      
      // Set CSRF cookie (not HTTP-only)
      const host = c.req.header('host') || '';
      const isLocal = host.startsWith('localhost') || host.startsWith('127.0.0.1');
      setCookie(c, 'csrf_token', csrfToken, {
        httpOnly: false,
        secure: !isLocal, // Only secure in production
        sameSite: 'Strict',
        path: '/',
        maxAge
      });
      
      // Return success with user data
      return c.json({
        success: true,
        user: {
          id: user.id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          createdAt: user.createdAt,
          updatedAt: user.updatedAt
        },
        csrfToken
      });
    } catch (error) {
      console.error('Error logging in:', error);
      return c.json({
        success: false,
        message: 'An error occurred during login'
      }, 500);
    }
  }

  /**
   * Handle user logout
   * 
   * @param c Hono context
   * @returns Response with success message
   */
  static async logout(c: Context) {
    try {
      // Clear auth cookie
      setCookie(c, 'auth_token', '', {
        httpOnly: true,
        secure: true,
        sameSite: 'Strict',
        path: '/',
        maxAge: 0 // Expire immediately
      });
      
      // Clear CSRF cookie
      setCookie(c, 'csrf_token', '', {
        httpOnly: false,
        secure: true,
        sameSite: 'Strict',
        path: '/',
        maxAge: 0 // Expire immediately
      });
      
      // Return success
      return c.json({
        success: true,
        message: 'Logged out successfully'
      });
    } catch (error) {
      console.error('Error logging out:', error);
      return c.json({
        success: false,
        message: 'An error occurred during logout'
      }, 500);
    }
  }

  /**
   * Get current user data
   * 
   * @param c Hono context
   * @returns Response with user data
   */
  static async getCurrentUser(c: Context<{ Bindings: Env; Variables: { user: { id: string; email: string } } }>) {
    try {
      // Get user ID from context (set by auth middleware)
      const { id } = c.get('user');
      
      // Create user repository
      const userRepo = new UserRepository(c.env.DB);
      
      // Get user data
      const user = await userRepo.findById(id);
      
      if (!user) {
        return c.json({
          success: false,
          message: 'User not found'
        }, 404);
      }
      
      // Return user data
      return c.json({
        success: true,
        user: {
          id: user.id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          createdAt: user.createdAt,
          updatedAt: user.updatedAt
        }
      });
    } catch (error) {
      console.error('Error getting current user:', error);
      return c.json({
        success: false,
        message: 'An error occurred'
      }, 500);
    }
  }
} 