/**
 * Authentication service
 */
import { User } from './models';
import { hashPassword } from './utils';

// In-memory user store (in a real app, this would be a database)
const users: User[] = [];

/**
 * Register a new user
 * @param username Username
 * @param password Plain text password
 * @returns The created user (without password)
 */
export async function registerUser(username: string, password: string): Promise<Omit<User, 'password'>> {
  // Check if username already exists
  if (users.some(user => user.username === username)) {
    throw new Error('Username already exists');
  }

  // Hash the password
  const hashedPassword = await hashPassword(password);

  // Create a new user
  const newUser: User = {
    id: crypto.randomUUID(),
    username,
    password: hashedPassword,
    createdAt: new Date().toISOString()
  };

  // Add to store
  users.push(newUser);

  // Return user without password
  const { password: _, ...userWithoutPassword } = newUser;
  return userWithoutPassword;
}

/**
 * Login a user
 * @param username Username
 * @param password Plain text password
 * @returns The user (without password) if login successful
 */
export async function loginUser(username: string, password: string): Promise<Omit<User, 'password'>> {
  // Find user by username
  const user = users.find(user => user.username === username);
  if (!user) {
    throw new Error('Invalid credentials');
  }

  // Compare passwords
  const hashedPassword = await hashPassword(password);
  if (user.password !== hashedPassword) {
    throw new Error('Invalid credentials');
  }

  // Return user without password
  const { password: _, ...userWithoutPassword } = user;
  return userWithoutPassword;
}

/**
 * Get a user by ID
 * @param id User ID
 * @returns The user (without password) if found
 */
export function getUserById(id: string): Omit<User, 'password'> | null {
  const user = users.find(user => user.id === id);
  if (!user) {
    return null;
  }

  // Return user without password
  const { password: _, ...userWithoutPassword } = user;
  return userWithoutPassword;
}