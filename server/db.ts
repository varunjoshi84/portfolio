import { drizzle } from 'drizzle-orm/better-sqlite3';
import Database from 'better-sqlite3';
import * as schema from "@shared/schema";
import path from 'path';
import { fileURLToPath } from 'url';

// Get the directory path
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dbPath = path.join(__dirname, '..', 'portfolio.db');

console.log(`Using SQLite database at ${dbPath}`);

// Create a database connection
const sqlite = new Database(dbPath);
export const db = drizzle(sqlite, { schema });
