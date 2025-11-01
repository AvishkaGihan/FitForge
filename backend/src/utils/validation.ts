import { z } from "zod";

export const RegisterSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

export const LoginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

export const UserProfileSchema = z.object({
  fitness_goal: z.enum([
    "Lose Weight",
    "Build Muscle",
    "Improve Endurance",
    "General Fitness",
    "Increase Flexibility",
    "Sport Performance",
  ]),
  fitness_level: z.enum(["Beginner", "Intermediate", "Advanced"]),
  equipment: z.array(z.string()),
  time_per_workout: z.number().min(1),
  days_per_week: z.number().min(1).max(7),
  restrictions: z.string().optional(),
  avoided_exercises: z.array(z.string()).optional(),
  preferred_exercises: z.array(z.string()).optional(),
});

export const ChatMessageSchema = z.object({
  message: z.string().min(1).max(500, "Message too long (max 500 characters)"),
});
