# Frontend Specification - FitForge Mobile App

## Overview

FitForge mobile app is built using **React Native 0.81** with **Expo SDK 54**, providing a cross-platform fitness application for iOS and Android. The app features a premium dark-themed UI with smooth 60fps animations and comprehensive offline support.

## Technology Stack

### Core Framework

- **React Native 0.81** - Mobile framework
- **Expo SDK 54** - Development platform
- **TypeScript 5.9** - Type safety
- **React 19.1** - UI library

### Navigation

- **React Navigation 7** - Routing and navigation
- **@react-navigation/native-stack** - Stack navigator
- **@react-navigation/bottom-tabs** - Tab bar navigation

### UI & Styling

- **React Native Paper 5.14** - Material Design components
- **React Native Vector Icons 10.3** - Icon library
- **Expo Linear Gradient** - Gradient backgrounds
- **Custom Theme System** - Dark mode with accent colors

### Animations

- **React Native Reanimated 4.1** - 60fps animations
- **React Native Gesture Handler 2.28** - Touch interactions
- **React Native Worklets 0.5** - JavaScript on UI thread

### State Management

- **React Context API** - Global state
- **Custom Hooks** - Reusable logic
- **Local State** - Component-level state

### Data & Storage

- **Axios 1.13** - HTTP client
- **AsyncStorage 2.2** - Persistent storage
- **Expo Secure Store** - Encrypted storage

### Authentication

- **Expo Local Authentication** - Biometric auth (Face ID/Touch ID)
- **JWT Tokens** - Session management
- **Secure credential storage**

## Project Structure

```
mobile/
├── src/
│   ├── components/          # Reusable UI components
│   │   ├── Avatar.tsx
│   │   ├── Badge.tsx
│   │   ├── BottomSheet.tsx
│   │   ├── Button.tsx
│   │   ├── Card.tsx
│   │   ├── Chip.tsx
│   │   ├── Divider.tsx
│   │   ├── EmptyState.tsx
│   │   ├── ErrorMessage.tsx
│   │   ├── Input.tsx
│   │   ├── LoadingSpinner.tsx
│   │   ├── ProgressBar.tsx
│   │   └── SearchBar.tsx
│   │
│   ├── screens/             # Screen components
│   │   ├── auth/           # Authentication screens
│   │   │   ├── LoginScreen.tsx
│   │   │   └── RegisterScreen.tsx
│   │   ├── onboarding/     # Onboarding flow
│   │   │   ├── GoalSelectionScreen.tsx
│   │   │   ├── FitnessLevelScreen.tsx
│   │   │   └── PreferencesScreen.tsx
│   │   ├── home/           # Dashboard
│   │   │   └── DashboardScreen.tsx
│   │   ├── workouts/       # Workout management
│   │   ├── workout/        # Active workout
│   │   ├── chat/           # AI chat
│   │   │   └── ChatScreen.tsx
│   │   └── profile/        # User profile
│   │
│   ├── navigation/         # Navigation setup
│   │   ├── AppNavigator.tsx
│   │   ├── AuthNavigator.tsx
│   │   ├── MainNavigator.tsx
│   │   ├── HomeNavigator.tsx
│   │   ├── OnboardingNavigator.tsx
│   │   └── WorkoutsNavigator.tsx
│   │
│   ├── contexts/           # React Context providers
│   │   ├── AuthContext.tsx
│   │   └── ThemeContext.tsx
│   │
│   ├── hooks/              # Custom React hooks
│   │   ├── useApi.ts
│   │   ├── useChat.ts
│   │   ├── useExercises.ts
│   │   ├── useStats.ts
│   │   └── useWorkout.ts
│   │
│   ├── services/           # API services
│   │   └── api.ts
│   │
│   ├── types/              # TypeScript types
│   │   └── index.ts
│   │
│   ├── utils/              # Utility functions
│   │   ├── constants.ts
│   │   ├── helpers.ts
│   │   ├── storage.ts
│   │   └── validation.ts
│   │
│   └── styles/             # Theme configuration
│       └── theme.ts
│
├── assets/                 # Static assets
│   └── fonts/
├── app.config.js          # Expo configuration
├── App.tsx                # Root component
└── index.ts               # Entry point
```

