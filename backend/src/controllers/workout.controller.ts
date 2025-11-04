import { Response } from "express";
import { AuthRequest } from "../middleware/auth";
import { db } from "../services/database";
import { WorkoutGeneratorService } from "../services/workout-generator.service";
import { logger } from "../utils/logger";

export class WorkoutController {
  private workoutGenerator = new WorkoutGeneratorService();

  async generateWorkout(req: AuthRequest, res: Response): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({ error: "Unauthorized" });
        return;
      }

      // Get user profile
      const profile = await db.getUserProfile(req.user.id);

      // Generate workout using AI
      const workout = await this.workoutGenerator.generateWorkout(profile);

      // Validate workout data before saving
      if (!workout || !workout.name || !workout.name.trim()) {
        logger.error("Invalid workout generated - missing name:", workout);
        res
          .status(503)
          .json({
            error: "Failed to generate valid workout. Please try again.",
          });
        return;
      }

      if (
        !workout.exercises ||
        !Array.isArray(workout.exercises) ||
        workout.exercises.length === 0
      ) {
        logger.error("Invalid workout generated - no exercises:", workout);
        res
          .status(503)
          .json({
            error: "Failed to generate workout exercises. Please try again.",
          });
        return;
      }

      // Save to database
      const savedWorkout = await db.createWorkoutPlan({
        user_id: req.user.id,
        name: workout.name.trim(),
        exercises: workout.exercises,
        estimated_duration: workout.estimatedDuration,
        difficulty: profile.fitness_level,
      });

      res.json(savedWorkout);
    } catch (error) {
      logger.error("Generate workout error:", error);
      res
        .status(503)
        .json({ error: "Failed to generate workout. Please try again." });
    }
  }

  async getLatestWorkout(req: AuthRequest, res: Response): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({ error: "Unauthorized" });
        return;
      }

      const workout = await db.getLatestWorkout(req.user.id);

      if (!workout) {
        res.status(404).json({ error: "No workouts found" });
        return;
      }

      res.json(workout);
    } catch (error) {
      logger.error("Get latest workout error:", error);
      res.status(500).json({ error: "Failed to fetch workout" });
    }
  }

  async getWorkout(req: AuthRequest, res: Response): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({ error: "Unauthorized" });
        return;
      }

      const workout = await db.getWorkoutPlan(req.params.id);

      // Verify ownership
      if (workout.user_id !== req.user.id) {
        res.status(403).json({ error: "Forbidden" });
        return;
      }

      res.json(workout);
    } catch (error) {
      logger.error("Get workout error:", error);
      res.status(500).json({ error: "Failed to fetch workout" });
    }
  }

  async getUserWorkouts(req: AuthRequest, res: Response): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({ error: "Unauthorized" });
        return;
      }

      const limit = parseInt(req.query.limit as string) || 10;
      const workouts = await db.getUserWorkouts(req.user.id, limit);

      res.json(workouts);
    } catch (error) {
      logger.error("Get user workouts error:", error);
      res.status(500).json({ error: "Failed to fetch workouts" });
    }
  }

  async completeWorkout(req: AuthRequest, res: Response): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({ error: "Unauthorized" });
        return;
      }

      const { feedback, total_duration } = req.body;

      // Create workout session
      const session = await db.createWorkoutSession({
        user_id: req.user.id,
        workout_plan_id: req.params.id,
        started_at: new Date().toISOString(),
        total_duration,
        status: "In Progress",
      });

      // Complete the session
      const completed = await db.completeWorkoutSession(session.id, {
        feedback,
        total_duration,
      });

      res.json(completed);
    } catch (error) {
      logger.error("Complete workout error:", error);
      res.status(500).json({ error: "Failed to complete workout" });
    }
  }
}
