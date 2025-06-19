import * as schema from "@shared/schema";
import path from 'path';
import { fileURLToPath } from 'url';

let db: any;
let isSQLite = false;

function initDbSync() {
  // Use SQLite for local development
  const { drizzle } = require('drizzle-orm/better-sqlite3');
  const Database = require('better-sqlite3');
  const __dirname = path.dirname(fileURLToPath(import.meta.url));
  const dbPath = path.join(__dirname, '..', 'portfolio.db');
  console.log(`Using SQLite database at ${dbPath}`);
  const sqlite = new Database(dbPath);
  db = drizzle(sqlite, { schema });
  isSQLite = true;
}

if (process.env.VERCEL || process.env.NODE_ENV === 'production') {
  // Use Postgres for Vercel/production
  // Import dynamically to avoid issues in dev
  import('./postgres-db').then(pgModule => {
    db = pgModule.db;
    isSQLite = false;
    console.log('Using PostgreSQL database via import');
  }).catch(error => {
    console.error('Error initializing Postgres database:', error);
    db = {};
  });
} else {
  // Use SQLite for local development
  initDbSync();
}

export { db, isSQLite };
