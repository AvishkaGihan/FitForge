# API Documentation - FitForge Backend

## Base URL

- **Development:** `http://localhost:3000/api`
- **Production:** `https://your-domain.vercel.app/api`

## Authentication

Most endpoints require authentication using JWT tokens in the Authorization header:

```http
Authorization: Bearer <your_jwt_token>
```

## Response Format

### Success Response

```json
{
  "status": "success",
  "data": { ... }
}
```

### Error Response

```json
{
  "status": "error",
  "message": "Error description",
  "code": "ERROR_CODE"
}
```

## HTTP Status Codes

- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `429` - Too Many Requests
- `500` - Internal Server Error

---

## Authentication Endpoints

### Register User

Create a new user account.

**Endpoint:** `POST /api/auth/register`

**Authentication:** Not required

**Request Body:**

```json
{
  "email": "user@example.com",
  "password": "SecurePassword123!"
}
```

**Validation:**

- Email must be valid format
- Password minimum 8 characters
- Password must contain uppercase, lowercase, number

**Success Response:** `201 Created`

```json
{
  "status": "success",
  "data": {
    "user": {
      "id": "uuid",
      "email": "user@example.com",
      "created_at": "2024-11-05T10:00:00Z"
    },
    "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "expires_at": 1699200000
  }
}
```

**Error Responses:**

- `400` - Invalid email or password format
- `409` - Email already exists

---

### Login User

Authenticate existing user.

**Endpoint:** `POST /api/auth/login`

**Authentication:** Not required

**Request Body:**

```json
{
  "email": "user@example.com",
  "password": "SecurePassword123!"
}
```

**Success Response:** `200 OK`

```json
{
  "status": "success",
  "data": {
    "user": {
      "id": "uuid",
      "email": "user@example.com",
      "fitness_goal": "Build Muscle",
      "fitness_level": "Intermediate"
    },
    "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "expires_at": 1699200000
  }
}
```

**Error Responses:**

- `400` - Missing email or password
- `401` - Invalid credentials

---

### Logout User

Invalidate current session.

**Endpoint:** `POST /api/auth/logout`

**Authentication:** Required

**Request Body:** None

**Success Response:** `200 OK`

```json
{
  "status": "success",
  "message": "Logged out successfully"
}
```

---

### Get Current User

Get authenticated user's profile.

**Endpoint:** `GET /api/auth/me`

**Authentication:** Required

**Success Response:** `200 OK`

```json
{
  "status": "success",
  "data": {
    "id": "uuid",
    "email": "user@example.com",
    "fitness_goal": "Build Muscle",
    "fitness_level": "Intermediate",
    "equipment": ["Dumbbells", "Barbell", "Bench"],
    "time_per_workout": 60,
    "days_per_week": 4,
    "restrictions": "Lower back pain",
    "avoided_exercises": ["Deadlifts"],
    "preferred_exercises": ["Bench Press", "Squats"],
    "created_at": "2024-11-05T10:00:00Z",
    "updated_at": "2024-11-05T10:00:00Z"
  }
}
```

**Error Responses:**

- `401` - Invalid or expired token

---

## User Endpoints

### Update User Preferences

Update user's fitness preferences.

**Endpoint:** `PUT /api/user/preferences`

**Authentication:** Required

**Request Body:**

```json
{
  "fitness_goal": "Build Muscle",
  "fitness_level": "Intermediate",
  "equipment": ["Dumbbells", "Barbell", "Bench"],
  "time_per_workout": 60,
  "days_per_week": 4,
  "restrictions": "Lower back pain",
  "avoided_exercises": ["Deadlifts"],
  "preferred_exercises": ["Bench Press", "Squats"]
}
```

**Field Options:**

**fitness_goal:**

- `Lose Weight`
- `Build Muscle`
- `Improve Endurance`
- `General Fitness`
- `Increase Flexibility`
- `Sport Performance`

**fitness_level:**

- `Beginner`
- `Intermediate`
- `Advanced`

**equipment:** Array of strings (e.g., "Dumbbells", "Barbell", "Resistance Bands", "None")

**time_per_workout:** Integer (minutes, 15-120)

**days_per_week:** Integer (1-7)

**Success Response:** `200 OK`

