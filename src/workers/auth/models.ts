/**
 * Authentication models
 */

/**
 * User model
 */
export interface User {
  /**
   * Unique user ID
   */
  id: string;
  
  /**
   * Username used for login
   */
  username: string;
  
  /**
   * Hashed password
   */
  password: string;
  
  /**
   * Creation timestamp
   */
  createdAt: string;
} 