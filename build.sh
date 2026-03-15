#!/bin/bash

# Build script for deployment
echo "🚀 Starting build process..."

# Install dependencies
echo "📦 Installing dependencies..."
npm ci --only=production=false

# Make vite executable
echo "🔧 Setting permissions..."
chmod +x node_modules/.bin/vite

# Build the project
echo "🏗️ Building project..."
npm run build

echo "✅ Build completed successfully!"
echo "📁 Output directory: ./dist"