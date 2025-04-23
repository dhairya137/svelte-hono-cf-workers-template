import { D1Database } from '@cloudflare/workers-types';

/**
 * Initialize the database with the required schema
 * 
 * @param db D1 database instance
 */
export async function initializeDatabase(db: D1Database) {
  // Create users table
  await db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      email TEXT NOT NULL UNIQUE,
      password_hash TEXT NOT NULL,
      first_name TEXT NOT NULL,
      last_name TEXT NOT NULL,
      created_at INTEGER NOT NULL,
      updated_at INTEGER NOT NULL
    )
  `);
  
  // Create index in a separate statement
  await db.exec(`
    CREATE INDEX IF NOT EXISTS idx_users_email ON users (email)
  `);
  
  console.log('Database initialized with users table');
}

/**
 * Function to migrate the database
 * 
 * @param db D1 database instance
 */
export async function migrateDatabase(db: D1Database) {
  try {
    console.log('Starting database migration...');
    await initializeDatabase(db);
    
    // Add any future migrations here
    
    console.log('All migrations completed successfully');
  } catch (error) {
    console.error('Error during database migration:', error);
    throw error;
  }
} 