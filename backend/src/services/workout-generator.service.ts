import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { PromptTemplate } from "@langchain/core/prompts";
import { JsonOutputParser } from "@langchain/core/output_parsers";
import { logger } from "../utils/logger";

interface UserProfile {
  fitness_goal: string;
  fitness_level: string;
  equipment: string[];
  time_per_workout: number;
  restrictions?: string;
  avoided_exercises: string[];
  preferred_exercises: string[];
}

interface WorkoutPlan {
  name: string;
  estimatedDuration: number;
  exercises: Array<{
    name: string;
    sets: number;
    reps: string;
    rest: number;
    notes?: string;
  }>;
}

// Type guard function to validate workout plan structure
function isValidWorkoutPlan(obj: unknown): obj is WorkoutPlan {
  if (!obj || typeof obj !== "object") {
    return false;
  }

  const plan = obj as Record<string, unknown>;

  if (
    typeof plan.name !== "string" ||
    plan.name.trim().length === 0 ||
    typeof plan.estimatedDuration !== "number" ||
    plan.estimatedDuration <= 0 ||
    !Array.isArray(plan.exercises) ||
    plan.exercises.length === 0
  ) {
    return false;
  }

  return plan.exercises.every((exercise: unknown) => {
    if (!exercise || typeof exercise !== "object") {
      return false;
    }

    const ex = exercise as Record<string, unknown>;
    return (
      typeof ex.name === "string" &&
      typeof ex.sets === "number" &&
      typeof ex.reps === "string" &&
      typeof ex.rest === "number"
    );
  });
}

export class WorkoutGeneratorService {
  private model: ChatGoogleGenerativeAI;
  private parser: JsonOutputParser;

  constructor() {
    const apiKey = process.env.GOOGLE_GEMINI_API_KEY;

    if (!apiKey) {
      throw new Error("GOOGLE_GEMINI_API_KEY not configured");
    }

    this.model = new ChatGoogleGenerativeAI({
      apiKey,
      model: "gemini-1.5-flash",
      temperature: 0.7,
      maxOutputTokens: 2048,
    });

    this.parser = new JsonOutputParser();
  }

  async generateWorkout(profile: UserProfile): Promise<WorkoutPlan> {
    try {
      const prompt = PromptTemplate.fromTemplate(`
You are an expert fitness coach creating personalized workout plans.

User Profile:
- Goal: {goal}
- Fitness Level: {level}
- Available Equipment: {equipment}
- Time Available: {time} minutes
- Restrictions: {restrictions}
- Exercises to Avoid: {avoided}
- Preferred Exercises: {preferred}

Create a workout plan that matches this profile. The workout should:
1. Align with their fitness goal
2. Be appropriate for their fitness level
3. Use only available equipment
4. Fit within the time constraint
5. Avoid restricted exercises
6. Include preferred exercises when possible

CRITICAL: Return ONLY valid JSON in this exact format (no markdown, no extra text, no code blocks):
{
  "name": "Descriptive workout name (required, non-empty string)",
  "estimatedDuration": <number in minutes, must be positive>,
  "exercises": [
    {
      "name": "Exercise name (required, non-empty string)",
      "sets": <number, must be positive>,
      "reps": "rep range or duration (required, non-empty string)",
      "rest": <seconds, must be positive>,
      "notes": "Form tips or modifications (optional)"
    }
  ]
}

Include 5-8 exercises with proper warm-up considerations. The 'name' field MUST be a non-empty string.
`);

      const chain = prompt.pipe(this.model).pipe(this.parser);

      const result = await chain.invoke({
        goal: profile.fitness_goal,
        level: profile.fitness_level,
        equipment: profile.equipment.join(", ") || "bodyweight only",
        time: profile.time_per_workout,
        restrictions: profile.restrictions || "none",
        avoided: profile.avoided_exercises.join(", ") || "none",
        preferred: profile.preferred_exercises.join(", ") || "no preference",
      });

      logger.info("Raw API response:", result);

      // Validate the response structure
      if (!isValidWorkoutPlan(result)) {
        logger.error("Invalid workout plan structure:", result);
        throw new Error(
          "AI returned invalid workout plan format. Please try again."
        );
      }

      logger.info("Workout generated successfully");
      return result;
    } catch (error) {
      logger.error("Workout generation error:", error);

      // Provide more specific error messages
      if (error instanceof Error) {
        if (error.message.includes("API_KEY")) {
          throw new Error("Invalid or missing Google Gemini API key");
        }
        if (
          error.message.includes("quota") ||
          error.message.includes("rate limit")
        ) {
          throw new Error(
            "Google Gemini API quota exceeded. Please try again later."
          );
        }
        if (
          error.message.includes("model") ||
          error.message.includes("not found")
        ) {
          throw new Error("Invalid Gemini model specified");
        }
      }

      // Fallback: Generate a basic workout if AI fails
      logger.warn("AI generation failed, using fallback workout");
      return this.generateFallbackWorkout(profile);
    }
  }

