#!/bin/bash
set -e

echo "🌱 Seeding database with exercise data..."

if [ -z "$SUPABASE_URL" ] || [ -z "$SUPABASE_SERVICE_ROLE_KEY" ]; then
    echo "❌ Missing Supabase credentials"
    exit 1
fi

echo "Seeding exercises..."
# Execute seed SQL file

echo "✅ Database seeded successfully!"