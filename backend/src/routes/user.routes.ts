import { Router } from "express";
import { UserController } from "../controllers/user.controller";
import { authenticate } from "../middleware/auth";
import { validateRequest } from "../middleware/validate-request";
import { UserProfileSchema } from "../utils/validation";

const router = Router();
const userController = new UserController();

router.get("/profile", authenticate, userController.getProfile);
router.patch(
  "/profile",
  authenticate,
  validateRequest(UserProfileSchema),
  userController.updateProfile
);
router.get("/stats", authenticate, userController.getStats);

export default router;
