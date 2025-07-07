#!/bin/bash

echo "🚀 Starting INERI Backend API..."

# Kill any existing process on port 5000
echo "📛 Stopping any existing processes on port 5000..."
lsof -ti:5000 | xargs kill -9 2>/dev/null || true

# Wait a moment
sleep 2

# Set environment to Development
export ASPNETCORE_ENVIRONMENT=Development

# Start the API
echo "🔄 Starting API server..."
dotnet run --urls="http://localhost:5000"
