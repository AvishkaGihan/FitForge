#!/bin/bash
set -e

echo "🚀 Deploying FitForge Backend..."

# Build TypeScript
echo "📦 Building project..."
npm run build

# Run tests
echo "🧪 Running tests..."
npm test

# Deploy to Vercel
echo "☁️  Deploying to Vercel..."
vercel --prod

echo "✅ Deployment complete!"