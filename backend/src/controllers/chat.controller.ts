import { Response } from "express";
import { AuthRequest } from "../middleware/auth";
import { ChatService } from "../services/chat.service";
import { ChatMessageSchema } from "../utils/validation";
import { logger } from "../utils/logger";

export class ChatController {
  private chatService = new ChatService();

  async sendMessage(req: AuthRequest, res: Response): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({ error: "Unauthorized" });
        return;
      }

      const { message } = ChatMessageSchema.parse(req.body);

      const response = await this.chatService.processMessage(
        req.user.id,
        message
      );

      res.json({
        response,
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      logger.error("Chat message error:", error);
      res.status(500).json({ error: "Failed to process message" });
    }
  }

  async getMessages(req: AuthRequest, res: Response): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({ error: "Unauthorized" });
        return;
      }

      const limit = parseInt(req.query.limit as string) || 50;
      const messages = await this.chatService.getMessageHistory(
        req.user.id,
        limit
      );

      res.json(messages);
    } catch (error) {
      logger.error("Get messages error:", error);
      res.status(500).json({ error: "Failed to fetch messages" });
    }
  }
}
