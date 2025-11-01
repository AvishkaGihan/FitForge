import { Response } from "express";
import { AuthRequest } from "../middleware/auth";
import { db } from "../services/database";
import { UserProfileSchema } from "../utils/validation";
import { logger } from "../utils/logger";

export class UserController {
  async getProfile(req: AuthRequest, res: Response): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({ error: "Unauthorized" });
        return;
      }

      const profile = await db.getUserProfile(req.user.id);
      res.json(profile);
    } catch (error) {
      logger.error("Get profile error:", error);
      res.status(500).json({ error: "Failed to fetch profile" });
    }
  }

  async updateProfile(req: AuthRequest, res: Response): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({ error: "Unauthorized" });
        return;
      }

      // .partial() makes all fields in the schema optional
      const updates = UserProfileSchema.partial().parse(req.body);
      const updatedProfile = await db.updateUserProfile(req.user.id, updates);

      res.json(updatedProfile);
    } catch (error) {
      logger.error("Update profile error:", error);
      res.status(500).json({ error: "Failed to update profile" });
    }
  }

  async getStats(req: AuthRequest, res: Response): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({ error: "Unauthorized" });
        return;
      }

      const stats = await db.getUserStats(req.user.id);

      // Calculate streak
      let currentStreak = 0;
      let longestStreak = 0;
      let tempStreak = 0;

      if (stats.recent_sessions && stats.recent_sessions.length > 0) {
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const sessionDates = stats.recent_sessions
          .map((s) => {
            const date = new Date(s.completed_at);
            date.setHours(0, 0, 0, 0);
            return date.getTime();
          })
          .filter((date, index, self) => self.indexOf(date) === index) // Get unique days
          .sort((a, b) => b - a); // Sort descending

        // Calculate current streak
        let expectedDate = today.getTime();
        for (const sessionDate of sessionDates) {
          if (sessionDate === expectedDate) {
            currentStreak++;
            expectedDate -= 86400000; // 1 day in ms
          } else {
            break;
          }
        }

        // Calculate longest streak
        tempStreak = 1;
        longestStreak = 1; // Default to 1 if any sessions exist
        for (let i = 1; i < sessionDates.length; i++) {
          if (sessionDates[i - 1] - sessionDates[i] === 86400000) {
            tempStreak++;
            longestStreak = Math.max(longestStreak, tempStreak);
          } else {
            tempStreak = 1;
          }
        }
        longestStreak = Math.max(longestStreak, tempStreak);
      }

      res.json({
        total_workouts: stats.total_workouts,
        current_streak: currentStreak,
        longest_streak: longestStreak,
        workouts_this_week:
          stats.recent_sessions?.filter((s) => {
            const sessionDate = new Date(s.completed_at);
            const weekAgo = new Date();
            weekAgo.setDate(weekAgo.getDate() - 7);
            return sessionDate >= weekAgo;
          }).length || 0,
      });
    } catch (error) {
      logger.error("Get stats error:", error);
      res.status(500).json({ error: "Failed to fetch stats" });
    }
  }
}
