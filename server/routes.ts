import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import nodemailer from "nodemailer";
import { insertMessageSchema, insertProjectSchema } from "@shared/schema";
import session from "express-session";
import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import { z } from "zod";
import MemoryStore from "memorystore";

// Create a nodemailer test account (ethereal) for development
let transporter: nodemailer.Transporter;

async function setupNodemailer() {
  // Use Gmail for both production and development for testing
  transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'joshivarun266@gmail.com', // Your Gmail address
      pass: 'zryr xmij rmww yjjp',      // Your app password
    },
    tls: {
      rejectUnauthorized: false // For testing only - remove in real production
    }
  });
  console.log('Nodemailer configured with Gmail');
  
  // Fallback to Ethereal if Gmail fails or if explicitly using development environment
  if (process.env.USE_ETHEREAL === 'true') {
    try {
      const testAccount = await nodemailer.createTestAccount();
      
      transporter = nodemailer.createTransport({
        host: "smtp.ethereal.email",
        port: 587,
        secure: false,
        auth: {
          user: testAccount.user,
          pass: testAccount.pass,
        },
      });
      
      console.log(`Nodemailer test account: ${testAccount.web}`);
    } catch (error) {
      console.error('Failed to create ethereal test account:', error);
      // Fallback to a console logger when ethereal setup fails
      transporter = {
        sendMail: (options: any) => {
          console.log('Email would be sent with these options:');
          console.log(options);
          return Promise.resolve({ messageId: 'test-id-' + Date.now() });
        }
      } as any;
      console.log('Using console transport for emails (development fallback)');
    }
  }
}

