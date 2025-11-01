import { Router } from "express";
import { WorkoutController } from "../controllers/workout.controller";
import { authenticate } from "../middleware/auth";

const router = Router();
const workoutController = new WorkoutController();

router.post("/generate", authenticate, workoutController.generateWorkout);
router.get("/latest", authenticate, workoutController.getLatestWorkout);
router.get("/:id", authenticate, workoutController.getWorkout);
router.get("/", authenticate, workoutController.getUserWorkouts);
router.post("/:id/complete", authenticate, workoutController.completeWorkout);

export default router;
