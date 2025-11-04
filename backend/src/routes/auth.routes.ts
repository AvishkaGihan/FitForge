import { Router } from "express";
import { AuthController } from "../controllers/auth.controller";
import { authenticate } from "../middleware/auth";
import { validateRequest } from "../middleware/validate-request";
import { RegisterSchema, LoginSchema } from "../utils/validation";

const router = Router();
const authController = new AuthController();

router.post(
  "/register",
  validateRequest(RegisterSchema),
  authController.register.bind(authController)
);
router.post(
  "/login",
  validateRequest(LoginSchema),
  authController.login.bind(authController)
);
router.post(
  "/logout",
  authenticate,
  authController.logout.bind(authController)
);
router.get(
  "/me",
  authenticate,
  authController.getCurrentUser.bind(authController)
);

export default router;
