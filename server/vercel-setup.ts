import { db } from './db.js';
import { projects, messages, users } from '@shared/schema';
import { sql } from 'drizzle-orm';

async function main() {
  console.log('Setting up database...');
  
  // Create tables
  await db.execute(sql`
    CREATE TABLE IF NOT EXISTS users (
      id SERIAL PRIMARY KEY,
      username TEXT NOT NULL UNIQUE,
      password TEXT NOT NULL,
      created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
    );
    
    CREATE TABLE IF NOT EXISTS projects (
      id SERIAL PRIMARY KEY,
      title TEXT NOT NULL,
      description TEXT,
      image_url TEXT,
      technologies TEXT[],
      demo_url TEXT,
      source_url TEXT,
      highlighted BOOLEAN DEFAULT FALSE,
      created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
    );
    
    CREATE TABLE IF NOT EXISTS messages (
      id SERIAL PRIMARY KEY,
      name TEXT NOT NULL,
      email TEXT NOT NULL,
      message TEXT NOT NULL,
      project_interest TEXT,
      read BOOLEAN DEFAULT FALSE,
      created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
    );
  `);
  
  // Insert admin user if doesn't exist
  const existingUsers = await db.select().from(users);
  if (existingUsers.length === 0) {
    await db.insert(users).values({
      username: 'admin',
      password: 'adminpass', // In production, use proper password hashing
    });
    console.log('Admin user created');
  }
  
  // Insert sample projects if none exist
  const existingProjects = await db.select().from(projects);
  if (existingProjects.length === 0) {
    await db.insert(projects).values([
      {
        title: 'Portfolio Website',
        description: 'A modern portfolio website built with React and Node.js',
        imageUrl: 'https://via.placeholder.com/300',
        technologies: ['React', 'Node.js', 'Tailwind CSS', 'Vercel'],
        demoUrl: 'https://example.com',
        sourceUrl: 'https://github.com/example/portfolio',
        highlighted: true,
      },
      {
        title: 'E-commerce Platform',
        description: 'Full-stack e-commerce platform with payment processing',
        imageUrl: 'https://via.placeholder.com/300',
        technologies: ['Next.js', 'Express', 'PostgreSQL', 'Stripe'],
        demoUrl: 'https://example.com/ecommerce',
        sourceUrl: 'https://github.com/example/ecommerce',
        highlighted: false,
      }
    ]);
    console.log('Sample projects created');
  }
  
  console.log('Database setup complete!');
}

try {
  main();
} catch (error) {
  console.error('Error setting up the database:', error);
  process.exit(1);
}
