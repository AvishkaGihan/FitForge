# FitForge Backend

A modern, AI-powered fitness tracking and workout generation API built with TypeScript, Express, and Google Gemini.

## Table of Contents

- [Overview](#overview)
- [Tech Stack](#tech-stack)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Configuration](#configuration)
- [Project Structure](#project-structure)
- [API Routes](#api-routes)
- [Database](#database)
- [Services](#services)
- [Development](#development)
- [Testing](#testing)
- [Deployment](#deployment)
- [Contributing](#contributing)
- [License](#license)

## Overview

FitForge Backend is a comprehensive REST API that powers the FitForge fitness application. It provides:

- **User Authentication**: Secure JWT-based authentication and authorization
- **Workout Generation**: AI-powered workout plans using Google Gemini
- **Exercise Database**: Comprehensive exercise library with descriptions and metrics
- **AI Chat**: Conversational AI for fitness advice and guidance
- **User Profiles**: Profile management and fitness tracking
- **Workout Logging**: Track and analyze completed workouts

## Tech Stack

- **Runtime**: Node.js 22+
- **Language**: TypeScript
- **Framework**: Express.js
- **Database**: PostgreSQL (via Supabase)
- **AI Integration**: Google Gemini API
- **Vector Database**: Pinecone
- **Authentication**: JWT
- **Logging**: Custom logger with file outputs
- **Package Manager**: npm

## Prerequisites

Before you begin, ensure you have:

- Node.js 22 or higher
- npm or yarn
- A Supabase account and project
- Google Gemini API key
- Pinecone API key (optional, for AI features)

## Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/AvishkaGihan/FitForge.git
   cd FitForge/backend
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Set up environment variables**

   ```bash
   cp .env.example .env.local
   # Edit .env.local with your credentials
   ```

4. **Run database migrations**

   ```bash
   npm run db:migrate
   ```

5. **Seed the database (optional)**
   ```bash
   npm run db:seed
   ```

## Configuration

### Environment Variables

Create a `.env.local` file in the backend root directory:

```env
# Server
PORT=3000
NODE_ENV=development

# Database
SUPABASE_URL=your_supabase_url
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
SUPABASE_ANON_KEY=your_anon_key

# Authentication
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRES_IN=7d

# Google Gemini
GOOGLE_GEMINI_API_KEY=your_gemini_api_key

# Pinecone (optional)
PINECONE_API_KEY=your_pinecone_key
PINECONE_ENVIRONMENT=your_environment
PINECONE_INDEX_NAME=fitforge

# Logging
LOG_LEVEL=info
LOG_DIR=./logs
```

## Project Structure

```
src/
├── index.ts                 # Application entry point
├── controllers/             # Route handlers
│   ├── auth.controller.ts
│   ├── chat.controller.ts
│   ├── exercise.controller.ts
│   ├── user.controller.ts
│   └── workout.controller.ts
├── middleware/              # Express middleware
│   ├── auth.ts             # JWT authentication
│   ├── error-handler.ts    # Global error handling
│   ├── request-logger.ts   # Request logging
│   └── validate-request.ts # Input validation
├── routes/                  # API route definitions
│   ├── auth.routes.ts
│   ├── chat.routes.ts
│   ├── exercise.routes.ts
│   ├── user.routes.ts
│   └── workout.routes.ts
├── services/                # Business logic
│   ├── chat.service.ts     # AI chat functionality
│   ├── database.ts         # Database client
│   ├── pinecone.service.ts # Vector search
│   └── workout-generator.service.ts # AI workout generation
├── types/                   # TypeScript interfaces
├── utils/                   # Utility functions
│   ├── constants.ts
│   ├── helpers.ts
│   ├── logger.ts
│   └── validation.ts
└── database/
    ├── migrations/          # SQL migrations
    └── seeds/               # Database seeds
```

## API Routes

### Authentication (`/api/auth`)

- `POST /register` - Register new user
- `POST /login` - User login
- `POST /logout` - User logout
- `POST /refresh` - Refresh JWT token

### Users (`/api/users`)

- `GET /profile` - Get user profile
- `PUT /profile` - Update user profile
- `GET /stats` - Get user fitness statistics

### Workouts (`/api/workouts`)

- `GET /` - List user workouts
- `POST /` - Create new workout
- `GET /:id` - Get workout details
- `PUT /:id` - Update workout
- `DELETE /:id` - Delete workout
- `POST /:id/complete` - Mark workout as complete

### Exercises (`/api/exercises`)

- `GET /` - List all exercises
- `GET /:id` - Get exercise details
- `POST /search` - Search exercises

### Chat (`/api/chat`)

- `POST /message` - Send chat message
- `GET /history` - Get chat history

## Database

### Migrations

Run migrations with:

```bash
npm run db:migrate
```

### Seeds

Populate the database with sample data:

```bash
npm run db:seed
```

### Database Schema

The database includes tables for:

- `users` - User accounts and profiles
- `exercises` - Exercise library
- `workouts` - Workout routines
- `workout_exercises` - Workout composition
- `user_workouts` - User workout history
- `chat_messages` - Chat conversation history

See [DEPLOYMENT.md](./DEPLOYMENT.md) for database setup instructions.

## Services

### Database Service (`database.ts`)

Manages Supabase client and database operations.

### Chat Service (`chat.service.ts`)

Handles AI-powered chat conversations using Google Gemini.

### Workout Generator Service (`workout-generator.service.ts`)

Generates personalized workout plans using AI.

### Pinecone Service (`pinecone.service.ts`)

Manages vector embeddings and semantic search for exercises.

## Development

### Start Development Server

```bash
npm run dev
```

The server runs on `http://localhost:3000` by default.

### Build for Production

```bash
npm run build
```

### Run Tests

```bash
npm run test
```

### Linting

```bash
npm run lint
npm run lint:fix
```

### Type Checking

```bash
npm run type-check
```

## Testing

Tests are organized by feature:

```bash
# Run all tests
npm run test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage
```

## Deployment

For detailed deployment instructions, see [DEPLOYMENT.md](./DEPLOYMENT.md).

Quick deployment options:

- **Vercel** (Recommended) - Serverless deployment
- **Docker** - Containerized deployment
- **Traditional VPS** - Self-hosted deployment

### Health Check

```bash
curl http://localhost:3000/api/health
```

## API Documentation

API documentation is generated from the codebase. To generate:

```bash
npm run generate-api-docs
```

## Error Handling

The API uses standard HTTP status codes:

- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `500` - Internal Server Error

## Logging

Logs are stored in the `logs/` directory:

- `error.log` - Error logs
- `combined.log` - All logs
- Console output for development

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For issues, questions, or suggestions, please open an issue on GitHub.

---

**Built with ❤️ by the FitForge team**
