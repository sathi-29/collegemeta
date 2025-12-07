#!/bin/bash

echo "🚀 Installing Careers360 Clone..."

# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ..
cd /frontend/src
npm install

echo "✅ Installation complete!"
echo ""
echo "To start the application:"
echo "1. Start MongoDB: sudo systemctl start mongod"
echo "2. Start backend: cd backend && npm start"
echo "3. Start frontend: cd frontend && npm start"
echo ""
echo "Access at: http://localhost:3000"