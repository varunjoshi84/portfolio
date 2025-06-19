import { db, isSQLite } from "./db";
import { users, projects } from "@shared/schema";
import { storage } from "./storage";
import { eq, count } from "drizzle-orm";
import { drizzle } from "drizzle-orm/better-sqlite3";
import Database from "better-sqlite3";
import path from "path";
import { fileURLToPath } from "url";

// Create tables using SQL (only for SQLite)
async function createTablesIfSQLite() {
  if (!isSQLite) return;
  const __dirname = path.dirname(fileURLToPath(import.meta.url));
  const dbPath = path.join(__dirname, '..', 'portfolio.db');
  const sqlite = new Database(dbPath);
  const localDb = drizzle(sqlite);
  console.log("Creating tables if they don't exist (SQLite only)...");
  sqlite.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT NOT NULL UNIQUE,
      password TEXT NOT NULL
    );
  `);
  sqlite.exec(`
    CREATE TABLE IF NOT EXISTS projects (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      description TEXT NOT NULL,
      category TEXT NOT NULL,
      image_url TEXT,
      technologies TEXT NOT NULL,
      project_url TEXT,
      screenshots TEXT,
      detailed_description TEXT,
      created_at INTEGER NOT NULL DEFAULT (unixepoch())
    );
  `);
  sqlite.exec(`
    CREATE TABLE IF NOT EXISTS messages (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT NOT NULL,
      message TEXT NOT NULL,
      project_interest TEXT,
      created_at INTEGER NOT NULL DEFAULT (unixepoch()),
      read INTEGER DEFAULT 0
    );
  `);
  console.log("Tables created successfully (SQLite)");
}

/**
 * Initialize the database with sample data
 */
export async function initializeDatabase() {
  console.log("Initializing database with sample data...");
  try {
    // Create tables if they don't exist (only for SQLite)
    await createTablesIfSQLite();
    // Test database connection
    await db.select().from(users).limit(1);
    console.log("Database connected successfully");
    // Check if admin user exists
    const adminExists = await db
      .select({ value: count() })
      .from(users)
      .where(eq(users.username, "admin"));
    // Create admin user if it doesn't exist
    if (!adminExists[0] || adminExists[0].value === 0) {
      console.log("Creating admin user...");
      await storage.createUser({
        username: "admin",
        password: "iamzombie" // In a real app, this would be hashed
      });
    }
    // Check if projects exist
    const projectsExist = await db
      .select({ value: count() })
      .from(projects);
    // Create sample projects if none exist
    if (!projectsExist[0] || projectsExist[0].value === 0) {
      console.log("Creating sample projects...");
      // For SQLite, we need to stringify arrays before saving
      await storage.createProject({
        title: "Modern E-commerce Platform",
        description: "A full-featured online store with seamless checkout process and inventory management.",
        category: "Web App",
        imageUrl: "https://images.unsplash.com/photo-1517292987719-0369a794ec0f?auto=format&fit=crop&w=600&h=400",
        technologies: isSQLite ? JSON.stringify(["React", "Node.js", "MongoDB"]) : ["React", "Node.js", "MongoDB"].join(","),
        projectUrl: "https://example.com/ecommerce"
      });
      await storage.createProject({
        title: "Interactive Product Configurator",
        description: "Real-time 3D product visualization with customizable features and export options.",
        category: "3D App",
        imageUrl: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?auto=format&fit=crop&w=600&h=400",
        technologies: isSQLite ? JSON.stringify(["Three.js", "React", "WebGL"]) : ["Three.js", "React", "WebGL"].join(","),
        projectUrl: "https://example.com/configurator"
      });
      await storage.createProject({
        title: "Analytics Dashboard",
        description: "Interactive data visualization platform with real-time metrics and customizable reports.",
        category: "Dashboard",
        imageUrl: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=600&h=400",
        technologies: isSQLite ? JSON.stringify(["D3.js", "Vue", "Firebase"]) : ["D3.js", "Vue", "Firebase"].join(","),
        projectUrl: "https://example.com/analytics"
      });
    }
    console.log("Database initialization complete!");
  } catch (err) {
    console.error("Error initializing database:", err);
    throw err;
  }
}
