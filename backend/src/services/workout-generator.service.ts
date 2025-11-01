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

Return ONLY valid JSON in this exact format (no markdown, no extra text):
{{
  "name": "Descriptive workout name",
  "estimatedDuration": <number in minutes>,
  "exercises": [
    {{
      "name": "Exercise name",
      "sets": <number>,
      "reps": "rep range or duration",
      "rest": <seconds>,
      "notes": "Form tips or modifications"
    }}
  ]
}}

Include 5-8 exercises with proper warm-up considerations.
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

      logger.info("Workout generated successfully");
      return result as WorkoutPlan;
    } catch (error) {
      logger.error("Workout generation error:", error);
      throw new Error("Failed to generate workout plan");
    }
  }
}
