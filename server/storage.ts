import { 
  users, type User, type InsertUser,
  projects, type Project, type InsertProject,
  messages, type Message, type InsertMessage
} from "@shared/schema";
import { db } from "./db";
import { eq, desc, asc } from "drizzle-orm";

export interface IStorage {
  // User methods
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Project methods
  getProjects(): Promise<Project[]>;
  getProject(id: number): Promise<Project | undefined>;
  createProject(project: InsertProject): Promise<Project>;
  updateProject(id: number, project: Partial<InsertProject>): Promise<Project | undefined>;
  deleteProject(id: number): Promise<boolean>;
  
  // Message methods
  getMessages(): Promise<Message[]>;
  getMessage(id: number): Promise<Message | undefined>;
  createMessage(message: InsertMessage): Promise<Message>;
  markMessageAsRead(id: number): Promise<Message | undefined>;
  deleteMessage(id: number): Promise<boolean>;
}

export class DatabaseStorage implements IStorage {
  // User methods
  async getUser(id: number): Promise<User | undefined> {
    const result = await db.select().from(users).where(eq(users.id, id));
    return result[0];
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const result = await db.select().from(users).where(eq(users.username, username));
    return result[0];
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const result = await db.insert(users).values(insertUser).returning();
    return result[0];
  }

  // Project methods
  async getProjects(): Promise<Project[]> {
    return await db.select().from(projects).orderBy(desc(projects.createdAt));
  }

  async getProject(id: number): Promise<Project | undefined> {
    const result = await db.select().from(projects).where(eq(projects.id, id));
    return result[0];
  }

  async createProject(insertProject: InsertProject): Promise<Project> {
    const result = await db.insert(projects).values(insertProject).returning();
    return result[0];
  }

  async updateProject(id: number, project: Partial<InsertProject>): Promise<Project | undefined> {
    const result = await db
      .update(projects)
      .set(project)
      .where(eq(projects.id, id))
      .returning();
    
    return result[0];
  }

  async deleteProject(id: number): Promise<boolean> {
    await db.delete(projects).where(eq(projects.id, id));
    return true; // In PostgreSQL, success is indicated by not throwing an error
  }

  // Message methods
  async getMessages(): Promise<Message[]> {
    return await db.select().from(messages).orderBy(desc(messages.createdAt));
  }

  async getMessage(id: number): Promise<Message | undefined> {
    const result = await db.select().from(messages).where(eq(messages.id, id));
    return result[0];
  }

  async createMessage(insertMessage: InsertMessage): Promise<Message> {
    const result = await db.insert(messages).values(insertMessage).returning();
    return result[0];
  }

  async markMessageAsRead(id: number): Promise<Message | undefined> {
    const result = await db
      .update(messages)
      .set({ read: true })
      .where(eq(messages.id, id))
      .returning();
    
    return result[0];
  }

  async deleteMessage(id: number): Promise<boolean> {
    await db.delete(messages).where(eq(messages.id, id));
    return true; // In PostgreSQL, success is indicated by not throwing an error
  }
}

// Initialize with database storage
export const storage = new DatabaseStorage();
