import { 
  users, type User, type InsertUser,
  projects, type Project, type InsertProject,
  messages, type Message, type InsertMessage
} from "@shared/schema";

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

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private projects: Map<number, Project>;
  private messages: Map<number, Message>;
  private userId: number;
  private projectId: number;
  private messageId: number;

  constructor() {
    this.users = new Map();
    this.projects = new Map();
    this.messages = new Map();
    this.userId = 1;
    this.projectId = 1;
    this.messageId = 1;
    
    // Add a default admin user
    this.createUser({
      username: "admin",
      password: "admin123" // In a real app, this would be hashed
    });
    
    // Add some sample projects
    this.createProject({
      title: "Modern E-commerce Platform",
      description: "A full-featured online store with seamless checkout process and inventory management.",
      category: "Web App",
      imageUrl: "https://images.unsplash.com/photo-1517292987719-0369a794ec0f?auto=format&fit=crop&w=600&h=400",
      technologies: ["React", "Node.js", "MongoDB"],
      projectUrl: "https://example.com/ecommerce"
    });
    
    this.createProject({
      title: "Interactive Product Configurator",
      description: "Real-time 3D product visualization with customizable features and export options.",
      category: "3D App",
      imageUrl: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?auto=format&fit=crop&w=600&h=400",
      technologies: ["Three.js", "React", "WebGL"],
      projectUrl: "https://example.com/configurator"
    });
    
    this.createProject({
      title: "Analytics Dashboard",
      description: "Interactive data visualization platform with real-time metrics and customizable reports.",
      category: "Dashboard",
      imageUrl: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=600&h=400",
      technologies: ["D3.js", "Vue", "Firebase"],
      projectUrl: "https://example.com/analytics"
    });
  }

  // User methods
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.userId++;
    const now = new Date();
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  // Project methods
  async getProjects(): Promise<Project[]> {
    return Array.from(this.projects.values()).sort((a, b) => {
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });
  }

  async getProject(id: number): Promise<Project | undefined> {
    return this.projects.get(id);
  }

  async createProject(insertProject: InsertProject): Promise<Project> {
    const id = this.projectId++;
    const now = new Date();
    const project: Project = { 
      ...insertProject, 
      id, 
      createdAt: now
    };
    this.projects.set(id, project);
    return project;
  }

  async updateProject(id: number, project: Partial<InsertProject>): Promise<Project | undefined> {
    const existingProject = this.projects.get(id);
    if (!existingProject) return undefined;

    const updatedProject: Project = {
      ...existingProject,
      ...project,
    };
    this.projects.set(id, updatedProject);
    return updatedProject;
  }

  async deleteProject(id: number): Promise<boolean> {
    return this.projects.delete(id);
  }

  // Message methods
  async getMessages(): Promise<Message[]> {
    return Array.from(this.messages.values()).sort((a, b) => {
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });
  }

  async getMessage(id: number): Promise<Message | undefined> {
    return this.messages.get(id);
  }

  async createMessage(insertMessage: InsertMessage): Promise<Message> {
    const id = this.messageId++;
    const now = new Date();
    const message: Message = { 
      ...insertMessage, 
      id, 
      createdAt: now,
      read: false
    };
    this.messages.set(id, message);
    return message;
  }

  async markMessageAsRead(id: number): Promise<Message | undefined> {
    const message = this.messages.get(id);
    if (!message) return undefined;

    const updatedMessage: Message = {
      ...message,
      read: true
    };
    this.messages.set(id, updatedMessage);
    return updatedMessage;
  }

  async deleteMessage(id: number): Promise<boolean> {
    return this.messages.delete(id);
  }
}

export const storage = new MemStorage();
