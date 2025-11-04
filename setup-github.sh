#!/bin/bash

echo "🚀 Setting up FitForge for GitHub..."

# Initialize git if not already initialized
if [ ! -d ".git" ]; then
    echo "📦 Initializing git repository..."
    git init
    git branch -M main
fi

# Create .gitignore if it doesn't exist
if [ ! -f ".gitignore" ]; then
    echo "📝 Creating .gitignore..."
    cat > .gitignore << 'EOF'
# Dependencies
node_modules/
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# Environment variables
.env
.env.local
.env.production
.env.*.local

# Build outputs
dist/
build/
*.log

# Expo
.expo/
.expo-shared/
web-build/

# macOS & Windows
.DS_Store
Thumbs.db

# IDE
.vscode/
.idea/
*.swp

# Testing
coverage/

# Logs
logs/
EOF
fi

# Create README if it doesn't exist
if [ ! -f "README.md" ]; then
    echo "📄 Creating README.md..."
    echo "# FitForge - AI-Powered Fitness App" > README.md
    echo "" >> README.md
    echo "See full documentation in the repository." >> README.md
fi

# Create docs directory
mkdir -p docs/screenshots

# Stage all files
echo "📦 Staging files..."
git add .

# Create initial commit
echo "💾 Creating initial commit..."
git commit -m "Initial commit: FitForge v1.0

- React Native mobile app with Expo
- Node.js backend API with Express
- AI-powered workout generation
- Conversational AI coach
- Complete authentication system
- 18 screens with premium UI
- Comprehensive documentation"

echo ""
echo "✅ Git repository initialized!"
echo ""
echo "Next steps:"
echo "1. Create a new repository on GitHub"
echo "2. Run these commands:"
echo "   git remote add origin https://github.com/AvishkaGihan/fitforge.git"
echo "   git push -u origin main"
echo ""

