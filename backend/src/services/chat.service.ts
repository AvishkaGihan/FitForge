import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { PromptTemplate } from "@langchain/core/prompts";
import { RunnableSequence } from "@langchain/core/runnables";
import { StringOutputParser } from "@langchain/core/output_parsers";
import { supabase, db } from "./database";
import { logger } from "../utils/logger";

export class ChatService {
  private model: ChatGoogleGenerativeAI;

  constructor() {
    const apiKey = process.env.GOOGLE_GEMINI_API_KEY;

    if (!apiKey) {
      throw new Error("GOOGLE_GEMINI_API_KEY not configured");
    }

    this.model = new ChatGoogleGenerativeAI({
      apiKey,
      model: "gemini-2.5-flash",
      temperature: 0.8,
      maxOutputTokens: 1024,
    });
  }

  async processMessage(userId: string, message: string): Promise<string> {
    try {
      // Get user profile for context
      const profile = await db.getUserProfile(userId);

      // Get chat history for context
      const history = await this.getMessageHistory(userId, 10);
      const chatHistoryText = history
        .map(
          (msg) =>
            `${msg.role === "user" ? "User" : "Assistant"}: ${msg.content}`
        )
        .join("\n");

      const prompt = PromptTemplate.fromTemplate(`
You are a knowledgeable and supportive fitness coach assistant. You help users with:
- Exercise form and technique
- Workout modifications
- Fitness motivation
- Basic nutrition guidance
- Progress tracking advice

User Context:
- Goal: {goal}
- Fitness Level: {level}
- Equipment: {equipment}

Important guidelines:
- Be encouraging and motivational
- Provide practical, actionable advice
- If asked about medical issues, remind them to consult a healthcare professional
- Keep responses concise (2-3 paragraphs max)
- Use a friendly, professional tone

Previous conversation:
{chat_history}

User: {input}
Assistant:`);

      // Create a chain using the new Runnable interface
      const chain = RunnableSequence.from([
        prompt,
        this.model,
        new StringOutputParser(),
      ]);

      const response = await chain.invoke({
        input: message,
        goal: profile.fitness_goal,
        level: profile.fitness_level,
        equipment: profile.equipment.join(", ") || "bodyweight",
        chat_history: chatHistoryText || "No previous messages",
      });

      // Save message to database
      await this.saveMessage(userId, "user", message);
      await this.saveMessage(userId, "assistant", response);

      logger.info("Chat message processed successfully");
      return response;
    } catch (error) {
      logger.error("Chat processing error:", error);
      throw new Error("Failed to process chat message");
    }
  }

  private async saveMessage(userId: string, role: string, content: string) {
    try {
      // Note: This assumes you have a 'chat_messages' table.
      // You'll need to add this to your Supabase schema if you haven't.
      await supabase.from("chat_messages").insert({
        user_id: userId,
        role,
        content,
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      logger.error("Error saving message:", error);
    }
  }

  async getMessageHistory(userId: string, limit: number = 50) {
    try {
      // This also assumes the 'chat_messages' table exists.
      const { data, error } = await supabase
        .from("chat_messages")
        .select("*")
        .eq("user_id", userId)
        .order("timestamp", { ascending: false })
        .limit(limit);

      if (error) throw error;
      return data?.reverse() || [];
    } catch (error) {
      logger.error("Error fetching message history:", error);
      return [];
    }
  }
}
