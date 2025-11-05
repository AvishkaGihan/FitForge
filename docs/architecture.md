# Architecture Document - FitForge

## System Overview

FitForge is a full-stack AI-powered fitness application built with a modern microservices-inspired architecture. The system consists of a React Native mobile frontend, Node.js/Express backend API, PostgreSQL database, and integrations with third-party AI services.

## Architecture Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                    Mobile Application                        │
│                   (React Native + Expo)                      │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐   │
│  │  Auth    │  │ Workout  │  │   Chat   │  │ Profile  │   │
│  │  Screens │  │ Screens  │  │  Screen  │  │  Screen  │   │
│  └────┬─────┘  └────┬─────┘  └────┬─────┘  └────┬─────┘   │
│       │             │               │              │         │
│  ┌────┴─────────────┴───────────────┴──────────────┴─────┐ │
│  │              Context API + Custom Hooks                │ │
│  │        (AuthContext, ThemeContext, useWorkout)         │ │
│  └────────────────────────┬────────────────────────────────┘ │
│                           │                                  │
│  ┌────────────────────────┴────────────────────────────────┐ │
│  │                   API Service Layer                      │ │
│  │              (Axios HTTP Client)                         │ │
│  └────────────────────────┬────────────────────────────────┘ │
└─────────────────────────┬─┴──────────────────────────────────┘
                          │
                    HTTPS/REST API
                          │
┌─────────────────────────┴──────────────────────────────────┐
│                   Backend API Server                        │
│                 (Node.js + Express 5)                       │
│  ┌──────────────────────────────────────────────────────┐  │
│  │                 Routes Layer                          │  │
│  │  /auth  /workouts  /chat  /exercises  /user          │  │
│  └────────────┬───────────────────────────────────────────┘  │
│               │                                              │
│  ┌────────────┴──────────────────────────────────────────┐  │
│  │              Middleware Layer                          │  │
│  │  • Authentication (JWT)                                │  │
│  │  • Request Validation (Zod)                            │  │
│  │  • Error Handling                                      │  │
│  │  • Request Logging (Winston)                           │  │
│  └────────────┬──────────────────────────────────────────┘  │
│               │                                              │
│  ┌────────────┴──────────────────────────────────────────┐  │
│  │              Controllers Layer                         │  │
│  │  AuthController  WorkoutController  ChatController     │  │
│  └────────────┬──────────────────────────────────────────┘  │
│               │                                              │
│  ┌────────────┴──────────────────────────────────────────┐  │
│  │              Services Layer                            │  │
│  │  • Database Service (Supabase Client)                  │  │
│  │  • Workout Generator Service (LangChain + Gemini)      │  │
│  │  • Chat Service (LangChain + Gemini)                   │  │
│  │  • Pinecone Service (Vector Search - Optional)         │  │
│  └────────────┬──────────────────────────────────────────┘  │
└─────────────┬─┴──────────────────────────────────────────────┘
              │
    ┌─────────┴──────────┬──────────────┬────────────────┐
    │                    │              │                │
