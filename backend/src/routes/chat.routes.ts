import { Router } from "express";
import { ChatController } from "../controllers/chat.controller";
import { authenticate } from "../middleware/auth";
import { validateRequest } from "../middleware/validate-request";
import { ChatMessageSchema } from "../utils/validation";

const router = Router();
const chatController = new ChatController();

router.post(
  "/message",
  authenticate,
  validateRequest(ChatMessageSchema),
  chatController.sendMessage.bind(chatController)
);
router.get(
  "/messages",
  authenticate,
  chatController.getMessages.bind(chatController)
);

export default router;