export async function registerRoutes(app: Express): Promise<Server> {
  // Setup Nodemailer
  await setupNodemailer();
  
  // Setup sessions
  const SessionStore = MemoryStore(session);
  
  app.use(session({
    secret: process.env.SESSION_SECRET || "dev-secret-key",
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false, maxAge: 24 * 60 * 60 * 1000 }, // 1 day
    store: new SessionStore({
      checkPeriod: 86400000 // prune expired entries every 24h
    })
  }));
  
  // Setup passport
  app.use(passport.initialize());
  app.use(passport.session());
  
  passport.use(new LocalStrategy(async (username, password, done) => {
    try {
      const user = await storage.getUserByUsername(username);
      if (!user) {
        return done(null, false, { message: "Incorrect username" });
      }
      
      // In a real app, we would hash the password and compare hashes
      if (user.password !== password) {
        return done(null, false, { message: "Incorrect password" });
      }
      
      return done(null, user);
    } catch (err) {
      return done(err);
    }
  }));
  
  passport.serializeUser((user: any, done) => {
    done(null, user.id);
  });
  
  passport.deserializeUser(async (id: number, done) => {
    try {
      const user = await storage.getUser(id);
      done(null, user);
    } catch (err) {
      done(err);
    }
  });
  
  // Authentication middleware
  const isAuthenticated = (req: Request, res: Response, next: Function) => {
    if (req.isAuthenticated()) {
      return next();
    }
    res.status(401).json({ message: "Unauthorized" });
  };
  
  // Auth routes
  app.post("/api/auth/login", (req, res, next) => {
    passport.authenticate("local", (err: Error, user: any, info: any) => {
      if (err) {
        return next(err);
      }
      if (!user) {
        return res.status(401).json({ message: info.message });
      }
      req.logIn(user, (err) => {
        if (err) {
          return next(err);
        }
        return res.json({ id: user.id, username: user.username });
      });
    })(req, res, next);
  });
  
  app.post("/api/auth/logout", (req, res) => {
    req.logout(() => {
      res.json({ success: true });
    });
  });
  
  app.get("/api/auth/status", (req, res) => {
    if (req.isAuthenticated()) {
      const user = req.user as any;
      res.json({ 
        authenticated: true, 
        user: { id: user.id, username: user.username } 
      });
    } else {
      res.json({ authenticated: false });
    }
  });
  
  // Project routes
  app.get("/api/projects", async (req, res) => {
    const projects = await storage.getProjects();
    res.json(projects);
  });
  
  app.get("/api/projects/:id", async (req, res) => {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ message: "Invalid ID" });
    }
    
    const project = await storage.getProject(id);
    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }
    
    res.json(project);
  });
  
  app.post("/api/projects", isAuthenticated, async (req, res) => {
    try {
      const projectData = insertProjectSchema.parse(req.body);
      const project = await storage.createProject(projectData);
      res.status(201).json(project);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: "Invalid project data", errors: error.errors });
      } else {
        res.status(500).json({ message: "Error creating project" });
      }
    }
  });
  
  app.patch("/api/projects/:id", isAuthenticated, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid ID" });
      }
      
      // Validate partial project data
      const projectData = insertProjectSchema.partial().parse(req.body);
      const project = await storage.updateProject(id, projectData);
      
      if (!project) {
        return res.status(404).json({ message: "Project not found" });
      }
      
      res.json(project);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: "Invalid project data", errors: error.errors });
      } else {
        res.status(500).json({ message: "Error updating project" });
      }
    }
  });
  
  app.delete("/api/projects/:id", isAuthenticated, async (req, res) => {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ message: "Invalid ID" });
    }
    
    const success = await storage.deleteProject(id);
    if (!success) {
      return res.status(404).json({ message: "Project not found" });
    }
    
    res.json({ success: true });
  });
  
  // Message routes
  app.get("/api/messages", isAuthenticated, async (req, res) => {
    const messages = await storage.getMessages();
    res.json(messages);
  });
  
  app.post("/api/messages", async (req, res) => {
    try {
      const messageData = insertMessageSchema.parse(req.body);
      const message = await storage.createMessage(messageData);
      
      // Send confirmation email to user
      const userMailOptions = {
        from: '"Portfolio Contact" <portfolio@example.com>',
        to: messageData.email,
        subject: "Thank you for contacting us",
        text: `Dear ${messageData.name},\n\nThank you for your message. We'll get back to you soon.\n\nRegards,\nPortfolio Team`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2>Thank you for your message</h2>
            <p>Dear ${messageData.name},</p>
            <p>We've received your message and will get back to you as soon as possible.</p>
            <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;">
            <p style="color: #666; font-size: 14px;">Regards,<br>Portfolio Team</p>
          </div>
        `
      };
      
      // Send notification email to admin
      const adminMailOptions = {
        from: '"Portfolio Contact System" <portfolio@example.com>',
        to: "admin@example.com",
        subject: "New Contact Form Submission",
        text: `
          New message from ${messageData.name} (${messageData.email})
          
          ${messageData.projectInterest ? `Interested in: ${messageData.projectInterest}` : 'No specific project interest'}
          
          Message:
          ${messageData.message}
        `,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2>New Contact Form Submission</h2>
            <p><strong>From:</strong> ${messageData.name} (${messageData.email})</p>
            ${messageData.projectInterest ? `<p><strong>Project Interest:</strong> ${messageData.projectInterest}</p>` : ''}
            <h3>Message:</h3>
            <p>${messageData.message.replace(/\n/g, '<br>')}</p>
          </div>
        `
      };
      
      // Send emails
      let emailStatus = { sent: false, error: null as string | null };
      
      try {
        const userEmailInfo = await transporter.sendMail(userMailOptions);
        console.log('User confirmation email sent:', userEmailInfo.messageId);
        
        if (process.env.NODE_ENV === 'development') {
          // In development, log the ethereal URL for viewing the email
          console.log('Preview user email at:', nodemailer.getTestMessageUrl(userEmailInfo));
        }
        
        const adminEmailInfo = await transporter.sendMail(adminMailOptions);
        console.log('Admin notification email sent:', adminEmailInfo.messageId);
        
        if (process.env.NODE_ENV === 'development') {
          // In development, log the ethereal URL for viewing the email
          console.log('Preview admin email at:', nodemailer.getTestMessageUrl(adminEmailInfo));
        }
        
        emailStatus.sent = true;
      } catch (error) {
        console.error("Error sending email:", error);
        emailStatus.error = process.env.NODE_ENV === 'development' ? String(error) : 'Email delivery issue';
      }
      
      // Return the message with email status
      res.status(201).json({
        ...message,
        emailStatus
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: "Invalid message data", errors: error.errors });
      } else {
        res.status(500).json({ message: "Error creating message" });
      }
    }
  });
  
  app.put("/api/messages/:id/read", isAuthenticated, async (req, res) => {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ message: "Invalid ID" });
    }
    
    const message = await storage.markMessageAsRead(id);
    if (!message) {
      return res.status(404).json({ message: "Message not found" });
    }
    
    res.json(message);
  });
  
  app.delete("/api/messages/:id", isAuthenticated, async (req, res) => {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ message: "Invalid ID" });
    }
    
    const success = await storage.deleteMessage(id);
    if (!success) {
      return res.status(404).json({ message: "Message not found" });
    }
    
    res.json({ success: true });
  });

  const httpServer = createServer(app);
  return httpServer;
}