## Core Features

### 1. Authentication Flow

**Screens:**

- `LoginScreen` - Email/password login
- `RegisterScreen` - New user registration
- Biometric authentication support

**Features:**

- JWT token management
- Secure credential storage
- Auto-login on app launch
- Biometric unlock (Face ID/Touch ID)

### 2. Onboarding

**Screens:**

- `GoalSelectionScreen` - Choose fitness goal
- `FitnessLevelScreen` - Select experience level
- `PreferencesScreen` - Set workout preferences

**Data Collected:**

- Fitness goal (6 options)
- Fitness level (Beginner/Intermediate/Advanced)
- Available equipment
- Time per workout
- Days per week
- Exercise restrictions
- Avoided/preferred exercises

### 3. Dashboard (Home)

**Key Components:**

- User welcome header with avatar
- Current workout card
- Quick stats overview
- Recent activity feed
- Action buttons (Generate Workout, Start Chat)

**Features:**

- Pull-to-refresh
- Real-time stats updates
- Quick workout start
- Workout history preview

### 4. Workout Generation

**Process:**

1. User requests new workout
2. AI generates personalized plan based on preferences
3. Workout displayed with exercises, sets, reps
4. Option to start workout or regenerate

**Display:**

- Workout name and difficulty badge
- Estimated duration
- Exercise count
- Full exercise list with details

### 5. Active Workout Tracking

**Features:**

- Exercise-by-exercise progression
- Set/rep counter
- Rest timers with notifications
- Notes and form tips
- Pause/resume functionality
- Complete/abandon options

**UI Elements:**

- Progress bar
- Current exercise highlight
- Next exercise preview
- Interactive timers
- Completion confirmation

### 6. AI Chat Assistant

**Features:**

- Real-time chat interface
- Context-aware responses
- Exercise form tips
- Nutrition advice
- Motivation and encouragement
- Message history

**UI:**

- Bubble-style messages
- User/assistant differentiation
- Typing indicators
- Auto-scroll to latest
- Input with send button

### 7. Exercise Library

**Features:**

- Browse 50+ exercises
- Search and filter
- Muscle group categorization
- Equipment filtering
- Detailed instructions
- Video demonstrations (optional)

**Exercise Details:**

- Name and description
- Target muscle groups
- Required equipment
- Step-by-step instructions
- Difficulty level
- Thumbnail/video

### 8. Workout History

**Features:**

- List all past workouts
- Filter by date/status
- View workout details
- Performance metrics
- Delete workouts

### 9. User Profile & Settings

**Sections:**

- User information
- Fitness preferences
- Statistics dashboard
- Settings
- Logout

**Statistics:**

- Total workouts completed
- Current streak
- Longest streak
- Workouts this week
- Favorite exercises

## Component Library

### Base Components

#### Button

```typescript
interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: "primary" | "secondary" | "outline" | "text";
  size?: "small" | "medium" | "large";
  disabled?: boolean;
  loading?: boolean;
  icon?: string;
}
```

#### Card

```typescript
interface CardProps {
  children: React.ReactNode;
  variant?: "default" | "elevated" | "outlined";
  onPress?: () => void;
  style?: ViewStyle;
}
```

#### Input

```typescript
interface InputProps {
  label: string;
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  secureTextEntry?: boolean;
  error?: string;
  leftIcon?: string;
  rightIcon?: string;
}
```

#### Avatar

```typescript
interface AvatarProps {
  name?: string;
  imageUrl?: string;
  size?: number;
  onPress?: () => void;
}
```

#### Badge

```typescript
interface BadgeProps {
  label: string;
  variant?: "default" | "success" | "warning" | "error";
  difficulty?: "Beginner" | "Intermediate" | "Advanced";
}
```

## Navigation Structure