  // Fallback workout generator for when AI fails
  private generateFallbackWorkout(profile: UserProfile): WorkoutPlan {
    const baseExercises = {
      "Lose Weight": [
        {
          name: "Jumping Jacks",
          sets: 3,
          reps: "30 seconds",
          rest: 30,
          notes: "Keep a steady pace",
        },
        {
          name: "Push-ups",
          sets: 3,
          reps: "8-12 reps",
          rest: 60,
          notes: "Modify on knees if needed",
        },
        {
          name: "Squats",
          sets: 3,
          reps: "10-15 reps",
          rest: 60,
          notes: "Keep knees behind toes",
        },
        {
          name: "Plank",
          sets: 3,
          reps: "20-30 seconds",
          rest: 45,
          notes: "Keep body straight",
        },
        {
          name: "Burpees",
          sets: 3,
          reps: "5-8 reps",
          rest: 60,
          notes: "Modify without jump if needed",
        },
      ],
      "Build Muscle": [
        {
          name: "Push-ups",
          sets: 4,
          reps: "8-12 reps",
          rest: 90,
          notes: "Full range of motion",
        },
        {
          name: "Squats",
          sets: 4,
          reps: "10-15 reps",
          rest: 90,
          notes: "Go deep but keep form",
        },
        {
          name: "Lunges",
          sets: 3,
          reps: "8-10 reps per leg",
          rest: 60,
          notes: "Alternate legs",
        },
        {
          name: "Mountain Climbers",
          sets: 3,
          reps: "20 reps per leg",
          rest: 45,
          notes: "Keep core engaged",
        },
        {
          name: "Superman",
          sets: 3,
          reps: "10-15 reps",
          rest: 60,
          notes: "Lift arms and legs off ground",
        },
      ],
      "Improve Endurance": [
        {
          name: "High Knees",
          sets: 3,
          reps: "45 seconds",
          rest: 30,
          notes: "Drive knees up high",
        },
        {
          name: "Jumping Jacks",
          sets: 4,
          reps: "1 minute",
          rest: 30,
          notes: "Continuous motion",
        },
        {
          name: "Burpees",
          sets: 3,
          reps: "10 reps",
          rest: 60,
          notes: "Full movement",
        },
        {
          name: "Mountain Climbers",
          sets: 3,
          reps: "45 seconds",
          rest: 45,
          notes: "Fast pace",
        },
        {
          name: "Squats",
          sets: 3,
          reps: "15-20 reps",
          rest: 45,
          notes: "Quick tempo",
        },
      ],
    };

    const exercises =
      baseExercises[profile.fitness_goal as keyof typeof baseExercises] ||
      baseExercises["Improve Endurance"];
    const estimatedDuration = Math.min(profile.time_per_workout, 45);

    return {
      name: `${profile.fitness_goal} Workout - ${profile.fitness_level} Level`,
      estimatedDuration,
      exercises: exercises.slice(0, Math.floor(estimatedDuration / 8)), // Adjust exercise count based on time
    };
  }
}