```json
{
  "status": "success",
  "data": {
    "id": "uuid",
    "email": "user@example.com",
    "fitness_goal": "Build Muscle",
    "fitness_level": "Intermediate"
    // ... updated fields
  }
}
```

**Error Responses:**

- `400` - Invalid preferences format
- `401` - Unauthorized

---

### Get User Statistics

Get user's workout statistics.

**Endpoint:** `GET /api/user/stats`

**Authentication:** Required

**Success Response:** `200 OK`

```json
{
  "status": "success",
  "data": {
    "total_workouts": 45,
    "current_streak": 7,
    "longest_streak": 21,
    "workouts_this_week": 3,
    "total_duration": 2700,
    "favorite_exercises": [
      { "name": "Bench Press", "count": 15 },
      { "name": "Squats", "count": 14 }
    ]
  }
}
```

---

## Workout Endpoints

### Generate Workout

Generate a personalized workout plan using AI.

**Endpoint:** `POST /api/workouts/generate`

**Authentication:** Required

**Request Body:** None (uses user preferences from profile)

**Success Response:** `201 Created`

```json
{
  "status": "success",
  "data": {
    "id": "uuid",
    "user_id": "uuid",
    "name": "Upper Body Power",
    "difficulty": "Intermediate",
    "estimated_duration": 60,
    "exercises": [
      {
        "name": "Bench Press",
        "sets": 4,
        "reps": "8-10",
        "rest": 90,
        "notes": "Focus on controlled movement"
      },
      {
        "name": "Bent-Over Rows",
        "sets": 4,
        "reps": "8-10",
        "rest": 90,
        "notes": "Keep back straight"
      },
      {
        "name": "Overhead Press",
        "sets": 3,
        "reps": "10-12",
        "rest": 60,
        "notes": "Engage core throughout"
      },
      {
        "name": "Pull-ups",
        "sets": 3,
        "reps": "max",
        "rest": 90,
        "notes": "Use assisted machine if needed"
      }
    ],
    "created_at": "2024-11-05T10:00:00Z"
  }
}
```

**Error Responses:**

- `400` - User preferences incomplete
- `401` - Unauthorized
- `500` - AI generation failed

---

### Get User Workouts

Get all workout plans for authenticated user.

**Endpoint:** `GET /api/workouts`

**Authentication:** Required

**Query Parameters:**

- `limit` (optional) - Number of workouts to return (default: 20)
- `offset` (optional) - Pagination offset (default: 0)
- `sort` (optional) - Sort order: `newest` | `oldest` (default: newest)

**Example:** `GET /api/workouts?limit=10&offset=0&sort=newest`

**Success Response:** `200 OK`

```json
{
  "status": "success",
  "data": {
    "workouts": [
      {
        "id": "uuid",
        "name": "Upper Body Power",
        "difficulty": "Intermediate",
        "estimated_duration": 60,
        "exercises": [...],
        "created_at": "2024-11-05T10:00:00Z"
      }
    ],
    "total": 45,
    "limit": 10,
    "offset": 0
  }
}
```

---

### Get Latest Workout

Get the most recently generated workout.

**Endpoint:** `GET /api/workouts/latest`

**Authentication:** Required

**Success Response:** `200 OK`

```json
{
  "status": "success",
  "data": {
    "id": "uuid",
    "name": "Upper Body Power",
    "difficulty": "Intermediate",
    "estimated_duration": 60,
    "exercises": [...],
    "created_at": "2024-11-05T10:00:00Z"
  }
}
```

**Error Responses:**

- `404` - No workouts found

---

### Get Workout by ID

Get specific workout plan details.

**Endpoint:** `GET /api/workouts/:id`

**Authentication:** Required

**URL Parameters:**

- `id` - Workout plan UUID

**Success Response:** `200 OK`

```json
{
  "status": "success",
  "data": {
    "id": "uuid",
    "name": "Upper Body Power",
    "difficulty": "Intermediate",
    "estimated_duration": 60,
    "exercises": [...],
    "created_at": "2024-11-05T10:00:00Z"
  }
}
```

**Error Responses:**

- `404` - Workout not found
- `403` - Workout belongs to another user

---

### Complete Workout

Mark a workout session as completed.

**Endpoint:** `POST /api/workouts/:id/complete`

**Authentication:** Required

**URL Parameters:**

- `id` - Workout plan UUID

**Request Body:**

