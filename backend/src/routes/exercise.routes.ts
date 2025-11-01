import { Router } from "express";
import { ExerciseController } from "../controllers/exercise.controller";
import { authenticate } from "../middleware/auth";

const router = Router();
const exerciseController = new ExerciseController();

router.get("/", authenticate, exerciseController.getAllExercises);
router.get("/search", authenticate, exerciseController.searchExercises);
router.get("/:id", authenticate, exerciseController.getExercise);

export default router;
