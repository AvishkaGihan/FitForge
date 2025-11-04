import { Router } from "express";
import { UserController } from "../controllers/user.controller";
import { authenticate } from "../middleware/auth";
import { validateRequest } from "../middleware/validate-request";
import { UserProfileSchema } from "../utils/validation";

const router = Router();
const userController = new UserController();

router.get(
  "/profile",
  authenticate,
  userController.getProfile.bind(userController)
);
router.patch(
  "/profile",
  authenticate,
  validateRequest(UserProfileSchema),
  userController.updateProfile.bind(userController)
);
router.get(
  "/stats",
  authenticate,
  userController.getStats.bind(userController)
);

export default router;
