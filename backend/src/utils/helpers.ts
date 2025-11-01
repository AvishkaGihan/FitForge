import crypto from "crypto";

type DifficultyLevel = "Beginner" | "Intermediate" | "Advanced";

type Exercise = {
  difficulty: DifficultyLevel;
  // Add other exercise properties as needed
};

/**
 * Generate a random token
 */
export function generateToken(length: number = 32): string {
  return crypto.randomBytes(length).toString("hex");
}

/**
 * Calculate estimated calories burned
 */
export function calculateCalories(
  duration: number,
  intensity: "low" | "medium" | "high",
  weight: number = 70
): number {
  const mets = {
    low: 3,
    medium: 6,
    high: 9,
  };

  const met = mets[intensity];
  const hours = duration / 60;

  return Math.round(met * weight * hours);
}

/**
 * Format workout duration
 */
export function formatDuration(minutes: number): string {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;

  if (hours > 0) {
    return `${hours}h ${mins}m`;
  }
  return `${mins}m`;
}

/**
 * Validate environment variables
 */
export function validateEnv(required: string[]): void {
  const missing = required.filter((key) => !process.env[key]);

  if (missing.length > 0) {
    throw new Error(
      `Missing required environment variables: ${missing.join(", ")}`
    );
  }
}

/**
 * Sanitize user input
 */
export function sanitizeInput(input: string): string {
  return input
    .trim()
    .replace(/[<>]/g, "") // Remove potential HTML tags
    .substring(0, 1000); // Limit length
}

/**
 * Calculate workout difficulty score
 */
export function calculateDifficultyScore(
  exercises: Exercise[],
  userLevel: DifficultyLevel
): number {
  const levelScores: Record<DifficultyLevel, number> = {
    Beginner: 1,
    Intermediate: 2,
    Advanced: 3,
  };

  const userScore = levelScores[userLevel];
  const avgExerciseScore =
    exercises.reduce((sum, ex) => {
      return sum + levelScores[ex.difficulty];
    }, 0) / exercises.length;

  return avgExerciseScore / userScore;
}
