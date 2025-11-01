#!/bin/bash
set -e

echo "🧪 Running tests..."

# Set test environment
export NODE_ENV=test

# Run tests with coverage
npm run test -- --coverage

echo "✅ All tests passed!"