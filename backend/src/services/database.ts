import { createClient, SupabaseClient } from "@supabase/supabase-js";
import { logger } from "../utils/logger";

const supabaseUrl = process.env.SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

if (!supabaseUrl || !supabaseServiceKey) {
  throw new Error("Missing Supabase environment variables");
}

export const supabase: SupabaseClient = createClient(
  supabaseUrl,
  supabaseServiceKey,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  }
);

// Database service class
export class DatabaseService {
  // User operations
  async getUserProfile(userId: string) {
    const { data, error } = await supabase
      .from("users")
      .select("*")
      .eq("id", userId)
      .single();

    if (error) {
      logger.error("Error fetching user profile:", error);
      throw error;
    }
    return data;
  }

  async createUserProfile(profile: any) {
    const { data, error } = await supabase
      .from("users")
      .insert(profile)
      .select()
      .single();

    if (error) {
      logger.error("Error creating user profile:", error);
      throw error;
    }
    return data;
  }

  async updateUserProfile(userId: string, updates: any) {
    const { data, error } = await supabase
      .from("users")
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq("id", userId)
      .select()
      .single();

    if (error) {
      logger.error("Error updating user profile:", error);
      throw error;
    }
    return data;
  }

  // Workout operations
  async createWorkoutPlan(workoutPlan: any) {
    const { data, error } = await supabase
      .from("workout_plans")
      .insert(workoutPlan)
      .select()
      .single();

    if (error) {
      logger.error("Error creating workout plan:", error);
      throw error;
    }
    return data;
  }

  async getWorkoutPlan(workoutId: string) {
    const { data, error } = await supabase
      .from("workout_plans")
      .select("*")
      .eq("id", workoutId)
      .single();

    if (error) {
      logger.error("Error fetching workout plan:", error);
      throw error;
    }
    return data;
  }

  async getLatestWorkout(userId: string) {
    const { data, error } = await supabase
      .from("workout_plans")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    if (error) {
      logger.error("Error fetching latest workout:", error);
      throw error;
    }
    return data;
  }

  async getUserWorkouts(userId: string, limit = 10) {
    const { data, error } = await supabase
      .from("workout_plans")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false })
      .limit(limit);

    if (error) {
      logger.error("Error fetching user workouts:", error);
      throw error;
    }
    return data || [];
  }

  // Exercise operations
  async getAllExercises() {
    const { data, error } = await supabase
      .from("exercises")
      .select("*")
      .order("name");

    if (error) {
      logger.error("Error fetching exercises:", error);
      throw error;
    }
    return data || [];
  }

  async getExerciseById(exerciseId: string) {
    const { data, error } = await supabase
      .from("exercises")
      .select("*")
      .eq("id", exerciseId)
      .single();

    if (error) {
      logger.error("Error fetching exercise:", error);
      throw error;
    }
    return data;
  }

  async searchExercises(filters: any) {
    let query = supabase.from("exercises").select("*");

    if (filters.muscle_groups?.length) {
      query = query.overlaps("muscle_groups", filters.muscle_groups);
    }

    if (filters.equipment?.length) {
      query = query.overlaps("equipment", filters.equipment);
    }

    if (filters.difficulty) {
      query = query.eq("difficulty", filters.difficulty);
    }

    const { data, error } = await query.order("name");

    if (error) {
      logger.error("Error searching exercises:", error);
      throw error;
    }
    return data || [];
  }

  // Workout session operations
  async createWorkoutSession(session: any) {
    const { data, error } = await supabase
      .from("workout_sessions")
      .insert(session)
      .select()
      .single();

    if (error) {
      logger.error("Error creating workout session:", error);
      throw error;
    }
    return data;
  }

  async completeWorkoutSession(sessionId: string, completionData: any) {
    const { data, error } = await supabase
      .from("workout_sessions")
      .update({
        ...completionData,
        completed_at: new Date().toISOString(),
        status: "Completed",
      })
      .eq("id", sessionId)
      .select()
      .single();

    if (error) {
      logger.error("Error completing workout session:", error);
      throw error;
    }
    return data;
  }

  async getUserStats(userId: string) {
    // Get workout count
    const { count: workoutCount } = await supabase
      .from("workout_sessions")
      .select("*", { count: "exact", head: true })
      .eq("user_id", userId)
      .eq("status", "Completed");

    // Get recent sessions for streak calculation
    const { data: recentSessions } = await supabase
      .from("workout_sessions")
      .select("completed_at")
      .eq("user_id", userId)
      .eq("status", "Completed")
      .order("completed_at", { ascending: false })
      .limit(30);

    return {
      total_workouts: workoutCount || 0,
      recent_sessions: recentSessions || [],
    };
  }
}

export const db = new DatabaseService();
