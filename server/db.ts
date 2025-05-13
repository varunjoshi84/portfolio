import * as schema from "@shared/schema";
import path from 'path';
import { fileURLToPath } from 'url';

let db;

// Check if running in Vercel environment
if (process.env.VERCEL || process.env.NODE_ENV === 'production') {
  // Use PostgreSQL for production/Vercel
  import('postgres').then(async (postgres) => {
    const { drizzle } = await import('drizzle-orm/postgres-js');
    
    const client = postgres.default(
      process.env.POSTGRES_URL_NON_POOLING || process.env.DATABASE_URL || '',
      { ssl: 'require' }
    );
    
    db = drizzle(client, { schema });
    console.log('Using PostgreSQL database');
  });
} else {
  // Use SQLite for local development
  // Get the directory path
  const __dirname = path.dirname(fileURLToPath(import.meta.url));
  const dbPath = path.join(__dirname, '..', 'portfolio.db');
  
  console.log(`Using SQLite database at ${dbPath}`);
  
  import('better-sqlite3').then(async (Database) => {
    const { drizzle } = await import('drizzle-orm/better-sqlite3');
    
    // Create a database connection
    const sqlite = new Database.default(dbPath);
    db = drizzle(sqlite, { schema });
  });
}

export { db };