┌───┴────┐     ┌─────────┴────┐   ┌────┴─────┐   ┌─────┴──────┐
│Supabase│     │Google Gemini │   │Pinecone  │   │  Winston   │
│  DB    │     │     API      │   │ (Vector  │   │   Logs     │
│(Postgres)│   │    (LLM)     │   │  Store)  │   │            │
└────────┘     └──────────────┘   └──────────┘   └────────────┘
```

## System Components

### 1. Mobile Application (Frontend)

**Technology:** React Native 0.81 + Expo SDK 54

**Architecture Pattern:** Component-Based + Context API

**Layers:**

1. **Presentation Layer** - React components and screens
2. **State Management** - Context API providers
3. **Business Logic** - Custom hooks
4. **Data Access** - API service layer
5. **Storage** - AsyncStorage + SecureStore

**Key Responsibilities:**

- User interface rendering
- User input handling
- Local state management
- API communication
- Data caching
- Authentication flow
- Biometric authentication

### 2. Backend API Server

**Technology:** Node.js 22 + Express 5 + TypeScript

**Architecture Pattern:** Layered Architecture (MVC-inspired)

**Layers:**

#### a) Routes Layer

- HTTP endpoint definitions
- Request routing
- Middleware attachment

```typescript
// Example: workout.routes.ts
router.post("/generate", authenticate, workoutController.generateWorkout);
router.get("/latest", authenticate, workoutController.getLatestWorkout);
```

#### b) Middleware Layer

- **Authentication** - JWT token verification
- **Validation** - Request schema validation with Zod
- **Error Handling** - Centralized error processing
- **Logging** - Request/response logging

```typescript
// authenticate middleware
export async function authenticate(req, res, next) {
  const token = req.headers.authorization?.replace("Bearer ", "");
  const decoded = jwt.verify(token, JWT_SECRET);
  req.user = decoded;
  next();
}
```

#### c) Controllers Layer

- Request/response handling
- Input validation
- Service orchestration
- Response formatting

```typescript
// WorkoutController
class WorkoutController {
  async generateWorkout(req, res) {
    const user = req.user;
    const workout = await workoutGeneratorService.generate(user);
    res.json(workout);
  }
}
```

#### d) Services Layer

- Business logic implementation
- External API integration
- Data transformation
- Database operations

**Key Services:**

- `database.ts` - Supabase client wrapper
- `workout-generator.service.ts` - AI workout generation
- `chat.service.ts` - AI chat functionality
- `pinecone.service.ts` - Vector search (optional)

### 3. Database Layer

**Technology:** PostgreSQL (via Supabase)

**Schema Design:**

```sql
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
```

### 4. External Services Integration

#### a) Google Gemini API (LLM)

**Purpose:** AI-powered workout generation and chat

**Integration:** LangChain framework

**Usage:**

```typescript
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";

const model = new ChatGoogleGenerativeAI({
  modelName: "gemini-pro",
  apiKey: process.env.GOOGLE_GEMINI_API_KEY,
});
```

**Responsibilities:**

- Generate personalized workout plans
- Answer fitness-related questions
- Provide exercise form tips
- Motivational coaching

#### b) Supabase

**Purpose:** Backend-as-a-Service

**Features Used:**

- PostgreSQL database
- Authentication (JWT)
- Row-level security
- Real-time subscriptions (optional)

#### c) Pinecone (Optional)

**Purpose:** Vector database for semantic search

**Use Cases:**

- Exercise similarity search
- Contextual chat responses
- Workout recommendations

## Design Patterns

### 1. Repository Pattern

Abstraction layer between business logic and data access.

```typescript
class WorkoutRepository {
  async create(workout: WorkoutPlan): Promise<WorkoutPlan> {
    const { data } = await supabase
      .from("workout_plans")
      .insert(workout)
      .single();
    return data;
  }

