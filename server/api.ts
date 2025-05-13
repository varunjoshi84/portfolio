import express from "express";
import cors from "cors";
import { registerRoutes } from "./routes";
import path from "path";
import { initializeDatabase } from "./init-db";

// Create Express app for serverless function
const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// Static files serving for production
const clientBuildPath = path.join(__dirname, "../client/dist");
app.use(express.static(clientBuildPath));

// Initialize database
let dbInitialized = false;

// Serverless function handler for Vercel
export default async (req: any, res: any) => {
  // Initialize database only once
  if (!dbInitialized) {
    try {
      await initializeDatabase();
      dbInitialized = true;
      console.log('Database initialized for serverless function');
    } catch (error) {
      console.error('Error initializing database:', error);
    }
  }
  
  // Register all API routes
  await registerRoutes(app);
  
  // Forward the request to Express
  return app(req, res);
};

// Standard server start for local development
if (process.env.NODE_ENV !== "production") {
  const PORT = process.env.PORT || 3000;
  
  registerRoutes(app).then((server) => {
    server.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  });
}
