import { Router } from "express";
import { WorkoutController } from "../controllers/workout.controller";
import { authenticate } from "../middleware/auth";

const router = Router();
const workoutController = new WorkoutController();

router.post(
  "/generate",
  authenticate,
  workoutController.generateWorkout.bind(workoutController)
);
router.get(
  "/latest",
  authenticate,
  workoutController.getLatestWorkout.bind(workoutController)
);
router.get(
  "/:id",
  authenticate,
  workoutController.getWorkout.bind(workoutController)
);
router.get(
  "/",
  authenticate,
  workoutController.getUserWorkouts.bind(workoutController)
);
router.post(
  "/:id/complete",
  authenticate,
  workoutController.completeWorkout.bind(workoutController)
);

export default router;
