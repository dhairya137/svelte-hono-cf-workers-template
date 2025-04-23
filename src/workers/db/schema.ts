import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';

/**
 * User table schema
 * 
 * This table stores user information for authentication purposes.
 * It includes fields for user identification, authentication, and basic profile information.
 */
export const users = sqliteTable('users', {
  // Primary key: UUID format
  id: text('id').primaryKey(),
  
  // Authentication fields
  email: text('email').notNull().unique(),
  passwordHash: text('password_hash').notNull(),
  
  // Profile information
  firstName: text('first_name').notNull(),
  lastName: text('last_name').notNull(),
  
  // Timestamps
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull(),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).notNull(),
});

// TypeScript types derived from schema
export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert; 