export interface User {
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

export type FitnessGoal =
  | 'Lose Weight'
  | 'Build Muscle'
  | 'Improve Endurance'
  | 'General Fitness'
  | 'Increase Flexibility'
  | 'Sport Performance';

export type FitnessLevel = 'Beginner' | 'Intermediate' | 'Advanced';

export interface Exercise {
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

export interface WorkoutPlan {
  id: string;
  user_id: string;
  name: string;
  exercises: WorkoutExercise[];
  estimated_duration: number;
  difficulty: FitnessLevel;
  created_at: string;
}

export interface WorkoutExercise {
  name: string;
  sets: number;
  reps: string;
  rest: number;
  notes?: string;
}

export interface WorkoutSession {
  id: string;
  user_id: string;
  workout_plan_id: string;
  started_at: string;
  completed_at?: string;
  total_duration: number;
  status: 'Completed' | 'Abandoned' | 'In Progress';
  feedback?: string;
}

export interface ChatMessage {
  id: string;
  user_id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

export interface UserStats {
  total_workouts: number;
  current_streak: number;
  longest_streak: number;
  workouts_this_week: number;
}

export interface AuthSession {
  access_token: string;
  expires_at: number;
  user: {
    id: string;
    email: string;
  };
}

// Navigation types
export type RootStackParamList = {
  Splash: undefined;
  Auth: undefined;
  Main: undefined;
  Onboarding: undefined;
};

export type AuthStackParamList = {
  Login: undefined;
  Register: undefined;
};

export type OnboardingStackParamList = {
  GoalSelection: undefined;
  FitnessLevel: undefined;
  TimeFrequency: undefined;
  Preferences: undefined;
  ProfileSummary: undefined;
};

export type MainTabParamList = {
  Home: undefined;
  Workouts: undefined;
  Chat: undefined;
  Profile: undefined;
};

export type HomeStackParamList = {
  Dashboard: undefined;
  WorkoutDetail: { workoutId: string };
  ActiveWorkout: { workoutId: string };
  WorkoutComplete: { sessionId: string };
};

export type WorkoutsStackParamList = {
  WorkoutsList: undefined;
  ExerciseLibrary: undefined;
  ExerciseDetail: { exerciseId: string };
};