  async findByUserId(userId: string): Promise<WorkoutPlan[]> {
    const { data } = await supabase
      .from("workout_plans")
      .select("*")
      .eq("user_id", userId);
    return data;
  }
}
```

### 2. Factory Pattern

Create objects without specifying exact classes.

```typescript
class WorkoutFactory {
  static createWorkout(userPreferences: UserPreferences): WorkoutPlan {
    const exercises = this.selectExercises(userPreferences);
    const difficulty = userPreferences.fitness_level;

    return {
      name: this.generateName(userPreferences.fitness_goal),
      exercises,
      difficulty,
      estimated_duration: this.calculateDuration(exercises),
    };
  }
}
```

### 3. Middleware Pattern

Chain of responsibility for request processing.

```typescript
app.use(requestLogger);
app.use(authenticate);
app.use(validateRequest);
app.use(errorHandler);
```

### 4. Provider Pattern (Frontend)

Share data across component tree without prop drilling.

```typescript
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  return (
    <AuthContext.Provider value={{ user, isAuthenticated }}>
      {children}
    </AuthContext.Provider>
  );
}
```

### 5. Custom Hook Pattern

Extract reusable component logic.

```typescript
export function useWorkout() {
  const [workout, setWorkout] = useState(null);
  const [loading, setLoading] = useState(false);

  async function generateWorkout() {
    setLoading(true);
    const data = await api.generateWorkout();
    setWorkout(data);
    setLoading(false);
  }

  return { workout, loading, generateWorkout };
}
```

## Data Flow

### Authentication Flow

```
1. User enters credentials → LoginScreen
2. API call → POST /api/auth/login
3. Backend validates → AuthController.login()
4. Supabase verifies → Database query
5. JWT token generated → Response
6. Token stored → SecureStore
7. User context updated → AuthContext
8. Navigate to Main app → Navigation
```

### Workout Generation Flow

```
1. User requests workout → DashboardScreen
2. API call with user preferences → POST /api/workouts/generate
3. Backend receives → WorkoutController.generateWorkout()
4. Fetch user profile → Database query
5. Build prompt with preferences → WorkoutGeneratorService
6. Call Gemini API → LangChain + Google Gemini
7. Parse AI response → JSON extraction
8. Save to database → WorkoutPlan created
9. Return workout → Response
10. Display in UI → WorkoutCard component
```

### Chat Flow

```
1. User sends message → ChatScreen
2. Add to local state → Optimistic update
3. API call → POST /api/chat/message
4. Backend receives → ChatController.sendMessage()
5. Build conversation context → Recent messages
6. Call Gemini API → LangChain chat
7. Stream response → Server-sent events (optional)
8. Save messages → Database
9. Return AI response → Response
10. Display in UI → Chat bubble
```

## Security Architecture

### Authentication & Authorization

**JWT-based Authentication:**

```typescript
// Token structure
{
  userId: string,
  email: string,
  iat: number,
  exp: number
}
```

**Security Measures:**

- Passwords hashed with bcrypt (10 rounds)
- JWT tokens with expiration (7 days)
- Secure token storage (SecureStore)
- HTTPS only in production
- Rate limiting on auth endpoints
- Input validation with Zod

### Database Security

**Row-Level Security (RLS):**

```sql
-- Users can only read their own data
CREATE POLICY user_select_policy ON users
  FOR SELECT USING (auth.uid() = id);

-- Users can only update their own profile
CREATE POLICY user_update_policy ON users
  FOR UPDATE USING (auth.uid() = id);
```

**SQL Injection Prevention:**

- Parameterized queries
- ORM/Query builder (Supabase client)
- Input sanitization

### API Security

- CORS configuration for allowed origins
- Request size limits
- Helmet.js for HTTP headers
- Environment variable protection
- API key rotation strategy

## Scalability Considerations

### Current Architecture (MVP)

- Single backend instance
- Supabase managed database
- Stateless API design

### Future Scaling Options

**Horizontal Scaling:**

- Multiple backend instances behind load balancer
- Redis for session storage
- Database read replicas

**Caching Strategy:**

- Redis for frequently accessed data
- CDN for static assets
- Client-side caching with AsyncStorage

**Database Optimization:**

- Indexing on frequently queried fields
- Query optimization
- Connection pooling
- Database sharding (if needed)

**Microservices Migration:**

- Separate workout service
- Dedicated chat service
- Independent scaling per service

## Error Handling

### Backend Error Handling

```typescript
class AppError extends Error {
  constructor(
    public statusCode: number,
    public message: string,
    public isOperational = true
  ) {
    super(message);
  }
}

// Global error handler middleware
function errorHandler(err, req, res, next) {
  const statusCode = err.statusCode || 500;
  const message = err.isOperational ? err.message : "Internal server error";

  logger.error(err);

  res.status(statusCode).json({
    status: "error",
    message,
  });
}
```

### Frontend Error Handling

```typescript
try {
  await api.generateWorkout();
} catch (error) {
  if (error.response?.status === 401) {
    // Unauthorized - redirect to login
    logout();
  } else if (error.response?.status === 429) {
    // Rate limited
    showError("Too many requests. Please try again later.");
  } else {
    // Generic error
    showError("Something went wrong. Please try again.");
  }
}
```

## Logging & Monitoring

### Backend Logging

```typescript
import winston from "winston";

