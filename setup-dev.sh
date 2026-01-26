#!/bin/bash

# Personal Finance Manager - Quick Start Script
# This script helps you start the application with proper setup

set -e

echo "🚀 Personal Finance Manager - Quick Start"
echo "=========================================="
echo ""

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Check if we're in the right directory
if [ ! -f "docker-compose.yml" ]; then
    echo -e "${RED}Error: docker-compose.yml not found. Please run this script from the project root.${NC}"
    exit 1
fi

echo -e "${YELLOW}Step 1: Starting PostgreSQL database...${NC}"
docker-compose up -d postgres

echo ""
echo -e "${YELLOW}Step 2: Waiting for PostgreSQL to be ready...${NC}"
sleep 5

echo ""
echo -e "${YELLOW}Step 3: Setting up backend...${NC}"
cd backend

if [ ! -d "node_modules" ]; then
    echo "Installing backend dependencies..."
    npm install
fi

echo "Running database migrations..."
npx prisma migrate dev --name init || echo "Migrations already applied"

echo "Generating Prisma client..."
npx prisma generate

echo ""
echo -e "${GREEN}✓ Backend setup complete!${NC}"
echo ""

cd ..

echo -e "${YELLOW}Step 4: Setting up frontend...${NC}"
cd frontend

if [ ! -d "node_modules" ]; then
    echo "Installing frontend dependencies..."
    npm install
fi

echo ""
echo -e "${GREEN}✓ Frontend setup complete!${NC}"
echo ""

cd ..

echo "=========================================="
echo -e "${GREEN}✨ Setup Complete!${NC}"
echo ""
echo "To start the application:"
echo ""
echo "Terminal 1 (Backend):"
echo -e "${YELLOW}  cd backend && npm run start:dev${NC}"
echo ""
echo "Terminal 2 (Frontend):"
echo -e "${YELLOW}  cd frontend && npm run dev${NC}"
echo ""
echo "Then open your browser to:"
echo -e "${GREEN}  http://localhost:5173${NC}"
echo ""
echo "GraphQL Playground:"
echo -e "${GREEN}  http://localhost:4000/graphql${NC}"
echo ""
echo "After backend is running, generate GraphQL types:"
echo -e "${YELLOW}  cd frontend && npm run codegen${NC}"
echo ""
