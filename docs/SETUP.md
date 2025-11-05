# Setup Guide - FitForge

This guide will walk you through setting up the FitForge development environment on your local machine.

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Clone Repository](#clone-repository)
3. [Backend Setup](#backend-setup)
4. [Database Setup](#database-setup)
5. [Mobile App Setup](#mobile-app-setup)
6. [Running the Application](#running-the-application)
7. [Troubleshooting](#troubleshooting)
8. [Development Tools](#development-tools)

---

## Prerequisites

Before you begin, ensure you have the following installed:

### Required Software

- **Node.js 22+ LTS** - [Download](https://nodejs.org/)

  ```bash
  node --version  # Should be 22.x or higher
  ```

- **npm** or **yarn** - Comes with Node.js

  ```bash
  npm --version  # Should be 10.x or higher
  ```

- **Git** - [Download](https://git-scm.com/)

  ```bash
  git --version
  ```

- **Expo CLI** - For mobile development
  ```bash
  npm install -g @expo/cli
  expo --version
  ```

### Mobile Development

**For iOS Development (macOS only):**

- Xcode 15+ from the Mac App Store
- CocoaPods: `sudo gem install cocoapods`
- iOS Simulator (included with Xcode)

**For Android Development:**

- Android Studio - [Download](https://developer.android.com/studio)
- Android SDK (API 33+)
- Android Emulator or physical device

### Accounts & API Keys

1. **Supabase Account** - [Sign up](https://supabase.com/)
2. **Google Cloud Account** - [Sign up](https://cloud.google.com/)
   - Enable Gemini API
   - Get API key
3. **Pinecone Account** (Optional) - [Sign up](https://www.pinecone.io/)

---

## Clone Repository

```bash
# Clone the repository
git clone https://github.com/AvishkaGihan/fitforge.git

# Navigate to project directory
cd fitforge

# Install root dependencies (if any)
npm install
```

---

## Backend Setup

### 1. Navigate to Backend Directory

```bash
cd backend
```

### 2. Install Dependencies

```bash
npm install
```

This will install all backend dependencies including:

- Express
- TypeScript
- Supabase client
- LangChain
- Google Gemini SDK
- And more...

### 3. Create Environment File

Create a `.env` file in the `backend` directory:

```bash
# Windows
copy .env.example .env

# macOS/Linux
cp .env.example .env
```

If `.env.example` doesn't exist, create `.env` manually with the following content:

```env
# Server Configuration
NODE_ENV=development
PORT=3000

# Database (Supabase)
SUPABASE_URL=your_supabase_project_url
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# Authentication
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production

# AI Services
GOOGLE_GEMINI_API_KEY=your_gemini_api_key

# Pinecone (Optional - for vector search)
PINECONE_API_KEY=your_pinecone_api_key
PINECONE_ENVIRONMENT=your_pinecone_environment
PINECONE_INDEX_NAME=fitforge-exercises

# Logging
LOG_LEVEL=info

# CORS
ALLOWED_ORIGINS=http://localhost:19006,exp://localhost:19000
```

### 4. Configure Environment Variables

#### Get Supabase Credentials

1. Go to [Supabase Dashboard](https://app.supabase.com/)
2. Create a new project (or use existing)
3. Go to **Settings** → **API**
4. Copy:
   - `Project URL` → `SUPABASE_URL`
   - `service_role secret` → `SUPABASE_SERVICE_ROLE_KEY`

#### Get Google Gemini API Key

1. Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Click **Get API Key**
3. Create new API key
4. Copy key → `GOOGLE_GEMINI_API_KEY`

#### Generate JWT Secret

```bash
# Windows (PowerShell)
[Convert]::ToBase64String([System.Text.Encoding]::UTF8.GetBytes((New-Guid).ToString()))

# macOS/Linux
openssl rand -base64 32
```

Copy the output to `JWT_SECRET`

### 5. Build TypeScript

```bash
npm run build
```

This compiles TypeScript files to JavaScript in the `dist` folder.

---

## Database Setup

### 1. Access Supabase SQL Editor

1. Open your Supabase project dashboard
2. Navigate to **SQL Editor**
3. Click **New Query**

### 2. Run Database Migrations

Copy and run each migration file from `backend/database/migrations/`:

**Migration: 001_initial_schema.sql**

```sql
-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  fitness_goal VARCHAR(50),
  fitness_level VARCHAR(20),
  equipment TEXT[],
  time_per_workout INTEGER,
  days_per_week INTEGER,
  restrictions TEXT,
  avoided_exercises TEXT[],
  preferred_exercises TEXT[],
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Exercises table
CREATE TABLE exercises (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255) NOT NULL,
  description TEXT,
  muscle_groups TEXT[],
  equipment TEXT[],
  instructions TEXT NOT NULL,
  difficulty VARCHAR(20),
  video_url TEXT,
  thumbnail_url TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Workout plans table
CREATE TABLE workout_plans (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  exercises JSONB NOT NULL,
  estimated_duration INTEGER,
  difficulty VARCHAR(20),
  created_at TIMESTAMP DEFAULT NOW()
);

-- Workout sessions table
CREATE TABLE workout_sessions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  workout_plan_id UUID REFERENCES workout_plans(id),
  started_at TIMESTAMP NOT NULL,
  completed_at TIMESTAMP,
  total_duration INTEGER,
  status VARCHAR(20),
  feedback TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Chat messages table
CREATE TABLE chat_messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  role VARCHAR(20) NOT NULL,
  content TEXT NOT NULL,
  timestamp TIMESTAMP DEFAULT NOW()
);

-- Create indexes for better query performance
CREATE INDEX idx_workout_plans_user_id ON workout_plans(user_id);
CREATE INDEX idx_workout_sessions_user_id ON workout_sessions(user_id);
CREATE INDEX idx_chat_messages_user_id ON chat_messages(user_id);
CREATE INDEX idx_exercises_muscle_groups ON exercises USING GIN(muscle_groups);
CREATE INDEX idx_exercises_equipment ON exercises USING GIN(equipment);

-- Row Level Security (RLS) Policies
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE workout_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE workout_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_messages ENABLE ROW LEVEL SECURITY;

-- Users can only read their own data
CREATE POLICY users_select_policy ON users
  FOR SELECT USING (auth.uid() = id);

-- Users can only update their own data
CREATE POLICY users_update_policy ON users
  FOR UPDATE USING (auth.uid() = id);

-- Users can only insert their own workout plans
CREATE POLICY workout_plans_insert_policy ON workout_plans
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Users can only select their own workout plans
CREATE POLICY workout_plans_select_policy ON workout_plans
  FOR SELECT USING (auth.uid() = user_id);

-- Similar policies for other tables
CREATE POLICY workout_sessions_policy ON workout_sessions
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY chat_messages_policy ON chat_messages
  FOR ALL USING (auth.uid() = user_id);
```

Click **Run** to execute.

### 3. Seed Exercise Data

Run the seed file from `backend/database/seeds/001_exercises_seed.sql`:

```sql
-- Insert sample exercises
INSERT INTO exercises (name, description, muscle_groups, equipment, instructions, difficulty) VALUES
('Bench Press', 'Compound chest exercise', ARRAY['Chest', 'Triceps', 'Shoulders'], ARRAY['Barbell', 'Bench'],
'1. Lie flat on bench with feet on floor
2. Grip barbell slightly wider than shoulder width
3. Lower bar to chest with control
4. Press bar up until arms are extended
5. Repeat for desired reps', 'Intermediate'),

('Squats', 'Compound leg exercise', ARRAY['Quadriceps', 'Glutes', 'Hamstrings'], ARRAY['Barbell', 'Squat Rack'],
'1. Position barbell on upper back
2. Stand with feet shoulder-width apart
3. Lower body by bending knees and hips
4. Descend until thighs are parallel to ground
5. Drive through heels to stand back up', 'Intermediate'),

('Deadlift', 'Full body compound exercise', ARRAY['Back', 'Glutes', 'Hamstrings'], ARRAY['Barbell'],
'1. Stand with feet hip-width apart, bar over mid-foot
2. Bend at hips and knees to grip bar
3. Keep back straight, chest up
4. Drive through heels to lift bar
5. Stand fully upright, then lower with control', 'Advanced'),

('Pull-ups', 'Upper body pulling exercise', ARRAY['Back', 'Biceps'], ARRAY['Pull-up Bar'],
'1. Hang from bar with palms facing away
2. Pull body up until chin is over bar
3. Lower with control to full extension
4. Repeat', 'Intermediate'),

('Push-ups', 'Bodyweight chest exercise', ARRAY['Chest', 'Triceps', 'Shoulders'], ARRAY['None'],
'1. Start in plank position with hands shoulder-width
2. Lower body until chest nearly touches floor
3. Push back up to starting position
4. Keep core engaged throughout', 'Beginner'),

('Dumbbell Rows', 'Back exercise', ARRAY['Back', 'Biceps'], ARRAY['Dumbbells', 'Bench'],
'1. Place one knee and hand on bench
2. Hold dumbbell in opposite hand
3. Pull dumbbell to hip, keeping elbow close
4. Lower with control
5. Complete reps then switch sides', 'Beginner'),

('Overhead Press', 'Shoulder exercise', ARRAY['Shoulders', 'Triceps'], ARRAY['Barbell'],
'1. Hold barbell at shoulder height
2. Press bar overhead until arms are extended
3. Lower with control back to shoulders
4. Keep core tight throughout', 'Intermediate'),

('Lunges', 'Leg exercise', ARRAY['Quadriceps', 'Glutes'], ARRAY['Dumbbells'],
'1. Step forward with one leg
2. Lower hips until both knees are at 90 degrees
3. Push back to starting position
4. Alternate legs', 'Beginner'),

('Plank', 'Core exercise', ARRAY['Core', 'Abs'], ARRAY['None'],
'1. Start in push-up position on forearms
2. Keep body in straight line from head to heels
3. Engage core and hold position
4. Breathe normally', 'Beginner'),

('Bicep Curls', 'Arm exercise', ARRAY['Biceps'], ARRAY['Dumbbells'],
'1. Stand with dumbbells at sides
2. Curl weights up towards shoulders
3. Keep elbows stationary
4. Lower with control
5. Repeat', 'Beginner');

-- Add more exercises as needed
```

### 4. Verify Database

Check that tables were created:

1. In Supabase, go to **Table Editor**
2. You should see: `users`, `exercises`, `workout_plans`, `workout_sessions`, `chat_messages`

---

## Mobile App Setup

### 1. Navigate to Mobile Directory

```bash
cd ../mobile  # If you're in backend directory
# OR
cd mobile  # If you're in root directory
```

### 2. Install Dependencies

```bash
npm install
```

This installs React Native, Expo, and all mobile dependencies.

### 3. Create Environment File

Create `.env` in the `mobile` directory:

```env
# API Configuration
EXPO_PUBLIC_API_URL=http://localhost:3000/api

# Supabase Configuration
EXPO_PUBLIC_SUPABASE_URL=your_supabase_project_url
EXPO_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

**Get Supabase Anon Key:**

1. Supabase Dashboard → **Settings** → **API**
2. Copy `anon public` key → `EXPO_PUBLIC_SUPABASE_ANON_KEY`

### 4. Install iOS Dependencies (macOS only)

```bash
cd ios
pod install
cd ..
```

---

## Running the Application

### Terminal Setup

Open **two terminal windows/tabs**:

**Terminal 1 - Backend Server**
**Terminal 2 - Mobile App**

### Start Backend Server

**Terminal 1:**

```bash
cd backend
npm run dev
```

You should see:

```
🚀 Server running on http://localhost:3000
✅ Database connected
```

The server will auto-reload on code changes.

### Start Mobile App

**Terminal 2:**

```bash
cd mobile
npx expo start
```

You should see:

```
› Metro waiting on exp://192.168.x.x:19000
› Scan the QR code above with Expo Go (Android) or the Camera app (iOS)

› Press a │ open Android
› Press i │ open iOS simulator
› Press w │ open web

› Press r │ reload app
› Press m │ toggle menu
```

### Run on iOS Simulator (macOS)

**In Terminal 2:**

- Press `i` to open iOS Simulator

Or manually:

```bash
npx expo start --ios
```

### Run on Android Emulator

**In Terminal 2:**

- Press `a` to open Android Emulator

Or manually:

```bash
npx expo start --android
```

### Run on Physical Device

1. Install **Expo Go** app:
   - iOS: [App Store](https://apps.apple.com/app/expo-go/id982107779)
   - Android: [Play Store](https://play.google.com/store/apps/details?id=host.exp.exponent)

2. Scan QR code from terminal with:
   - iOS: Camera app
   - Android: Expo Go app

**Note:** Ensure your phone and computer are on the same WiFi network.

---

## Verify Installation

### Test Backend API

```bash
# Health check
curl http://localhost:3000/api/health

# Expected response:
# {"status":"healthy","timestamp":"2024-11-05T10:00:00Z"}
```

### Test Mobile App

1. Launch app on simulator/device
2. You should see the **Splash Screen**
3. Navigate to **Login Screen**
4. Try creating an account:
   - Email: `test@example.com`
   - Password: `Test123!`

If successful, you'll be redirected to the **Onboarding** flow.

---

## Troubleshooting

### Common Issues

#### Backend won't start

**Error:** `Port 3000 already in use`

**Solution:**

```bash
# Windows
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# macOS/Linux
lsof -ti:3000 | xargs kill -9
```

**Error:** `Cannot connect to Supabase`

**Solution:**

- Verify `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` in `.env`
- Check internet connection
- Ensure Supabase project is active

#### Mobile app issues

**Error:** `Unable to resolve module`

**Solution:**

```bash
# Clear cache
npx expo start --clear

# Reset node modules
rm -rf node_modules
npm install
```

**Error:** `Network request failed`

**Solution:**

- Check `EXPO_PUBLIC_API_URL` in `.env`
- For physical devices, replace `localhost` with your computer's IP:
  ```env
  EXPO_PUBLIC_API_URL=http://192.168.1.XXX:3000/api
  ```
- Ensure backend server is running
- Check firewall settings

**iOS Simulator not opening**

**Solution:**

```bash
# Verify Xcode installation
xcode-select --install

# Open Simulator manually
open -a Simulator
```

**Android Emulator issues**

**Solution:**

1. Open Android Studio
2. Tools → AVD Manager
3. Ensure you have an emulator created
4. Start emulator manually

#### Database issues

**Error:** `relation "users" does not exist`

**Solution:**

- Run all migration scripts in Supabase SQL Editor
- Check that tables were created in Table Editor

**Error:** `permission denied for table users`

**Solution:**

- Verify RLS policies were created
- Check that `SUPABASE_SERVICE_ROLE_KEY` is correct (not anon key)

---

## Development Tools

### Recommended VS Code Extensions

- **ESLint** - Code linting
- **Prettier** - Code formatting
- **React Native Tools** - React Native debugging
- **TypeScript Vue Plugin (Volar)** - TypeScript support
- **Thunder Client** - API testing (Postman alternative)

### Database Management

**Supabase Studio (Web):**

- Access at your Supabase project dashboard
- Table Editor for viewing data
- SQL Editor for running queries

**Alternative (Local):**

```bash
# Install Supabase CLI
npm install -g supabase

# Start local Supabase
supabase start
```

### API Testing

**Using Thunder Client (VS Code):**

1. Install Thunder Client extension
2. Create new request
3. Set URL: `http://localhost:3000/api/auth/register`
4. Method: POST
5. Body:
   ```json
   {
     "email": "test@example.com",
     "password": "Test123!"
   }
   ```

**Using cURL:**

```bash
# Register user
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"Test123!"}'

# Login
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"Test123!"}'
```

---

## Scripts Reference

### Backend Scripts

```bash
npm run dev          # Start development server with auto-reload
npm run build        # Compile TypeScript to JavaScript
npm start            # Start production server
npm test             # Run tests
npm run lint         # Run ESLint
npm run format       # Format code with Prettier
```

### Mobile Scripts

```bash
npm start            # Start Expo development server
npm run android      # Open Android emulator
npm run ios          # Open iOS simulator
npm run web          # Open in browser
npm test             # Run tests
npm run lint         # Run ESLint
npm run format       # Format code
```

---

## Environment-Specific Setup

### Development

- Use `NODE_ENV=development`
- Debug logging enabled
- Hot reload enabled

### Production

- Use `NODE_ENV=production`
- Minified builds
- Error logging only
- HTTPS required

---

## Next Steps

After successful setup:

1. **Explore the App**
   - Complete onboarding flow
   - Generate a workout
   - Try the AI chat

2. **Read Documentation**
   - [Frontend Specification](./front-end-spec.md)
   - [Architecture Document](./architecture.md)
   - [API Documentation](./API.md)

3. **Start Development**
   - Modify components in `mobile/src/components/`
   - Add new API endpoints in `backend/src/routes/`
   - Update database schema in migrations

---

## Additional Resources

- [React Native Docs](https://reactnative.dev/docs/getting-started)
- [Expo Documentation](https://docs.expo.dev/)
- [Supabase Docs](https://supabase.com/docs)
- [Google Gemini API](https://ai.google.dev/docs)
- [LangChain Docs](https://js.langchain.com/docs/)

---

## Getting Help

If you encounter issues:

1. Check the [Troubleshooting](#troubleshooting) section
2. Search existing [GitHub Issues](https://github.com/AvishkaGihan/fitforge/issues)
3. Create a new issue with:
   - Error message
   - Steps to reproduce
   - Environment details (OS, Node version, etc.)

---

## Success Checklist

- [ ] Node.js 22+ installed
- [ ] Expo CLI installed
- [ ] Repository cloned
- [ ] Backend dependencies installed
- [ ] Mobile dependencies installed
- [ ] Environment files created and configured
- [ ] Supabase project created
- [ ] Database migrations run
- [ ] Seed data inserted
- [ ] Backend server running
- [ ] Mobile app running
- [ ] Can register new user
- [ ] Can generate workout
- [ ] Can send chat messages

**Congratulations! You're ready to develop with FitForge! 🎉**