const logger = winston.createLogger({
  level: "info",
  format: winston.format.json(),
  transports: [
    new winston.transports.File({ filename: "error.log", level: "error" }),
    new winston.transports.File({ filename: "combined.log" }),
  ],
});
```

**Logged Events:**

- API requests/responses
- Authentication attempts
- Errors and exceptions
- AI API calls
- Database queries (slow queries)

### Mobile Logging

- Console logs (development)
- Error tracking service (production - Sentry recommended)
- Analytics events (user actions)

## Performance Optimization

### Backend

- Async/await for non-blocking operations
- Database query optimization
- Response compression (gzip)
- API response caching
- Connection pooling

### Frontend

- Component memoization (React.memo)
- Lazy loading screens
- Image optimization
- Virtual lists (FlatList)
- Debouncing user inputs
- Optimistic UI updates

## Testing Strategy

### Backend Tests

```typescript
// Unit tests - Services
describe("WorkoutGeneratorService", () => {
  it("should generate workout based on user preferences", async () => {
    const workout = await service.generate(mockUser);
    expect(workout.exercises.length).toBeGreaterThan(0);
  });
});

// Integration tests - API endpoints
describe("POST /api/workouts/generate", () => {
  it("should return 401 without auth token", async () => {
    const res = await request(app).post("/api/workouts/generate");
    expect(res.status).toBe(401);
  });
});
```

### Frontend Tests

```typescript
// Component tests
describe('Button', () => {
  it('should call onPress when clicked', () => {
    const onPress = jest.fn();
    const { getByText } = render(<Button title="Click" onPress={onPress} />);
    fireEvent.press(getByText('Click'));
    expect(onPress).toHaveBeenCalled();
  });
});

// Hook tests
describe('useAuth', () => {
  it('should login successfully', async () => {
    const { result } = renderHook(() => useAuth());
    await act(() => result.current.login('test@example.com', 'password'));
    expect(result.current.isAuthenticated).toBe(true);
  });
});
```

## Deployment Architecture

### Backend Deployment

**Platform:** Vercel (serverless)

**Configuration:**

```json
{
  "version": 2,
  "builds": [{ "src": "src/index.ts", "use": "@vercel/node" }],
  "routes": [{ "src": "/(.*)", "dest": "src/index.ts" }]
}
```

### Mobile Deployment

**Platform:** EAS Build (Expo)

**Build Profiles:**

- Development - Internal testing
- Preview - TestFlight/Internal testing
- Production - App Store/Play Store

### Environment Management

- Development - Local .env files
- Staging - Staging environment variables
- Production - Encrypted secrets in CI/CD

## Technology Decisions

### Why React Native + Expo?

- Cross-platform development (iOS + Android)
- Fast development cycle
- Rich ecosystem
- OTA updates capability
- Managed workflow

### Why Node.js + Express?

- JavaScript full-stack
- Large ecosystem
- Excellent async performance
- Easy scaling
- TypeScript support

### Why PostgreSQL?

- Relational data model
- ACID compliance
- JSON support (JSONB)
- Full-text search
- Mature and reliable

### Why Google Gemini?

- Free tier available
- Good performance
- Multi-modal capabilities
- Easy integration with LangChain

## Future Architecture Enhancements

1. **GraphQL API** - More efficient data fetching
2. **WebSocket Support** - Real-time features
3. **Microservices** - Service separation
4. **Event-Driven Architecture** - Async processing
5. **Caching Layer** - Redis integration
6. **CDN Integration** - Static asset delivery
7. **API Gateway** - Rate limiting, analytics
8. **Container Orchestration** - Kubernetes for scaling
