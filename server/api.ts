import express from "express";
import cors from "cors";
import { registerRoutes } from "./routes";
import path from "path";
import { initializeDatabase } from "./init-db";

// Initialize database once for serverless function
let dbInitialized = false;
let appInitialized = false;
let app: express.Express;

// Serverless function handler for Vercel
export default async (req: any, res: any) => {
  // Only initialize these things once per serverless instance
  if (!appInitialized) {
    console.log('Initializing Express app for serverless function');
    
    // Create Express app
    app = express();
    
    // Middleware
    app.use(express.json());
    app.use(cors({
      origin: process.env.VERCEL_URL || '*',
      credentials: true
    }));
    
    // Static files serving
    if (process.env.NODE_ENV === 'production') {
      const distPath = path.join(process.cwd(), 'dist');
      console.log(`Serving static files from: ${distPath}`);
      app.use(express.static(distPath));
    }
    
    // Initialize database
    try {
      await initializeDatabase();
      dbInitialized = true;
      console.log('Database initialized for serverless function');
    } catch (error) {
      console.error('Error initializing database:', error);
    }
    
    // Register all API routes
    await registerRoutes(app);
    appInitialized = true;
    console.log('Express app fully initialized');
  }
  
  // Forward the request to Express
  return app(req, res);
};

// Standard server start for local development
if (process.env.NODE_ENV !== "production") {
  const PORT = process.env.PORT || 3000;

  // Initialize Express app for local development
  app = express();
  app.use(express.json());
  app.use(cors({
    origin: process.env.VERCEL_URL || '*',
    credentials: true
  }));

  registerRoutes(app).then((server) => {
    server.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  });
}