```
AppNavigator (Root)
├── SplashScreen
├── AuthNavigator
│   ├── LoginScreen
│   └── RegisterScreen
├── OnboardingNavigator
│   ├── GoalSelectionScreen
│   ├── FitnessLevelScreen
│   └── PreferencesScreen
└── MainNavigator (Bottom Tabs)
    ├── HomeTab (HomeNavigator)
    │   └── DashboardScreen
    ├── WorkoutsTab (WorkoutsNavigator)
    │   ├── WorkoutsListScreen
    │   ├── WorkoutDetailScreen
    │   └── ActiveWorkoutScreen
    ├── ChatTab
    │   └── ChatScreen
    └── ProfileTab
        └── ProfileScreen
```

## Type Definitions

### User

```typescript
interface User {
  id: string;
  email: string;
  fitness_goal: FitnessGoal;
  fitness_level: FitnessLevel;
  equipment: string[];
  time_per_workout: number;
  days_per_week: number;
  restrictions?: string;
  avoided_exercises: string[];
  preferred_exercises: string[];
  created_at: string;
  updated_at: string;
}

type FitnessGoal =
  | "Lose Weight"
  | "Build Muscle"
  | "Improve Endurance"
  | "General Fitness"
  | "Increase Flexibility"
  | "Sport Performance";

type FitnessLevel = "Beginner" | "Intermediate" | "Advanced";
```

### Workout

```typescript
interface WorkoutPlan {
  id: string;
  user_id: string;
  name: string;
  exercises: WorkoutExercise[];
  estimated_duration: number;
  difficulty: FitnessLevel;
  created_at: string;
}

interface WorkoutExercise {
  name: string;
  sets: number;
  reps: string;
  rest: number;
  notes?: string;
}

interface WorkoutSession {
  id: string;
  user_id: string;
  workout_plan_id: string;
  started_at: string;
  completed_at?: string;
  total_duration: number;
  status: "Completed" | "Abandoned" | "In Progress";
  feedback?: string;
}
```

### Exercise

```typescript
interface Exercise {
  id: string;
  name: string;
  description?: string;
  muscle_groups: string[];
  equipment: string[];
  instructions: string;
  difficulty: FitnessLevel;
  video_url?: string;
  thumbnail_url?: string;
  created_at: string;
}
```

## Custom Hooks

### useAuth

```typescript
const useAuth = () => {
  const login: (email: string, password: string) => Promise<void>;
  const register: (email: string, password: string) => Promise<void>;
  const logout: () => Promise<void>;
  const user: User | null;
  const loading: boolean;
  const isAuthenticated: boolean;
};
```

### useWorkout

```typescript
const useWorkout = () => {
  const workout: WorkoutPlan | null;
  const loading: boolean;
  const error: Error | null;
  const generateWorkout: () => Promise<void>;
  const getWorkout: (id: string) => Promise<void>;
  const completeWorkout: (id: string, feedback?: string) => Promise<void>;
};
```

### useChat

```typescript
const useChat = () => {
  const messages: ChatMessage[];
  const sendMessage: (content: string) => Promise<void>;
  const loading: boolean;
  const error: Error | null;
};
```

### useStats

```typescript
const useStats = () => {
  const stats: UserStats | null;
  const loading: boolean;
  const refresh: () => Promise<void>;
};
```

## Theme System

### Color Palette

```typescript
const colors = {
  // Primary
  primary: "#FF6B35", // Vibrant orange
  primaryDark: "#E55A2B",
  primaryLight: "#FF8559",

  // Background
  background: "#0A0E27", // Dark blue-black
  surface: "#1A1F3A", // Lighter surface
  surfaceVariant: "#2A2F4A",

  // Text
  text: "#FFFFFF",
  textSecondary: "#B8BCC8",
  textDisabled: "#6B7280",

  // Semantic
  success: "#10B981",
  warning: "#F59E0B",
  error: "#EF4444",
  info: "#3B82F6",

  // UI
  border: "#374151",
  divider: "#1F2937",
  overlay: "rgba(0, 0, 0, 0.5)",
};
```

### Typography

