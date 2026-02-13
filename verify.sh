#!/bin/bash

echo "==============================================="
echo "WSES Platform - Deployment Verification"
echo "==============================================="
echo ""

# Check prerequisites
echo "Checking prerequisites..."
if ! command -v docker &> /dev/null; then
    echo "❌ Docker is not installed"
    exit 1
fi
echo "✅ Docker installed"

if ! command -v docker compose &> /dev/null; then
    echo "❌ Docker Compose is not installed"
    exit 1
fi
echo "✅ Docker Compose installed"

echo ""
echo "Project structure:"
echo "├── backend/"
echo "│   ├── src/"
echo "│   │   ├── controllers/"
echo "│   │   ├── models/"
echo "│   │   ├── routes/"
echo "│   │   ├── services/"
echo "│   │   └── utils/"
echo "│   ├── Dockerfile"
echo "│   └── package.json"
echo "├── frontend/"
echo "│   ├── src/"
echo "│   │   ├── components/"
echo "│   │   ├── context/"
echo "│   │   ├── pages/"
echo "│   │   └── utils/"
echo "│   ├── Dockerfile"
echo "│   └── package.json"
echo "├── mysql-init/"
echo "│   └── init.sql"
echo "└── docker-compose.yml"
echo ""

# Verify files exist
echo "Verifying project files..."
files=(
    "docker-compose.yml"
    "backend/Dockerfile"
    "backend/package.json"
    "backend/src/app.js"
    "frontend/Dockerfile"
    "frontend/package.json"
    "frontend/src/App.js"
    "mysql-init/init.sql"
)

all_exist=true
for file in "${files[@]}"; do
    if [ -f "$file" ]; then
        echo "✅ $file"
    else
        echo "❌ $file missing"
        all_exist=false
    fi
done

if [ "$all_exist" = false ]; then
    echo ""
    echo "❌ Some files are missing. Please check the project structure."
    exit 1
fi

echo ""
echo "==============================================="
echo "✅ All verification checks passed!"
echo "==============================================="
echo ""
echo "To start the platform, run:"
echo "  docker compose up --build"
echo ""
echo "Access URLs:"
echo "  Frontend: http://localhost:3000"
echo "  Backend:  http://localhost:5000"
echo ""
echo "First time setup:"
echo "  1. Wait for all services to start (may take 2-3 minutes)"
echo "  2. Open http://localhost:3000 in your browser"
echo "  3. Click 'Sign Up' to create an account"
echo "  4. Start solving problems!"
echo ""
