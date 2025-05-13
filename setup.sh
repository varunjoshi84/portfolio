#!/bin/bash

echo "Setting up Creative Dimension Portfolio project..."

# Install dependencies
echo "Installing dependencies..."
npm install

# Add SQLite dependencies
echo "Installing SQLite dependencies..."
npm install better-sqlite3 @types/better-sqlite3

# Create SQLite database setup script
echo "Setting up database..."

# Make the script executable
chmod +x setup.sh

echo "Setup complete!"
echo "You can now run 'npm run dev' to start the development server."
