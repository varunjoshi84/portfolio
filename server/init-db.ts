import { db } from "./db";
import { users, projects } from "@shared/schema";
import { storage } from "./storage";
import { eq, count } from "drizzle-orm";

/**
 * Initialize the database with sample data
 */
export async function initializeDatabase() {
  console.log("Initializing database with sample data...");
  
  try {
    // First, run a db:push to ensure the schema is applied
    try {
      // Run a simple query to check database connection
      await db.select().from(users).limit(1);
      console.log("Database connected successfully");
    } catch (error) {
      console.error("Error connecting to database - make sure to run db:push first");
      throw error;
    }
    
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
        password: "admin123" // In a real app, this would be hashed
      });
    }
    
    // Check if projects exist
    const projectsExist = await db
      .select({ value: count() })
      .from(projects);
    
    // Create sample projects if none exist
    if (!projectsExist[0] || projectsExist[0].value === 0) {
      console.log("Creating sample projects...");
      
      await storage.createProject({
        title: "Modern E-commerce Platform",
        description: "A full-featured online store with seamless checkout process and inventory management.",
        category: "Web App",
        imageUrl: "https://images.unsplash.com/photo-1517292987719-0369a794ec0f?auto=format&fit=crop&w=600&h=400",
        technologies: ["React", "Node.js", "MongoDB"],
        projectUrl: "https://example.com/ecommerce"
      });
      
      await storage.createProject({
        title: "Interactive Product Configurator",
        description: "Real-time 3D product visualization with customizable features and export options.",
        category: "3D App",
        imageUrl: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?auto=format&fit=crop&w=600&h=400",
        technologies: ["Three.js", "React", "WebGL"],
        projectUrl: "https://example.com/configurator"
      });
      
      await storage.createProject({
        title: "Analytics Dashboard",
        description: "Interactive data visualization platform with real-time metrics and customizable reports.",
        category: "Dashboard",
        imageUrl: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=600&h=400",
        technologies: ["D3.js", "Vue", "Firebase"],
        projectUrl: "https://example.com/analytics"
      });
    }
    
    console.log("Database initialization complete!");
  } catch (error) {
    console.error("Error initializing database:", error);
  }
}