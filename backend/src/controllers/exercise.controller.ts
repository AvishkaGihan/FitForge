import { Response } from "express";
import { AuthRequest } from "../middleware/auth";
import { db } from "../services/database";
import { logger } from "../utils/logger";

export class ExerciseController {
  async getAllExercises(_req: AuthRequest, res: Response): Promise<void> {
    try {
      const exercises = await db.getAllExercises();
      res.json(exercises);
    } catch (error) {
      logger.error("Get all exercises error:", error);
      res.status(500).json({ error: "Failed to fetch exercises" });
    }
  }

  async searchExercises(req: AuthRequest, res: Response): Promise<void> {
    try {
      const filters = {
        muscle_groups: req.query.muscle_groups
          ? (req.query.muscle_groups as string).split(",")
          : undefined,
        equipment: req.query.equipment
          ? (req.query.equipment as string).split(",")
          : undefined,
        difficulty: req.query.difficulty as string,
      };

      const exercises = await db.searchExercises(filters);
      res.json(exercises);
    } catch (error) {
      logger.error("Search exercises error:", error);
      res.status(500).json({ error: "Failed to search exercises" });
    }
  }

  async getExercise(req: AuthRequest, res: Response): Promise<void> {
    try {
      const exercise = await db.getExerciseById(req.params.id);
      res.json(exercise);
    } catch (error) {
      logger.error("Get exercise error:", error);
      res.status(500).json({ error: "Failed to fetch exercise" });
    }
  }
}
