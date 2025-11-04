import { Router } from "express";
import { ExerciseController } from "../controllers/exercise.controller";
import { authenticate } from "../middleware/auth";

const router = Router();
const exerciseController = new ExerciseController();

router.get(
  "/",
  authenticate,
  exerciseController.getAllExercises.bind(exerciseController)
);
router.get(
  "/search",
  authenticate,
  exerciseController.searchExercises.bind(exerciseController)
);
router.get(
  "/:id",
  authenticate,
  exerciseController.getExercise.bind(exerciseController)
);

export default router;
