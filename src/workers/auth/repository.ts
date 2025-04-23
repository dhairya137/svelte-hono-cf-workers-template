import type { D1Database } from '@cloudflare/workers-types';
import * as bcrypt from 'bcryptjs';
import { eq } from 'drizzle-orm';
import { drizzle } from 'drizzle-orm/d1';
import { users } from '../db/schema';

/**
 * Data required to create a new user
 */
export interface CreateUserData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}

/**
 * User credentials for login
 */
export interface UserCredentials {
  email: string;
  password: string;
}

/**
 * User repository for database operations
 */
export class UserRepository {
  private db;
  
  constructor(d1db: D1Database) {
    this.db = drizzle(d1db);
  }
  
  /**
   * Create a new user
   * 
   * @param userData User data with plain text password
   * @returns The created user without password
   */
  async createUser(userData: CreateUserData): Promise<Omit<typeof users.$inferSelect, 'passwordHash'>> {
    try {
      // Hash the password
      const passwordHash = await bcrypt.hash(userData.password, 12);
      
      // Get current timestamp
      const now = new Date();
      
      // Create user ID
      const id = crypto.randomUUID();
      
      // Insert user into database
      await this.db.insert(users).values({
        id,
        email: userData.email,
        passwordHash,
        firstName: userData.firstName,
        lastName: userData.lastName,
        createdAt: now,
        updatedAt: now
      });
      
      // Return user without password
      return {
        id,
        email: userData.email,
        firstName: userData.firstName,
        lastName: userData.lastName,
        createdAt: now,
        updatedAt: now
      };
    } catch (error) {
      console.error('Error creating user:', error);
      throw new Error('Error creating user');
    }
  }
  
  /**
   * Find a user by ID
   * 
   * @param id User ID
   * @returns User without password or null if not found
   */
  async findById(id: string): Promise<Omit<typeof users.$inferSelect, 'passwordHash'> | null> {
    try {
      // Query database for user
      const result = await this.db.select({
        id: users.id,
        email: users.email,
        firstName: users.firstName,
        lastName: users.lastName,
        createdAt: users.createdAt,
        updatedAt: users.updatedAt
      })
      .from(users)
      .where(eq(users.id, id));
      
      // Return user or null if not found
      return result.length > 0 ? result[0] : null;
    } catch (error) {
      console.error('Error finding user by ID:', error);
      return null;
    }
  }
  
  /**
   * Find a user by email
   * 
   * @param email User email
   * @returns User without password or null if not found
   */
  async findByEmail(email: string): Promise<Omit<typeof users.$inferSelect, 'passwordHash'> | null> {
    try {
      // Query database for user
      const result = await this.db.select({
        id: users.id,
        email: users.email,
        firstName: users.firstName,
        lastName: users.lastName,
        createdAt: users.createdAt,
        updatedAt: users.updatedAt
      })
      .from(users)
      .where(eq(users.email, email));
      
      // Return user or null if not found
      return result.length > 0 ? result[0] : null;
    } catch (error) {
      console.error('Error finding user by email:', error);
      return null;
    }
  }
  
  /**
   * Verify user credentials
   * 
   * @param credentials User credentials
   * @returns User without password or null if invalid credentials
   */
  async verifyCredentials(credentials: UserCredentials): Promise<Omit<typeof users.$inferSelect, 'passwordHash'> | null> {
    try {
      // Query database for user with password
      const result = await this.db.select().from(users).where(eq(users.email, credentials.email));
      
      // If user not found, return null
      if (result.length === 0) {
        return null;
      }
      
      const user = result[0];
      
      // Verify password
      const isPasswordValid = await bcrypt.compare(credentials.password, user.passwordHash);
      
      // If password invalid, return null
      if (!isPasswordValid) {
        return null;
      }
      
      // Return user without password
      const { passwordHash, ...userWithoutPassword } = user;
      return userWithoutPassword;
    } catch (error) {
      console.error('Error verifying credentials:', error);
      return null;
    }
  }
} 