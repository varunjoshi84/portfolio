#!/bin/bash

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${YELLOW}=== Portfolio Deployment Script ===${NC}"
echo "This script will help you deploy your portfolio to Vercel"

# Step 1: Commit all changes
echo -e "${YELLOW}\nStep 1: Committing changes to Git${NC}"
read -p "Enter a commit message: " commit_message

echo -e "${GREEN}Adding all files...${NC}"
git add .

echo -e "${GREEN}Committing changes...${NC}"
git commit -m "$commit_message"

echo -e "${GREEN}Pushing to remote repository...${NC}"
git push origin main

# Step 2: Deploy to Vercel
echo -e "${YELLOW}\nStep 2: Deploying to Vercel${NC}"

# Check if we're already authenticated with Vercel
if ! vercel whoami &> /dev/null; then
  echo -e "${RED}You need to log in to Vercel first${NC}"
  vercel login
fi

echo -e "${GREEN}Deploying application...${NC}"
vercel --prod

echo -e "${YELLOW}\n=== Deployment Complete ===${NC}"
echo "Check your Vercel dashboard for more details and to manage environment variables"
echo -e "${GREEN}https://vercel.com/dashboard${NC}"
