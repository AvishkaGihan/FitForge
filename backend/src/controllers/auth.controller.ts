import { Request, Response } from "express";
import { supabase, db } from "../services/database";
import { RegisterSchema, LoginSchema } from "../utils/validation";
import { logger } from "../utils/logger";
import { AuthRequest } from "../middleware/auth";

export class AuthController {
  async register(req: Request, res: Response): Promise<void> {
    try {
      const { email, password } = RegisterSchema.parse(req.body);

      // Register with Supabase Auth
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      });

      if (error) {
        logger.error("Registration error:", error);
        res.status(400).json({ error: error.message });
        return;
      }

      if (!data.user) {
        res.status(500).json({ error: "Failed to create user" });
        return;
      }

      // Create user profile with defaults
      await db.createUserProfile({
        id: data.user.id,
        email: email,
        fitness_goal: "General Fitness",
        fitness_level: "Beginner",
        equipment: ["bodyweight"],
        time_per_workout: 30,
        days_per_week: 3,
        avoided_exercises: [],
        preferred_exercises: [],
      });

      res.status(201).json({
        user: {
          id: data.user.id,
          email: data.user.email || email,
        },
        session: data.session,
      });
    } catch (error) {
      logger.error("Registration error:", error);
      res.status(500).json({ error: "Registration failed" });
    }
  }

  async login(req: Request, res: Response): Promise<void> {
    try {
      const { email, password } = LoginSchema.parse(req.body);

      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        logger.warn("Login failed:", error.message);
        res.status(401).json({ error: "Invalid credentials" });
        return;
      }

      res.json({
        user: {
          id: data.user.id,
          email: data.user.email,
        },
        session: data.session,
      });
    } catch (error) {
      logger.error("Login error:", error);
      res.status(500).json({ error: "Login failed" });
    }
  }

  async logout(req: AuthRequest, res: Response): Promise<void> {
    try {
      const authHeader = req.headers.authorization;
      const token = authHeader?.substring(7);

      if (token) {
        await supabase.auth.signOut();
      }

      res.json({ message: "Logged out successfully" });
    } catch (error) {
      logger.error("Logout error:", error);
      res.status(500).json({ error: "Logout failed" });
    }
  }

  async getCurrentUser(req: AuthRequest, res: Response): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({ error: "Unauthorized" });
        return;
      }

      const profile = await db.getUserProfile(req.user.id);

      res.json({
        id: req.user.id,
        email: req.user.email,
        ...profile,
      });
    } catch (error) {
      logger.error("Get current user error:", error);
      res.status(500).json({ error: "Failed to fetch user" });
    }
  }
}