```json
{
  "duration": 3600,
  "feedback": "Great workout! Felt strong today.",
  "completed_exercises": 8
}
```

**Success Response:** `201 Created`

```json
{
  "status": "success",
  "data": {
    "session_id": "uuid",
    "workout_plan_id": "uuid",
    "started_at": "2024-11-05T10:00:00Z",
    "completed_at": "2024-11-05T11:00:00Z",
    "total_duration": 3600,
    "status": "Completed",
    "feedback": "Great workout! Felt strong today."
  }
}
```

---

## Exercise Endpoints

### Get All Exercises

Get exercise library.

**Endpoint:** `GET /api/exercises`

**Authentication:** Required

**Query Parameters:**

- `search` (optional) - Search by name
- `muscle_group` (optional) - Filter by muscle group
- `equipment` (optional) - Filter by equipment
- `difficulty` (optional) - Filter by difficulty level

**Example:** `GET /api/exercises?muscle_group=Chest&difficulty=Intermediate`

**Success Response:** `200 OK`

```json
{
  "status": "success",
  "data": {
    "exercises": [
      {
        "id": "uuid",
        "name": "Bench Press",
        "description": "Compound chest exercise",
        "muscle_groups": ["Chest", "Triceps", "Shoulders"],
        "equipment": ["Barbell", "Bench"],
        "instructions": "1. Lie on bench...\n2. Grip barbell...\n3. Lower to chest...\n4. Press up...",
        "difficulty": "Intermediate",
        "video_url": "https://example.com/bench-press.mp4",
        "thumbnail_url": "https://example.com/bench-press.jpg",
        "created_at": "2024-11-05T10:00:00Z"
      }
    ],
    "total": 52
  }
}
```

---

### Get Exercise by ID

Get detailed exercise information.

**Endpoint:** `GET /api/exercises/:id`

**Authentication:** Required

**URL Parameters:**

- `id` - Exercise UUID

**Success Response:** `200 OK`

```json
{
  "status": "success",
  "data": {
    "id": "uuid",
    "name": "Bench Press",
    "description": "Compound chest exercise",
    "muscle_groups": ["Chest", "Triceps", "Shoulders"],
    "equipment": ["Barbell", "Bench"],
    "instructions": "1. Lie on bench...\n2. Grip barbell...",
    "difficulty": "Intermediate",
    "video_url": "https://example.com/bench-press.mp4",
    "thumbnail_url": "https://example.com/bench-press.jpg"
  }
}
```

---

### Search Exercises

Search exercises by name or description.

**Endpoint:** `GET /api/exercises/search`

**Authentication:** Required

**Query Parameters:**

- `q` (required) - Search query

**Example:** `GET /api/exercises/search?q=chest`

**Success Response:** `200 OK`

```json
{
  "status": "success",
  "data": {
    "results": [
      {
        "id": "uuid",
        "name": "Bench Press",
        "muscle_groups": ["Chest", "Triceps"],
        "difficulty": "Intermediate"
      },
      {
        "id": "uuid",
        "name": "Chest Fly",
        "muscle_groups": ["Chest"],
        "difficulty": "Beginner"
      }
    ],
    "count": 12
  }
}
```

---

## Chat Endpoints

### Send Message

Send message to AI fitness coach.

**Endpoint:** `POST /api/chat/message`

**Authentication:** Required

**Request Body:**

```json
{
  "content": "How do I improve my bench press form?"
}
```

**Success Response:** `200 OK`

```json
{
  "status": "success",
  "data": {
    "user_message": {
      "id": "uuid",
      "role": "user",
      "content": "How do I improve my bench press form?",
      "timestamp": "2024-11-05T10:00:00Z"
    },
    "assistant_message": {
      "id": "uuid",
      "role": "assistant",
      "content": "Great question! Here are key tips for proper bench press form:\n\n1. **Setup**: Lie flat with eyes under the bar, feet planted firmly on the ground...",
      "timestamp": "2024-11-05T10:00:02Z"
    }
  }
}
```

**Error Responses:**

- `400` - Empty message
- `429` - Rate limit exceeded

---

### Get Chat History

Get conversation history with AI coach.

**Endpoint:** `GET /api/chat/history`

**Authentication:** Required

**Query Parameters:**

