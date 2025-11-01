import { z } from 'zod';

export const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
});

export const registerSchema = z
  .object({
    email: z.string().email('Invalid email address'),
    password: z.string().min(8, 'Password must be at least 8 characters'),
    confirmPassword: z.string(),
  })
  .refine(data => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

export const profileSchema = z.object({
  fitness_goal: z.enum([
    'Lose Weight',
    'Build Muscle',
    'Improve Endurance',
    'General Fitness',
    'Increase Flexibility',
    'Sport Performance',
  ]),
  fitness_level: z.enum(['Beginner', 'Intermediate', 'Advanced']),
  equipment: z.array(z.string()).min(1, 'Select at least one equipment option'),
  time_per_workout: z.number().min(1, 'Select workout duration'),
  days_per_week: z.number().min(1).max(7),
  restrictions: z.string().optional(),
  avoided_exercises: z.array(z.string()).optional(),
  preferred_exercises: z.array(z.string()).optional(),
});