```typescript
const typography = {
  h1: { fontSize: 32, fontWeight: "700" },
  h2: { fontSize: 28, fontWeight: "700" },
  h3: { fontSize: 24, fontWeight: "600" },
  h4: { fontSize: 20, fontWeight: "600" },
  body1: { fontSize: 16, fontWeight: "400" },
  body2: { fontSize: 14, fontWeight: "400" },
  caption: { fontSize: 12, fontWeight: "400" },
  button: { fontSize: 16, fontWeight: "600" },
};
```

### Spacing

```typescript
const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};
```

## API Integration

### API Service

```typescript
// services/api.ts
class ApiService {
  private baseURL: string;
  private accessToken: string | null;

  // Auth
  async login(email: string, password: string): Promise<AuthSession>;
  async register(email: string, password: string): Promise<AuthSession>;
  async logout(): Promise<void>;
  async getCurrentUser(): Promise<User>;

  // Workouts
  async generateWorkout(): Promise<WorkoutPlan>;
  async getWorkouts(): Promise<WorkoutPlan[]>;
  async getWorkout(id: string): Promise<WorkoutPlan>;
  async completeWorkout(id: string, feedback?: string): Promise<void>;

  // Chat
  async sendMessage(content: string): Promise<ChatMessage>;
  async getChatHistory(): Promise<ChatMessage[]>;

  // Exercises
  async getExercises(): Promise<Exercise[]>;
  async searchExercises(query: string): Promise<Exercise[]>;

  // User
  async updatePreferences(data: Partial<User>): Promise<User>;
  async getStats(): Promise<UserStats>;
}
```

## Offline Support

### Strategy

- Cache workout plans locally
- Store user preferences
- Queue API requests when offline
- Sync when connection restored

### Implementation

- AsyncStorage for data persistence
- Network state detection
- Offline indicators in UI
- Background sync on reconnection

## Performance Optimization

### Techniques

- Memoization with `React.memo` and `useMemo`
- Lazy loading for screens
- Image optimization and caching
- Virtual lists for long content
- Debouncing search inputs
- Animation optimization with Reanimated

### Best Practices

- Avoid unnecessary re-renders
- Use FlatList for long lists
- Optimize images (WebP, appropriate sizes)
- Monitor bundle size
- Profile with React DevTools

## Accessibility

### Features

- Screen reader support
- Sufficient color contrast
- Touch target sizes (44x44 minimum)
- Keyboard navigation (web)
- Focus management
- Semantic HTML (web)

### Implementation

- `accessibilityLabel` on interactive elements
- `accessibilityHint` for context
- `accessibilityRole` for semantics
- Dynamic font scaling support

## Testing Strategy

### Unit Tests

- Component rendering
- Hook behavior
- Utility functions
- Validation logic

### Integration Tests

- Navigation flows
- API integration
- Context providers
- Form submissions

### E2E Tests (Optional)

- User authentication
- Workout generation
- Complete workout flow

## Build & Deployment

### Development Build

```bash
npx expo start
```

### Preview Build

```bash
eas build --platform ios --profile preview
eas build --platform android --profile preview
```

### Production Build

```bash
eas build --platform ios --profile production
eas build --platform android --profile production
```

### App Stores

- **iOS**: App Store Connect
- **Android**: Google Play Console

## Environment Variables

```env
EXPO_PUBLIC_API_URL=http://localhost:3000/api
EXPO_PUBLIC_SUPABASE_URL=your_supabase_url
EXPO_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
```

## Future Enhancements

- [ ] Social features (friends, challenges)
- [ ] Apple Health / Google Fit integration
- [ ] Video exercise demonstrations
- [ ] Custom workout builder
- [ ] Nutrition tracking
- [ ] Progress photos
- [ ] Achievement badges
- [ ] Dark/light theme toggle
- [ ] Multiple language support
- [ ] Apple Watch / Wear OS support

## Resources

- [React Native Docs](https://reactnative.dev/)
- [Expo Documentation](https://docs.expo.dev/)
- [React Navigation](https://reactnavigation.org/)
- [Reanimated Docs](https://docs.swmansion.com/react-native-reanimated/)