- `limit` (optional) - Number of messages (default: 50)
- `offset` (optional) - Pagination offset (default: 0)

**Success Response:** `200 OK`

```json
{
  "status": "success",
  "data": {
    "messages": [
      {
        "id": "uuid",
        "role": "user",
        "content": "How do I improve my bench press form?",
        "timestamp": "2024-11-05T10:00:00Z"
      },
      {
        "id": "uuid",
        "role": "assistant",
        "content": "Great question! Here are key tips...",
        "timestamp": "2024-11-05T10:00:02Z"
      }
    ],
    "total": 156,
    "limit": 50,
    "offset": 0
  }
}
```

---

### Clear Chat History

Delete all chat messages for user.

**Endpoint:** `DELETE /api/chat/history`

**Authentication:** Required

**Success Response:** `200 OK`

```json
{
  "status": "success",
  "message": "Chat history cleared successfully"
}
```

---

## Health Check

### Server Health

Check API server status.

**Endpoint:** `GET /api/health`

**Authentication:** Not required

**Success Response:** `200 OK`

```json
{
  "status": "healthy",
  "timestamp": "2024-11-05T10:00:00Z",
  "uptime": 86400,
  "version": "1.0.0"
}
```

---

## Rate Limiting

Rate limits are applied per IP address:

- **Authentication endpoints:** 5 requests per minute
- **AI endpoints (workout generation, chat):** 10 requests per minute
- **Other endpoints:** 100 requests per minute

When rate limit is exceeded:

**Response:** `429 Too Many Requests`

```json
{
  "status": "error",
  "message": "Rate limit exceeded. Please try again later.",
  "retry_after": 60
}
```

---

## Error Codes

| Code                        | Description                   |
| --------------------------- | ----------------------------- |
| `AUTH_INVALID_CREDENTIALS`  | Invalid email or password     |
| `AUTH_TOKEN_EXPIRED`        | JWT token has expired         |
| `AUTH_TOKEN_INVALID`        | Invalid JWT token             |
| `USER_NOT_FOUND`            | User does not exist           |
| `USER_ALREADY_EXISTS`       | Email already registered      |
| `VALIDATION_ERROR`          | Request validation failed     |
| `WORKOUT_NOT_FOUND`         | Workout plan not found        |
| `WORKOUT_GENERATION_FAILED` | AI failed to generate workout |
| `EXERCISE_NOT_FOUND`        | Exercise not found            |
| `CHAT_ERROR`                | Chat service error            |
| `RATE_LIMIT_EXCEEDED`       | Too many requests             |
| `INTERNAL_SERVER_ERROR`     | Unexpected server error       |

---

## Webhooks (Future Feature)

_Planned for future implementation_

Webhook notifications for:

- Workout completion
- Streak milestones
- New exercise additions

---

## SDK / Client Libraries

### JavaScript/TypeScript Example

```typescript
import axios from "axios";

class FitForgeAPI {
  private baseURL = "https://your-domain.vercel.app/api";
  private token: string | null = null;

  async login(email: string, password: string) {
    const { data } = await axios.post(`${this.baseURL}/auth/login`, {
      email,
      password,
    });
    this.token = data.data.access_token;
    return data.data;
  }

  async generateWorkout() {
    const { data } = await axios.post(
      `${this.baseURL}/workouts/generate`,
      {},
      {
        headers: { Authorization: `Bearer ${this.token}` },
      }
    );
    return data.data;
  }

  async sendChatMessage(content: string) {
    const { data } = await axios.post(
      `${this.baseURL}/chat/message`,
      { content },
      {
        headers: { Authorization: `Bearer ${this.token}` },
      }
    );
    return data.data;
  }
}

// Usage
const api = new FitForgeAPI();
await api.login("user@example.com", "password");
const workout = await api.generateWorkout();
```

---

## Changelog

### Version 1.0.0 (Current)

- Initial API release
- Authentication endpoints
- Workout generation
- Exercise library
- AI chat assistant
- User statistics

### Planned Features (v1.1.0)

- Social features (friends, sharing)
- Workout templates
- Exercise video uploads
- Advanced analytics
- Webhook support
- GraphQL API

---

## Support

For API issues or questions:

- Email: support@fitforge.com
- Documentation: https://docs.fitforge.com
- GitHub Issues: https://github.com/AvishkaGihan/fitforge/issues
