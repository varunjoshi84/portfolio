import * as schema from "@shared/schema";
import path from 'path';
import { fileURLToPath } from 'url';

// Create a synchronous connection to make initialization easier
let db;

// Create database connection immediately rather than with promises
try {
  // Check if running in Vercel environment
  if (process.env.VERCEL || process.env.NODE_ENV === 'production') {
    // For Vercel deployment, use the postgres-db module
    const { db: postgresDb } = require('./postgres-db');
    db = postgresDb;
    console.log('Using PostgreSQL database via import');
  } else {
    // Use SQLite for local development
    // Get the directory path
    const __dirname = path.dirname(fileURLToPath(import.meta.url));
    const dbPath = path.join(__dirname, '..', 'portfolio.db');
    
    console.log(`Using SQLite database at ${dbPath}`);
    
    const Database = require('better-sqlite3');
    const { drizzle } = require('drizzle-orm/better-sqlite3');
    
    // Create a database connection
    const sqlite = new Database(dbPath);
    db = drizzle(sqlite, { schema });
  }
} catch (error) {
  console.error('Error initializing database:', error);
  // Create a dummy DB object to prevent crashes
  db = {
    select: () => ({ from: () => ({ where: () => [], limit: () => [] }) }),
    insert: () => ({ values: () => ({}) }),
    delete: () => ({ where: () => ({}) }),
    update: () => ({ set: () => ({ where: () => ({}) }) }),
  };
}

export { db };
