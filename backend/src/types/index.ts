// User types
export interface User {
  id: string;
  email: string;
  password_hash: string;
  first_name?: string;
  last_name?: string;
  age?: number;
  gender?: string;
  fitness_level: string;
  fitness_goal: string;
  equipment: string[];
  time_per_workout: number;
  restrictions?: string;
  avoided_exercises: string[];
  preferred_exercises: string[];
  created_at: string;
  updated_at: string;
}

export interface UserProfileUpdate {
  first_name?: string;
  last_name?: string;
  age?: number;
  gender?: string;
  fitness_level?: string;
  fitness_goal?: string;
  equipment?: string[];
  time_per_workout?: number;
  restrictions?: string;
  avoided_exercises?: string[];
  preferred_exercises?: string[];
}

// Exercise types
export interface Exercise {
  id: string;
  name: string;
  description: string;
  muscle_groups: string[];
  equipment: string[];
  difficulty: string;
  instructions?: string;
  created_at: string;
  updated_at: string;
}

export interface ExerciseFilters {
  muscle_groups?: string[];
  equipment?: string[];
  difficulty?: string;
}

// Workout types
export interface WorkoutPlan {
  id: string;
  user_id: string;
  name: string;
  description?: string;
  exercises: WorkoutExercise[];
  estimated_duration: number;
  created_at: string;
  updated_at: string;
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
  status: "In Progress" | "Completed" | "Abandoned";
  completed_at?: string;
  created_at: string;
}

export interface WorkoutSessionCompletion {
  exercises_completed: number;
  total_duration: number;
  notes?: string;
}

// Chat types
export interface ChatMessage {
  id: string;
  user_id: string;
  message: string;
  response: string;
  created_at: string;
}

// Pinecone metadata types
export interface PineconeMetadata {
  name: string;
  muscle_groups: string[];
  equipment: string[];
  difficulty: string;
}

export interface PineconeMatch {
  id: string;
  score: number;
  metadata?: PineconeMetadata;
}
