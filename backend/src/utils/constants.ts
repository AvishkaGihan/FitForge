export const MUSCLE_GROUPS = [
  "chest",
  "back",
  "shoulders",
  "biceps",
  "triceps",
  "legs",
  "glutes",
  "core",
  "cardio",
  "full_body",
] as const;

export const EQUIPMENT_TYPES = [
  "bodyweight",
  "dumbbells",
  "barbell",
  "bands",
  "bench",
  "pullup_bar",
  "gym",
] as const;

export const FITNESS_GOALS = [
  "Lose Weight",
  "Build Muscle",
  "Improve Endurance",
  "General Fitness",
  "Increase Flexibility",
  "Sport Performance",
] as const;

export const FITNESS_LEVELS = ["Beginner", "Intermediate", "Advanced"] as const;

export const WORKOUT_STATUS = [
  "Completed",
  "Abandoned",
  "In Progress",
] as const;

export const API_RATE_LIMITS = {
  DEFAULT: {
    maxRequests: 100,
    windowMs: 60000, // 1 minute
  },
  WORKOUT_GENERATION: {
    maxRequests: 10,
    windowMs: 3600000, // 1 hour
  },
  CHAT: {
    maxRequests: 50,
    windowMs: 3600000, // 1 hour
  },
} as const;

export const CACHE_TTL = {
  EXERCISES: 3600, // 1 hour
  USER_PROFILE: 300, // 5 minutes
  WORKOUT_PLANS: 1800, // 30 minutes
} as const;
