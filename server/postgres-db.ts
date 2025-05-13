import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from './schema';

// For Vercel PostgreSQL
let client;

if (process.env.POSTGRES_URL) {
  client = postgres(process.env.POSTGRES_URL_NON_POOLING);
} else {
  // Fallback to a local database for development
  console.log('No PostgreSQL URL found in environment variables; using local database');
  client = postgres(process.env.DATABASE_URL || 'postgres://default:default@localhost:5432/portfolio');
}

export const db = drizzle(client, { schema });
