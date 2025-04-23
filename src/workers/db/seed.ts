import { D1Database } from '@cloudflare/workers-types';
import { drizzle } from 'drizzle-orm/d1';
import { users } from './schema';
import { v4 as uuidv4 } from 'uuid';
import * as bcrypt from 'bcryptjs';
import { eq } from 'drizzle-orm';

/**
 * Seed the database with test users
 * 
 * @param db D1 database instance
 */
export async function seedDatabase(db: D1Database) {
  const d1db = drizzle(db);
  
  // Hash password for test user
  const passwordHash = await bcrypt.hash('Password123!', 12);
  
  // Get current timestamp
  const now = new Date();
  
  // Check if test user already exists
  const existingUser = await d1db.select().from(users).where(
    eq(users.email, 'test@example.com')
  );
  
  if (existingUser.length === 0) {
    // Create test user
    await d1db.insert(users).values({
      id: uuidv4(),
      email: 'test@example.com',
      passwordHash: passwordHash,
      firstName: 'Test',
      lastName: 'User',
      createdAt: now,
      updatedAt: now,
    });
    
    console.log('Test user created');
  } else {
    console.log('Test user already exists');
  }
} 